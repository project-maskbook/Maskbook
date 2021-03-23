import {
    DebankTransactionDirection,
    HISTORY_RESPONSE,
    Transaction,
    TransactionItem,
    TransactionProvider,
    ZerionRBDTransactionType,
    ZerionTransactionStatus,
} from '../types'
import * as DeBankAPI from '../apis/debank'
import * as ZerionApi from '../apis/zerion'
import { isNil } from 'lodash-es'
import BigNumber from 'bignumber.js'

export async function getTransactionList(address: string, provider: TransactionProvider): Promise<Transaction[]> {
    if (provider === TransactionProvider.DEBANK) {
        const { data, error_code } = await DeBankAPI.getTransactionList(address)
        if (error_code !== 0) throw new Error('Fail to load transactions.')
        return fromDeBank(data)
    } else if (provider === TransactionProvider.ZERION) {
        const { payload, meta } = await ZerionApi.getTransactionList(address)
        if (meta.status !== 'ok') throw new Error('Fail to load transactions.')
        return fromZerion(payload.transactions)
    }
    return []
}

function fromDeBank({ cate_dict, history_list, token_dict }: HISTORY_RESPONSE['data']) {
    return history_list
        .filter((transaction) => transaction.tx?.name ?? transaction.cate_id)
        .filter(({ cate_id }) => cate_id !== 'approve')
        .map((transaction) => {
            let type = transaction.tx?.name
            if (isNil(type) && !isNil(transaction.cate_id)) {
                type = cate_dict[transaction.cate_id].en
            } else if (type === '') {
                type = 'contract interaction'
            }
            return {
                type,
                id: transaction.id,
                timeAt: new Date(transaction.time_at * 1000),
                toAddress: transaction.other_addr,
                failed: transaction.tx?.status === 0,
                pairs: [
                    ...transaction.sends
                        .filter(({ token_id }) => token_dict[token_id].is_verified)
                        .map(({ amount, token_id }) => ({
                            name: token_dict[token_id].name,
                            symbol: token_dict[token_id].optimized_symbol,
                            address: token_id,
                            direction: DebankTransactionDirection.SEND,
                            amount,
                        })),
                    ...transaction.receives
                        .filter(({ token_id }) => token_dict[token_id].is_verified)
                        .map(({ amount, token_id }) => ({
                            name: token_dict[token_id].name,
                            symbol: token_dict[token_id].optimized_symbol,
                            address: token_id,
                            direction: DebankTransactionDirection.RECEIVE,
                            amount,
                        })),
                ],
                gasFee: transaction.tx
                    ? { eth: transaction.tx.eth_gas_fee, usd: transaction.tx.usd_gas_fee }
                    : undefined,
            }
        })
}

function fromZerion(data: TransactionItem[]) {
    return data
        .filter(({ type }) => type !== ZerionRBDTransactionType.AUTHORIZE)
        .map((transaction) => {
            const ethGasFee = new BigNumber(transaction.fee?.value ?? 0).dividedBy(new BigNumber(10).pow(18)).toString()
            const usdGasFee = new BigNumber(ethGasFee).multipliedBy(transaction.fee?.price ?? 0).toString()

            return {
                type: transaction.type,
                id: transaction.hash,
                timeAt: new Date(transaction.mined_at * 1000),
                toAddress: transaction.address_to ?? '',
                failed: transaction.status === ZerionTransactionStatus.FAILED,
                pairs:
                    transaction.changes?.map(({ asset, direction, value }) => {
                        return {
                            name: asset.name,
                            symbol: asset.symbol,
                            address: asset.asset_code,
                            direction,
                            amount: Number(
                                new BigNumber(value).dividedBy(new BigNumber(10).pow(asset.decimals)).toString(),
                            ),
                        }
                    }) ?? [],
                gasFee: {
                    eth: Number(ethGasFee),
                    usd: Number(usdGasFee),
                },
            }
        })
}

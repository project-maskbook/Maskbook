import { useCallback } from 'react'
import type { NonPayableTx } from '@dimensiondev/contracts/types/types'
import {
    TransactionEventType,
    TransactionStateType,
    useTransactionState,
    useAccount,
    useChainId,
    useGasPrice,
    useNonce,
    useWeb3,
} from '@dimensiondev/web3-shared'
import { useMaskITO_Contract } from '../contracts/useMaskITO_Contract'

export function useMaskClaimCallback() {
    const web3 = useWeb3()
    const nonce = useNonce()
    const gasPrice = useGasPrice()
    const account = useAccount()
    const chainId = useChainId()
    const MaskITO_Contract = useMaskITO_Contract()
    const [claimState, setClaimState] = useTransactionState()

    const claimCallback = useCallback(async () => {
        if (!MaskITO_Contract) {
            setClaimState({
                type: TransactionStateType.UNKNOWN,
            })
            return
        }

        // start waiting for provider to confirm tx
        setClaimState({
            type: TransactionStateType.WAIT_FOR_CONFIRMING,
        })

        // estimate gas and compose transaction
        const config = {
            from: account,
            gas: await MaskITO_Contract.methods
                .claim()
                .estimateGas()
                .catch((error) => {
                    setClaimState({
                        type: TransactionStateType.FAILED,
                        error,
                    })
                    throw error
                }),
            gasPrice,
            nonce,
        }

        // send transaction and wait for hash
        return new Promise<void>(async (resolve, reject) => {
            const promiEvent = MaskITO_Contract.methods.claim().send(config as NonPayableTx)
            promiEvent
                .on(TransactionEventType.RECEIPT, (receipt) => {
                    setClaimState({
                        type: TransactionStateType.CONFIRMED,
                        no: 0,
                        receipt,
                    })
                })
                .on(TransactionEventType.CONFIRMATION, (no, receipt) => {
                    setClaimState({
                        type: TransactionStateType.CONFIRMED,
                        no,
                        receipt,
                    })
                    resolve()
                })
                .on(TransactionEventType.ERROR, (error) => {
                    setClaimState({
                        type: TransactionStateType.FAILED,
                        error,
                    })
                    reject(error)
                })
        })
    }, [account, chainId, MaskITO_Contract])

    const resetCallback = useCallback(() => {
        setClaimState({
            type: TransactionStateType.UNKNOWN,
        })
    }, [])

    return [claimState, claimCallback, resetCallback] as const
}

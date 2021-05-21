import type { CurrencyType, ERC20TokenDetailed, EtherTokenDetailed } from '../../../web3/types'

export enum FilterTransactionType {
    ALL = 'all',
    SENT = 'sent',
    RECEIVE = 'receive',
}

export type { TransactionDirection, TransactionPair, TransactionGasFee, Transaction } from '@dimensiondev/web3-shared'
export { PortfolioProvider } from '@dimensiondev/web3-shared'

export enum CollectibleProvider {
    OPENSEAN,
}

export interface Asset {
    token: EtherTokenDetailed | ERC20TokenDetailed
    /**
     * The chain name of assets
     */
    chain: 'eth' | string
    /**
     * The total balance of token
     */
    balance: string
    /**
     * The estimated price
     */
    price?: {
        [key in CurrencyType]: string
    }
    /**
     * The estimated value
     */
    value?: {
        [key in CurrencyType]: string
    }
    logoURL?: string
}

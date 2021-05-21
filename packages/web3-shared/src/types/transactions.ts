export interface Transaction {
    type: string | undefined
    id: string
    timeAt: Date
    toAddress: string
    failed: boolean
    pairs: TransactionPair[]
    gasFee: TransactionGasFee | undefined
    transactionType: string
}
export type TransactionDirection = ZerionTransactionDirection | DebankTransactionDirection

export interface TransactionPair {
    name: string
    symbol: string
    address: string
    direction: TransactionDirection
    amount: number
}

export type TransactionGasFee = {
    eth: number
    usd: number
}

export enum ZerionTransactionDirection {
    IN = 'in',
    OUT = 'out',
    SELF = 'self',
}
export enum DebankTransactionDirection {
    SEND = 'send',
    RECEIVE = 'receive',
}

export enum PortfolioProvider {
    ZERION,
    DEBANK,
}

export type SocketNameSpace = {
    namespace: string
    socket: SocketIOClient.Socket
}

export type SocketRequestBody = {
    scope: [string]
    payload: {
        [key: string]: any
    }
}

export interface SocketResponseBody {
    meta: {
        status: string
    }
    payload: {
        [key: string]: any
    }
}

export enum ZerionRBDTransactionType {
    SEND = 'send',
    RECEIVE = 'receive',
    TRADE = 'trade',
    AUTHORIZE = 'authorize',
    EXECUTION = 'execution',
    DEPLOYMENT = 'deployment',
    CANCEL = 'cancel',
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
    BORROW = 'borrow',
    REPAY = 'repay',
    STAKE = 'stake',
    UNSTAKE = 'unstake',
    CLAIM = 'claim',
}

export enum ZerionTransactionStatus {
    CONFIRMED = 'confirmed',
    FAILED = 'failed',
    PENDING = 'pending',
}

export enum ZerionTransactionDirection {
    IN = 'in',
    OUT = 'out',
    SELF = 'self',
}

export interface ZerionPrice {
    value: number
    changed_at: number
    relative_change_24h?: number
}

export interface ZerionAsset {
    asset_code: string
    name: string
    symbol: string
    decimals: number
    type: string
    is_displayable: boolean
    is_verified: boolean
    icon_url?: string
    price?: ZerionPrice
}

export interface ZerionTransactionChange {
    asset: ZerionAsset
    value: number
    direction: ZerionTransactionDirection
    address_from: string
    address_to: string
    price?: number
}

export interface ZerionTransactionFee {
    value: number
    price: number
}

export interface TransactionItem {
    id: string
    type: ZerionRBDTransactionType
    protocol: string
    mined_at: number
    block_number: number
    status: ZerionTransactionStatus
    hash: string
    direction?: ZerionTransactionDirection
    address_from?: string
    address_to?: string
    contract?: string
    nonce?: number
    changes?: ZerionTransactionChange[]
    fee?: ZerionTransactionFee
    meta?: string
}

export interface TransactionResponseBody extends SocketResponseBody {
    meta: {
        status: string
        address: string
        addresses: string[]
        currency: string
        transactions_limit: number
        transactions_offset: number
        transactions_search_query: string
    }
    payload: {
        transactions: TransactionItem[]
    }
}

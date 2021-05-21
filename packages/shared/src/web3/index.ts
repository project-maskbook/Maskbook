import type { ChainId, EthereumTokenType } from '@dimensiondev/web3-shared'
export { ChainId, EthereumTokenType } from '@dimensiondev/web3-shared'

export enum ProviderType {
    Maskbook = 'Maskbook',
    MetaMask = 'MetaMask',
    WalletConnect = 'WalletConnect',
}

export function isSameAddress(addrA: string, addrB: string) {
    return addrA.toLowerCase() === addrB.toLowerCase()
}

//#region Ether
export interface EtherToken {
    type: EthereumTokenType.Ether
    address: string
    chainId: ChainId
}

export interface EtherTokenDetailed extends EtherToken {
    name: 'Ether'
    symbol: 'ETH'
    decimals: 18
}
//#endregion

//#region ERC20
export interface ERC20Token {
    type: EthereumTokenType.ERC20
    address: string
    chainId: ChainId
}

export interface ERC20TokenDetailed extends ERC20Token {
    name?: string
    symbol?: string
    decimals: number
}
//#endregion

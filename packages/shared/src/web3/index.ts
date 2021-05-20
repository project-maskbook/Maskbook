// Learn more about ethereum ChainId https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md
export enum ChainId {
    Mainnet = 1,
    Ropsten = 3,
    Rinkeby = 4,
    Gorli = 5,
    Kovan = 42,
}

export enum ProviderType {
    Maskbook = 'Maskbook',
    MetaMask = 'MetaMask',
    WalletConnect = 'WalletConnect',
}

export function isSameAddress(addrA: string, addrB: string) {
    return addrA.toLowerCase() === addrB.toLowerCase()
}

export enum EthereumTokenType {
    Ether = 0,
    ERC20 = 1,
    ERC721 = 2,
    ERC1155 = 3,
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

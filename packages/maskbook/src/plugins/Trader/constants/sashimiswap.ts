import { ChainId, ERC20TokenDetailed } from '@dimensiondev/web3-shared'
import { DAI, USDC, USDT, WETH, WETH_ONLY, COMP, MKR } from './trader'

/**
 * Some tokens can only be swapped via certain pairs,
 * so we override the list of bases that are considered for these tokens.
 */
export const SASHIMISWAP_CUSTOM_BASES: {
    readonly [chainId in ChainId]?: {
        [tokenAddress: string]: ERC20TokenDetailed[]
    }
} = {}

export const SASHIMISWAP_BASE_AGAINST_TOKENS: {
    readonly [chainId in ChainId]: ERC20TokenDetailed[]
} = {
    ...WETH_ONLY,
    [ChainId.Mainnet]: [WETH, DAI, USDC, USDT, COMP, MKR].map((x) => x[ChainId.Mainnet]),
}

export const THEGRAPH_SASHIMISWAP = 'https://api.thegraph.com/subgraphs/name/sashimiproject/sashimi'

export const SASHIMISWAP_INIT_CODE_HASH = '0xb465bbe4edb8c9b0da8ff0b2b36ce0065de9fcd5a33f32c6856ea821779c8b72'

import { useWeb3Context } from '../context'
import { useAsync } from 'react-use'
import { useChainId } from './useChainId'
import { useEthereumConstants } from '../constants'

export function useERC20TokenList() {
    const { ERC20_TOKEN_LISTS } = useEthereumConstants()
    const { fetchERC20TokensFromTokenLists } = useWeb3Context()
    const chainId = useChainId()
    return useAsync(async () => fetchERC20TokensFromTokenLists(ERC20_TOKEN_LISTS, chainId), [chainId])
}

import { createContainer } from 'unstated-next'
import { useChainState } from '../hooks'

/** @internal */
export const Web3Context = createContainer(useChainState)
export const useWeb3Context = Web3Context.useContainer

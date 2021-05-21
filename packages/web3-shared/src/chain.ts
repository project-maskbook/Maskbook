import { useWeb3Context } from './context'
import { useSubscription } from 'use-subscription'

export function useChain() {
    return useSubscription(useWeb3Context().currentChain)
}

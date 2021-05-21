import { useWeb3Context } from './context'
import { useSubscription } from 'use-subscription'
import { useMemo } from 'react'
export function useChain() {
    const { currentChain: getCurrentValue, onChainUpdate: subscribe } = useWeb3Context()
    const sub = useMemo(() => ({ subscribe, getCurrentValue }), [subscribe, getCurrentValue])
    return useSubscription(sub)
}

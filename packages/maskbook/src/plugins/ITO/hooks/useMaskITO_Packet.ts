import { useAsyncRetry } from 'react-use'
import { useAccount } from '../../../web3/hooks/useAccount'
import { useMaskITO_Contract } from '../contracts/useMaskITO_Contract'

export function useMaskITO_Packet() {
    const account = useAccount()
    const MaskITO_Contract = useMaskITO_Contract()

    return useAsyncRetry(async () => {
        if (!MaskITO_Contract) return
        const [unlockTime, claimable = '0'] = await Promise.all([
            MaskITO_Contract.getUnlockTime(),
            MaskITO_Contract.check_claimable(),
        ])
        return {
            unlockTime,
            claimable,
        }
    }, [account, MaskITO_Contract])
}

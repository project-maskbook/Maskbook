import type { Multicall } from '@dimensiondev/contracts/types/Multicall'
import MulticallABI from '@dimensiondev/contracts/abis/Multicall.json'
import { useContract } from '../hooks/useContract'
import { CONSTANTS } from '../constants'
import { useConstant } from '../hooks/useConstant'

export function useMulticallContract() {
    const address = useConstant(CONSTANTS, 'MULTICALL_ADDRESS')
    return useContract<Multicall>(address, MulticallABI)
}

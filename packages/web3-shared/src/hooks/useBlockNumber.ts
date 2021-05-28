import { useState, useEffect } from 'react'
import { useWeb3Context } from '../context'

/**
 * Get the current block number
 */
export function useBlockNumber() {
    return useWeb3Context().blockNumber
}

/**
 * Get the current block number only once
 * @returns
 */
export function useBlockNumberOnce() {
    const blockNumber = useBlockNumber()
    const [blockNumberOnce, setBlockNumberOnce] = useState(0)
    useEffect(() => {
        if (blockNumberOnce === 0 && blockNumber > 0) setBlockNumberOnce(blockNumber)
    }, [blockNumber])
    return blockNumberOnce
}

import { useAsyncRetry } from 'react-use'
import { PortfolioProvider, Transaction } from '../types'
import type { AsyncStateRetry } from 'react-use/lib/useAsyncRetry'
import { unreachable } from '../utils/unreachable'
import { useSubscription } from 'use-subscription'
import { useWeb3Context } from '../context'

export function useTransactions(
    address: string,
    page?: number,
): AsyncStateRetry<{ transactions: Transaction[]; hasNextPage: boolean }> {
    const { currentPortfolioDataProvider, getTransactionList } = useWeb3Context()
    const provider = useSubscription(currentPortfolioDataProvider)

    return useAsyncRetry(async () => {
        if (!address)
            return {
                transactions: [],
                hasNextPage: false,
            }

        switch (provider) {
            case PortfolioProvider.DEBANK:
                return getTransactionList(address.toLowerCase(), provider, page)

            case PortfolioProvider.ZERION:
                return getTransactionList(address.toLowerCase(), provider, page)

            default:
                unreachable(provider)
        }
    }, [address, provider, page])
}

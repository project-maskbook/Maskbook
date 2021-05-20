import { createContainer } from 'unstated-next'
import { useWallet } from './useWallet'
import { useERC20TokensFromDB } from '../api'

function useWalletContext() {
    const wallet = useWallet()
    const tokens = useERC20TokensFromDB()

    return {
        wallet,
        erc20Tokens: wallet
            ? tokens.filter(
                  (x) => wallet.erc20_token_whitelist.has(x.address) && !wallet.erc20_token_blacklist.has(x.address),
              )
            : [],
    }
}

export const WalletContext = createContainer(useWalletContext)

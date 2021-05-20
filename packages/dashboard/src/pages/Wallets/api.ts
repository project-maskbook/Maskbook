import { createGlobalState, EthereumTokenType } from '@dimensiondev/maskbook-shared'
import { PluginMessages, PluginServices } from '../../API'

export const [useWallets, revalidateWallets, wallets] = createGlobalState(
    PluginServices.Wallet.getWallets,
    PluginMessages.Wallet.events.walletsUpdated.on,
)

export const [useERC20TokensFromDB, revalidateERCTokensFromDB, erc20Tokens] = createGlobalState(async () => {
    const records = await PluginServices.Wallet.getERC20Tokens()
    return records.map((x) => ({
        type: EthereumTokenType.ERC20,
        ...x,
    }))
}, PluginMessages.Wallet.events.erc20TokensUpdated.on)

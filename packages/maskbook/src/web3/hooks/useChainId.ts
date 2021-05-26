import { useValueRefDelayed } from '../../utils/hooks/useValueRef'
import { ChainId, ProviderType } from '../types'
import { useWallet } from '../../plugins/Wallet/hooks/useWallet'
import { Flags } from '../../utils/flags'
import {
    currentMaskbookChainIdSettings,
    currentMetaMaskChainIdSettings,
    currentSelectedWalletProviderSettings,
    currentWalletConnectChainIdSettings,
} from '../../plugins/Wallet/settings'
import { resolveChainDetailed } from '../pipes'
import { unreachable } from '../../utils'

/**
 * Get the chain id which is using by the given (or default) wallet
 */
export function useUnsafeChainId() {
    const provider = useValueRefDelayed(currentSelectedWalletProviderSettings)
    const MaskbookChainId = useValueRefDelayed(currentMaskbookChainIdSettings)
    const MetaMaskChainId = useValueRefDelayed(currentMetaMaskChainIdSettings)
    const WalletConnectChainId = useValueRefDelayed(currentWalletConnectChainIdSettings)

    const wallet = useWallet()
    if (!wallet) return MaskbookChainId
    if (provider === ProviderType.Maskbook) return MaskbookChainId
    if (provider === ProviderType.MetaMask) return MetaMaskChainId
    if (provider === ProviderType.WalletConnect) return WalletConnectChainId
    if (provider === ProviderType.CustomNetwork) return MaskbookChainId
    unreachable(provider)
}

/**
 * Get the chain id which is using by the given (or default) wallet
 * It will always yield Mainnet in production mode
 */
export function useChainId() {
    const unsafeChainId = useUnsafeChainId()

    if (!Flags.wallet_network_strict_mode_enabled) return unsafeChainId
    const chainDetailed = resolveChainDetailed(unsafeChainId)
    if (chainDetailed.chain === 'ETH') return ChainId.Mainnet
    if (chainDetailed.chain === 'BSC') return ChainId.BSC
    if (chainDetailed.chain === 'Matic') return ChainId.Matic
    return ChainId.Mainnet
}

/**
 * Retruns true if chain id is available
 */
export function useChainIdValid() {
    const wallet = useWallet()
    const unsafeChainId = useUnsafeChainId()

    if (!wallet || !Flags.wallet_network_strict_mode_enabled) return true
    return resolveChainDetailed(unsafeChainId).network === 'mainnet'
}

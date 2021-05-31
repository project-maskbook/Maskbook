import { formatEthereumAddress, FormattedBalance } from '@dimensiondev/maskbook-shared'
import { ChainId, resolveChainColor, useAccount, useChainId, useNativeTokenBalance } from '@dimensiondev/web3-shared'
import { Button, ButtonProps, makeStyles, Typography } from '@material-ui/core'
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import classNames from 'classnames'
import { useCallback } from 'react'
import { useStylesExtends } from '../../components/custom-ui-helper'
import { ProviderIcon } from '../../components/shared/ProviderIcon'
import { useWallet } from '../../plugins/Wallet/hooks/useWallet'
import { WalletMessages } from '../../plugins/Wallet/messages'
import { currentSelectedWalletProviderSettings } from '../../plugins/Wallet/settings'
import { Flags, useI18N, useRemoteControlledDialog, useValueRef } from '../../utils'

const useStyles = makeStyles((theme) => {
    return {
        root: {
            display: 'inline-flex',
            alignItems: 'center',
            borderRadius: 16,
            paddingLeft: theme.spacing(2),
            backgroundColor: theme.palette.background.default,
        },
        balance: {
            marginRight: theme.spacing(1),
        },
        button: {
            borderRadius: 16,
            backgroundColor: theme.palette.background.paper,
        },
        buttonTransparent: {
            backgroundColor: 'transparent',
        },
        providerIcon: {
            fontSize: 18,
            width: 18,
            height: 18,
        },
        chainIcon: {
            fontSize: 18,
            width: 18,
            height: 18,
            marginLeft: theme.spacing(0.5),
        },
    }
})

export interface EthereumAccountButtonProps extends withClasses<never> {
    disableNativeToken?: boolean
    ButtonProps?: Partial<ButtonProps>
}

export function EthereumAccountButton(props: EthereumAccountButtonProps) {
    const { t } = useI18N()
    const classes = useStylesExtends(useStyles(), props)

    const chainId = useChainId()
    const account = useAccount()
    const { value: balance = '0' } = useNativeTokenBalance()

    const selectedWallet = useWallet()
    const selectedWalletProvider = useValueRef(currentSelectedWalletProviderSettings)

    const { openDialog: openSelectWalletDialog } = useRemoteControlledDialog(
        WalletMessages.events.walletStatusDialogUpdated,
    )
    const { openDialog: openSelectProviderDialog } = useRemoteControlledDialog(
        WalletMessages.events.selectProviderDialogUpdated,
    )
    const onOpen = useCallback(() => {
        if (selectedWallet) openSelectWalletDialog()
        else openSelectProviderDialog()
    }, [selectedWallet, openSelectWalletDialog, openSelectProviderDialog])

    if (Flags.has_native_nav_bar) return <AccountBalanceWalletIcon onClick={onOpen} />

    return (
        <div className={props.disableNativeToken ? '' : classes.root}>
            {!props.disableNativeToken ? (
                <Typography className={classes.balance}>
                    <FormattedBalance value={balance} decimals={18} significant={4} symbol="ETH" />
                </Typography>
            ) : null}
            <Button
                className={classNames(classes.button, props.disableNativeToken ? classes.buttonTransparent : '')}
                variant="outlined"
                startIcon={
                    selectedWallet ? (
                        <ProviderIcon
                            classes={{ icon: classes.providerIcon }}
                            size={18}
                            providerType={selectedWalletProvider}
                        />
                    ) : null
                }
                color="primary"
                onClick={onOpen}
                {...props.ButtonProps}>
                {selectedWallet?.name ?? ''}
                {selectedWallet?.address
                    ? ` (${formatEthereumAddress(selectedWallet.address, 4)})`
                    : t('plugin_wallet_on_connect')}
                {chainId !== ChainId.Mainnet && selectedWallet ? (
                    <FiberManualRecordIcon
                        className={classes.chainIcon}
                        style={{
                            color: resolveChainColor(chainId),
                        }}
                    />
                ) : null}
            </Button>
        </div>
    )
}

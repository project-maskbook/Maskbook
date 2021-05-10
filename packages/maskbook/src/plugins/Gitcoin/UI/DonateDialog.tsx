import { useState, useCallback, useMemo, useEffect } from 'react'
import { makeStyles, Typography, DialogContent, Link } from '@material-ui/core'
import BigNumber from 'bignumber.js'
import { Trans } from 'react-i18next'
import { v4 as uuid } from 'uuid'

import { useI18N } from '../../../utils/i18n-next-ui'
import { useStylesExtends } from '../../../components/custom-ui-helper'
import { ERC20TokenDetailed, EthereumTokenType, EtherTokenDetailed } from '../../../web3/types'
import ActionButton from '../../../extension/options-page/DashboardComponents/ActionButton'
import { useDonateCallback } from '../hooks/useDonateCallback'
import { TokenAmountPanel } from '../../../web3/UI/TokenAmountPanel'
import { formatBalance } from '../../Wallet/formatter'
import { TransactionStateType } from '../../../web3/hooks/useTransactionState'
import { InjectedDialog } from '../../../components/shared/InjectedDialog'
import { SelectTokenDialogEvent, WalletMessages } from '../../Wallet/messages'
import { useRemoteControlledDialog } from '../../../utils/hooks/useRemoteControlledDialog'
import { usePostLink } from '../../../components/DataSource/usePostInfo'
import { activatedSocialNetworkUI } from '../../../social-network'
import { PluginGitcoinMessages } from '../messages'
import { EthereumMessages } from '../../Ethereum/messages'
import { EthereumWalletConnectedBoundary } from '../../../web3/UI/EthereumWalletConnectedBoundary'
import { EthereumERC20TokenApprovedBoundary } from '../../../web3/UI/EthereumERC20TokenApprovedBoundary'
import { useConstant } from '../../../web3/hooks/useConstant'
import { GITCOIN_CONSTANT } from '../constants'
import { isTwitter } from '../../../social-network-adaptor/twitter.com/base'
import { ChainState } from '../../../web3/state/useChainState'
import { useTokenBalance } from '../../../web3/hooks/useTokenBalance'

const useStyles = makeStyles((theme) => ({
    paper: {
        width: '450px !important',
    },
    form: {
        '& > *': {
            margin: theme.spacing(1, 0),
        },
    },
    root: {
        margin: theme.spacing(2, 0),
    },
    tip: {
        fontSize: 12,
        color: theme.palette.text.secondary,
        padding: theme.spacing(2, 2, 0, 2),
    },
    button: {
        margin: theme.spacing(1.5, 0, 0),
        padding: 12,
    },
}))

export interface DonateDialogProps extends withClasses<never> {}

export function DonateDialog(props: DonateDialogProps) {
    const { t } = useI18N()
    const classes = useStylesExtends(useStyles(), props)

    const [title, setTitle] = useState('')
    const [address, setAddress] = useState('')

    // context
    const { account, chainId, chainTokenDetailed } = ChainState.useContainer()
    const BULK_CHECKOUT_ADDRESS = useConstant(GITCOIN_CONSTANT, 'BULK_CHECKOUT_ADDRESS')

    //#region remote controlled dialog
    const { open, closeDialog: closeDonationDialog } = useRemoteControlledDialog(
        PluginGitcoinMessages.events.donationDialogUpdated,
        (ev) => {
            if (!ev.open) return
            setTitle(ev.title)
            setAddress(ev.address)
        },
    )
    //#endregion

    //#region the selected token
    const [token = chainTokenDetailed.value, setToken] = useState<EtherTokenDetailed | ERC20TokenDetailed | undefined>(
        chainTokenDetailed.value,
    )
    const tokenBalance = useTokenBalance(token?.type ?? EthereumTokenType.Ether, token?.address ?? '')
    //#endregion

    //#region select token dialog
    const [id] = useState(uuid())
    const { setDialog: setSelectTokenDialog } = useRemoteControlledDialog(
        WalletMessages.events.selectTokenDialogUpdated,
        useCallback(
            (ev: SelectTokenDialogEvent) => {
                if (ev.open || !ev.token || ev.uuid !== id) return
                setToken(ev.token)
            },
            [id],
        ),
    )
    const onSelectTokenChipClick = useCallback(() => {
        setSelectTokenDialog({
            open: true,
            uuid: id,
            disableEther: false,
            FixedTokenListProps: {
                selectedTokens: token ? [token.address] : [],
            },
        })
    }, [id, token?.address])
    //#endregion

    //#region amount
    const [rawAmount, setRawAmount] = useState('')
    const amount = new BigNumber(rawAmount || '0').multipliedBy(new BigNumber(10).pow(token?.decimals ?? 0))
    //#endregion

    //#region blocking
    const [donateState, donateCallback, resetDonateCallback] = useDonateCallback(address ?? '', amount.toFixed(), token)
    //#endregion

    //#region transaction dialog
    const cashTag = isTwitter(activatedSocialNetworkUI) ? '$' : ''
    const postLink = usePostLink()
    const shareLink = activatedSocialNetworkUI.utils
        .getShareLinkURL?.(
            token
                ? [
                      `I just donated ${title} with ${formatBalance(amount, token.decimals)} ${cashTag}${
                          token.symbol
                      }. Follow @realMaskbook (mask.io) to donate Gitcoin grants.`,
                      '#mask_io',
                      postLink,
                  ].join('\n')
                : '',
        )
        .toString()

    // close the transaction dialog
    const { setDialog: setTransactionDialog } = useRemoteControlledDialog(
        EthereumMessages.events.transactionDialogUpdated,
        (ev) => {
            if (ev.open) return
            if (donateState.type === TransactionStateType.HASH) setRawAmount('')
            resetDonateCallback()
        },
    )

    // open the transaction dialog
    useEffect(() => {
        if (!token) return
        if (donateState.type === TransactionStateType.UNKNOWN) return
        setTransactionDialog({
            open: true,
            shareLink,
            state: donateState,
            summary: `Donating ${formatBalance(amount, token.decimals)} ${token.symbol} for ${title}.`,
        })
    }, [donateState /* update tx dialog only if state changed */])
    //#endregion

    //#region submit button
    const validationMessage = useMemo(() => {
        if (!token) return t('plugin_gitcoin_select_a_token')
        if (!account) return t('plugin_wallet_connect_a_wallet')
        if (!address) return t('plugin_gitcoin_grant_not_available')
        if (!amount || amount.isZero()) return t('plugin_gitcoin_enter_an_amount')
        if (amount.isGreaterThan(tokenBalance.value ?? '0'))
            return t('plugin_gitcoin_insufficient_balance', {
                symbol: token.symbol,
            })
        return ''
    }, [account, address, amount.toFixed(), chainId, token, tokenBalance.value ?? '0'])
    //#endregion

    if (!token || !address) return null

    return (
        <div className={classes.root}>
            <InjectedDialog open={open} onClose={closeDonationDialog} title={title} DialogProps={{ maxWidth: 'xs' }}>
                <DialogContent>
                    <form className={classes.form} noValidate autoComplete="off">
                        <TokenAmountPanel
                            label="Amount"
                            amount={rawAmount}
                            balance={tokenBalance.value ?? '0'}
                            token={token}
                            onAmountChange={setRawAmount}
                            SelectTokenChip={{
                                loading: tokenBalance.loading,
                                ChipProps: {
                                    onClick: onSelectTokenChipClick,
                                },
                            }}
                        />
                    </form>
                    <Typography className={classes.tip} variant="body1">
                        <Trans
                            i18nKey="plugin_gitcoin_readme"
                            components={{
                                fund: (
                                    <Link
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href={t('plugin_gitcoin_readme_fund_link')}
                                    />
                                ),
                            }}
                        />
                    </Typography>
                    <EthereumWalletConnectedBoundary>
                        <EthereumERC20TokenApprovedBoundary
                            amount={amount.toFixed()}
                            spender={BULK_CHECKOUT_ADDRESS}
                            token={token.type === EthereumTokenType.ERC20 ? token : undefined}>
                            <ActionButton
                                className={classes.button}
                                fullWidth
                                size="large"
                                disabled={!!validationMessage}
                                onClick={donateCallback}
                                variant="contained">
                                {validationMessage || t('plugin_gitcoin_donate')}
                            </ActionButton>
                        </EthereumERC20TokenApprovedBoundary>
                    </EthereumWalletConnectedBoundary>
                </DialogContent>
            </InjectedDialog>
        </div>
    )
}

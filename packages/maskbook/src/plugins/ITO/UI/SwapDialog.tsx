import { useState, useMemo, useCallback, useEffect } from 'react'
import { makeStyles, Typography, Slider, CircularProgress } from '@material-ui/core'
import BigNumber from 'bignumber.js'
import { v4 as uuid } from 'uuid'

import ActionButton from '../../../extension/options-page/DashboardComponents/ActionButton'
import { ERC20TokenDetailed, NativeTokenDetailed, EthereumTokenType } from '../../../web3/types'
import { useRemoteControlledDialog } from '../../../utils/hooks/useRemoteControlledDialog'
import { TransactionStateType } from '../../../web3/hooks/useTransactionState'
import { SelectTokenDialogEvent, WalletMessages, WalletRPC } from '../../Wallet/messages'
import { TokenAmountPanel } from '../../../web3/UI/TokenAmountPanel'
import { useTokenBalance } from '../../../web3/hooks/useTokenBalance'
import { useSwapCallback } from '../hooks/useSwapCallback'
import { useStylesExtends } from '../../../components/custom-ui-helper'
import { useI18N } from '../../../utils/i18n-next-ui'
import { formatBalance } from '@dimensiondev/maskbook-shared'
import { useConstant } from '../../../web3/hooks/useConstant'
import type { ChainId } from '../../../web3/types'
import { resolveTransactionLinkOnEtherscan } from '../../../web3/pipes'
import { useChainId } from '../../../web3/hooks/useChainId'
import type { JSON_PayloadInMask } from '../types'
import { ITO_CONSTANTS } from '../constants'
import { SwapStatus } from './SwapGuide'
import { isETH, isSameAddress } from '../../../web3/helpers'
import { EthereumMessages } from '../../Ethereum/messages'
import { EthereumERC20TokenApprovedBoundary } from '../../../web3/UI/EthereumERC20TokenApprovedBoundary'
import { EthereumWalletConnectedBoundary } from '../../../web3/UI/EthereumWalletConnectedBoundary'
import { useQualificationVerify } from '../hooks/useQualificationVerify'

const useStyles = makeStyles((theme) => ({
    button: {
        marginTop: theme.spacing(1.5),
    },
    providerBar: {},
    swapLimitWrap: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: theme.spacing(2),
    },
    swapLimitText: {
        color: theme.palette.mode === 'dark' ? '#fff' : '#15181B',
        fontSize: 14,
        width: 'fit-content',
    },
    swapLimitSlider: {
        flexGrow: 1,
        width: 'auto !important',
        margin: theme.spacing(0, 3),
        '& .MuiSlider-thumb': {
            width: 28,
            height: 28,
            marginTop: -12,
            background: theme.palette.mode === 'dark' ? '#fff' : '2CA4EF, 100%',
        },
        '& .MuiSlider-rail': {
            height: 5,
        },
        '& .MuiSlider-track': {
            height: 5,
        },
    },
    exchangeText: {
        textAlign: 'right',
        fontSize: 10,
        margin: theme.spacing(1, 0, 3),
    },
    exchangeAmountText: {
        color: theme.palette.mode === 'dark' ? '#fff' : '#15181B',
    },
    swapButtonWrapper: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: theme.spacing(2),
    },
    remindText: {
        fontSize: 10,
        marginTop: theme.spacing(1),
    },
    loading: {
        color: theme.palette.text.primary,
    },
}))

export interface SwapDialogProps extends withClasses<'root'> {
    exchangeTokens: (NativeTokenDetailed | ERC20TokenDetailed)[]
    payload: JSON_PayloadInMask
    initAmount: BigNumber
    tokenAmount: BigNumber
    maxSwapAmount: BigNumber
    setTokenAmount: React.Dispatch<React.SetStateAction<BigNumber>>
    setActualSwapAmount: React.Dispatch<React.SetStateAction<BigNumber.Value>>
    setStatus: (status: SwapStatus) => void
    chainId: ChainId
    account: string
    token: NativeTokenDetailed | ERC20TokenDetailed
}

export function SwapDialog(props: SwapDialogProps) {
    const { t } = useI18N()
    const {
        payload,
        initAmount,
        tokenAmount,
        maxSwapAmount,
        setTokenAmount,
        setActualSwapAmount,
        setStatus,
        account,
        token,
        exchangeTokens,
    } = props

    const chainId = useChainId()
    const classes = useStylesExtends(useStyles(), props)
    const ITO_CONTRACT_ADDRESS = useConstant(ITO_CONSTANTS, 'ITO_CONTRACT_ADDRESS')

    const [ratio, setRatio] = useState<BigNumber>(
        new BigNumber(payload.exchange_amounts[0 * 2]).dividedBy(payload.exchange_amounts[0 * 2 + 1]),
    )
    const [swapToken, setSwapToken] = useState<NativeTokenDetailed | ERC20TokenDetailed>(payload.exchange_tokens[0])
    const [swapAmount, setSwapAmount] = useState<BigNumber>(tokenAmount.multipliedBy(ratio))
    const [inputAmountForUI, setInputAmountForUI] = useState(
        swapAmount.isZero() ? '' : formatBalance(swapAmount, swapToken.decimals),
    )

    //#region select token
    const [id] = useState(uuid())
    const { setDialog: setSelectTokenDialog } = useRemoteControlledDialog(
        WalletMessages.events.selectTokenDialogUpdated,
        useCallback(
            (ev: SelectTokenDialogEvent) => {
                if (ev.open || !ev.token || ev.uuid !== id) return
                const at = exchangeTokens.findIndex((x) => isSameAddress(x.address, ev.token!.address))
                const ratio = new BigNumber(payload.exchange_amounts[at * 2]).dividedBy(
                    payload.exchange_amounts[at * 2 + 1],
                )
                setRatio(ratio)
                setSwapToken(ev.token)
                setTokenAmount(initAmount)
                setSwapAmount(initAmount.multipliedBy(ratio))
                setInputAmountForUI(
                    initAmount.isEqualTo(0) ? '' : formatBalance(initAmount.multipliedBy(ratio), ev.token.decimals),
                )
            },
            [
                id,
                payload,
                initAmount,
                exchangeTokens
                    .map((x) => x.address)
                    .sort()
                    .join(),
            ],
        ),
    )
    const onSelectTokenChipClick = useCallback(() => {
        setSelectTokenDialog({
            open: true,
            uuid: id,
            disableEther: !exchangeTokens.some((x) => isETH(x.address)),
            disableSearchBar: true,
            FixedTokenListProps: {
                tokens: exchangeTokens.filter((x) => !isETH(x.address)) as ERC20TokenDetailed[],
                whitelist: exchangeTokens.map((x) => x.address),
            },
        })
    }, [
        exchangeTokens
            .map((x) => x.address)
            .sort()
            .join(),
    ])
    //#endregion

    //#region balance
    const { value: tokenBalance = '0' } = useTokenBalance(swapToken.type, swapToken.address)
    //#endregion

    //#region maxAmount for TokenAmountPanel
    const maxAmount = useMemo(
        () => BigNumber.min(maxSwapAmount.multipliedBy(ratio).dp(0), tokenBalance).toFixed(),
        [maxSwapAmount, ratio, tokenBalance],
    )
    //#endregion

    //#region swap
    const { value: qualificationInfo, loading: loadingQualification } = useQualificationVerify(
        payload.qualification_address,
    )

    const [swapState, swapCallback, resetSwapCallback] = useSwapCallback(
        payload,
        swapAmount.toFixed(),
        swapToken,
        qualificationInfo?.isQualificationHasLucky,
    )
    const onSwap = useCallback(async () => {
        await swapCallback()
        if (payload.token.type !== EthereumTokenType.ERC20) return
        await WalletRPC.addERC20Token(payload.token)
        await WalletRPC.trustERC20Token(account, payload.token)
    }, [swapCallback, payload.token.address])

    const { setDialog: setTransactionDialog } = useRemoteControlledDialog(
        EthereumMessages.events.transactionDialogUpdated,
        (ev) => {
            if (ev.open) return
            if (swapState.type === TransactionStateType.CONFIRMED && !swapState.receipt.status) resetSwapCallback()
            if (swapState.type !== TransactionStateType.CONFIRMED && swapState.type !== TransactionStateType.RECEIPT)
                return
            const { receipt } = swapState
            const { to_value } = (receipt.events?.SwapSuccess.returnValues ?? {}) as { to_value: string }
            setActualSwapAmount(to_value)
            setStatus(SwapStatus.Share)
            resetSwapCallback()
        },
    )

    useEffect(() => {
        if (swapState.type === TransactionStateType.UNKNOWN) return

        if (swapState.type === TransactionStateType.HASH) {
            const { hash } = swapState
            setTimeout(() => {
                window.open(resolveTransactionLinkOnEtherscan(chainId, hash), '_blank', 'noopener noreferrer')
            }, 2000)
            return
        }

        setTransactionDialog({
            open: true,
            state: swapState,
            summary: t('plugin_ito_swapping', {
                amount: formatBalance(tokenAmount, token.decimals),
                symbol: token.symbol,
            }),
        })
    }, [swapState])
    //#endregion

    const validationMessage = useMemo(() => {
        if (swapAmount.isEqualTo(0)) return t('plugin_ito_error_enter_amount')
        if (swapAmount.isGreaterThan(tokenBalance)) return t('plugin_ito_error_balance', { symbol: swapToken.symbol })
        if (tokenAmount.isGreaterThan(maxSwapAmount)) return t('plugin_ito_dialog_swap_exceed_wallet_limit')
        return ''
    }, [swapAmount, tokenBalance, maxSwapAmount, swapToken, ratio])

    return (
        <>
            <section className={classes.swapLimitWrap}>
                <Typography variant="body1" className={classes.swapLimitText}>
                    0 {token.symbol}
                </Typography>
                <Slider
                    className={classes.swapLimitSlider}
                    value={Number(tokenAmount.dividedBy(maxSwapAmount).multipliedBy(100))}
                    onChange={(_, newValue) => {
                        const tokenAmount = maxSwapAmount.multipliedBy((newValue as number) / 100)
                        const swapAmount = tokenAmount.multipliedBy(ratio).dp(0)
                        setTokenAmount(tokenAmount.dp(0))
                        setSwapAmount(swapAmount)
                        setInputAmountForUI(formatBalance(swapAmount, swapToken.decimals))
                    }}
                />
                <Typography variant="body1" className={classes.swapLimitText}>
                    {formatBalance(maxSwapAmount, token.decimals)} {token.symbol}
                </Typography>
            </section>
            <Typography className={classes.exchangeText} variant="body1" color="textSecondary">
                {t('plugin_ito_dialog_swap_exchange')}{' '}
                <span className={classes.exchangeAmountText}>{formatBalance(tokenAmount, token.decimals)}</span>{' '}
                {token.symbol}
                {'.'}
            </Typography>
            <TokenAmountPanel
                amount={inputAmountForUI}
                maxAmount={maxAmount}
                balance={tokenBalance}
                token={swapToken}
                onAmountChange={(value) => {
                    const val =
                        value === '' || value === '0'
                            ? new BigNumber(0)
                            : new BigNumber(value).multipliedBy(new BigNumber(10).pow(swapToken.decimals))
                    const isMax = value === formatBalance(maxAmount, swapToken.decimals) && !val.isEqualTo(0)
                    const tokenAmount = isMax ? maxSwapAmount : val.dividedBy(ratio)
                    const swapAmount = isMax ? tokenAmount.multipliedBy(ratio) : val.dp(0)
                    setInputAmountForUI(
                        isMax
                            ? tokenAmount
                                  .multipliedBy(ratio)
                                  .dividedBy(new BigNumber(10).pow(swapToken.decimals))
                                  .toString()
                            : value,
                    )
                    setTokenAmount(tokenAmount.dp(0))
                    setSwapAmount(swapAmount)
                }}
                label={t('plugin_ito_dialog_swap_panel_title')}
                SelectTokenChip={{
                    ChipProps: {
                        onClick: onSelectTokenChipClick,
                    },
                }}
            />
            <Typography className={classes.remindText} variant="body1" color="textSecondary">
                {t('plugin_ito_swap_only_once_remind')}
            </Typography>
            <section className={classes.swapButtonWrapper}>
                <EthereumWalletConnectedBoundary>
                    <EthereumERC20TokenApprovedBoundary
                        amount={swapAmount.toFixed()}
                        spender={ITO_CONTRACT_ADDRESS}
                        token={swapToken.type === EthereumTokenType.ERC20 ? swapToken : undefined}>
                        <ActionButton
                            className={classes.button}
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={!!validationMessage || loadingQualification}
                            onClick={onSwap}>
                            {loadingQualification ? (
                                <CircularProgress size={16} className={classes.loading} />
                            ) : (
                                validationMessage || t('plugin_ito_swap')
                            )}
                        </ActionButton>
                    </EthereumERC20TokenApprovedBoundary>
                </EthereumWalletConnectedBoundary>
            </section>
        </>
    )
}

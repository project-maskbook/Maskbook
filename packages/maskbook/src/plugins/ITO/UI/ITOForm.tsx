import { createStyles, makeStyles, MenuProps, Box, TextField, Grid } from '@material-ui/core'
import { useState, useCallback, useMemo } from 'react'
import { useStylesExtends } from '../../../components/custom-ui-helper'
import { EthereumStatusBar } from '../../../web3/UI/EthereumStatusBar'
import { useI18N } from '../../../utils/i18n-next-ui'
import { useTokenBalance } from '../../../web3/hooks/useTokenBalance'
import { EthereumTokenType, ERC20TokenDetailed, EtherTokenDetailed } from '../../../web3/types'
import { useEtherTokenDetailed } from '../../../web3/hooks/useEtherTokenDetailed'
import { useAccount } from '../../../web3/hooks/useAccount'
import { useChainId, useChainIdValid } from '../../../web3/hooks/useChainState'

import { useConstant } from '../../../web3/hooks/useConstant'
import { ITO_CONSTANTS } from '../constants'
import { ApproveState, useERC20TokenApproveCallback } from '../../../web3/hooks/useERC20TokenApproveCallback'

import { ITOExchangeTokenPanel, ExchangeTokenPanel } from './ITOExchangeTokenPanel'
import { useCurrentIdentity } from '../../../components/DataSource/useActivatedUI'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import BigNumber from 'bignumber.js'
import ActionButton from '../../../extension/options-page/DashboardComponents/ActionButton'
import { v4 as uuid } from 'uuid'

const useStyles = makeStyles((theme) =>
    createStyles({
        line: {
            margin: theme.spacing(1),
        },
        flow: {
            margin: theme.spacing(1),
            textAlign: 'center',
        },
        bar: {
            padding: theme.spacing(0, 2, 2),
        },
        input: {
            padding: theme.spacing(1),
            flex: 1,
        },
        tip: {
            fontSize: 12,
            color: theme.palette.text.secondary,
        },
        button: {
            margin: theme.spacing(2, 0),
            padding: 12,
        },
    }),
)

export interface ITOFormProps extends withClasses<KeysInferFromUseStyles<typeof useStyles>> {
    onCreate?(payload: any): void
    SelectMenuProps?: Partial<MenuProps>
}

export function ITOForm(props: ITOFormProps) {
    const { t } = useI18N()
    const classes = useStylesExtends(useStyles(), props)

    const account = useAccount()
    const chainId = useChainId()
    const chainIdValid = useChainIdValid()

    const { value: tokenDetailed } = useEtherTokenDetailed()
    const [token, setToken] = useState<EtherTokenDetailed | ERC20TokenDetailed | undefined>(tokenDetailed)

    const [message, setMessage] = useState('Best Wishes!')

    // balance
    const { value: tokenBalance = '0', loading: loadingTokenBalance } = useTokenBalance(
        token?.type ?? EthereumTokenType.Ether,
        token?.address ?? '',
    )
    const [amount, setAmount] = useState('')

    const senderName = useCurrentIdentity()?.linkedPersona?.nickname ?? 'Unknown User'

    const ITOContractAddress = useConstant(ITO_CONSTANTS, 'ITO_ADDRESS')
    const [approveState, approveCallback] = useERC20TokenApproveCallback(
        token?.type === EthereumTokenType.ERC20 ? token.address : '',
        amount,
        ITOContractAddress,
    )

    const onAmountChange = useCallback((amount: string, key: string) => {
        setAmount(amount)
    }, [])

    const onTokenChange = useCallback((token: EtherTokenDetailed | ERC20TokenDetailed, key: string) => {
        setToken(token)
    }, [])

    const onApprove = useCallback(async () => {
        if (approveState !== ApproveState.NOT_APPROVED) {
            return
        }
        await approveCallback()
    }, [approveState, approveCallback])

    const approveRequired = approveState === ApproveState.NOT_APPROVED || approveState === ApproveState.PENDING

    const validationMessage = useMemo(() => {
        if (new BigNumber(amount).isZero()) {
            return 'Enter an amount'
        }
        if (!token) {
            return 'Select to token'
        }
        return ''
    }, [token, amount])

    return (
        <>
            <EthereumStatusBar classes={{ root: classes.bar }} />
            <Box className={classes.line}>
                <ExchangeTokenPanel
                    onAmountChange={onAmountChange}
                    showAdd={false}
                    showRemove={false}
                    dataIndex={uuid()}
                    label="Total amount"
                    inputAmount={amount}
                    exchangeToken={token}
                    onExchangeTokenChange={onTokenChange}
                />
            </Box>
            <Box className={classes.flow}>
                <ArrowDownwardIcon size="large" />
            </Box>
            <Box className={classes.line}>
                <ITOExchangeTokenPanel
                    originToken={token}
                    exchangetokenPanelProps={{
                        label: 'Swap Ration',
                    }}
                />
            </Box>
            <Box className={classes.line}>
                <TextField className={classes.input} fullWidth label="Title" defalutValue="MASK" />
            </Box>
            <Box className={classes.line} style={{ display: 'flex' }}>
                <TextField className={classes.input} label="Allocation per wallet" />

                <TextField className={classes.input} label="Event Times" />
            </Box>
            <Box className={classes.line}>
                <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}>
                    {approveRequired ? (
                        <Grid item xs={6}>
                            <ActionButton
                                className={classes.button}
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={approveState === ApproveState.PENDING}
                                onClick={onApprove}>
                                {approveState === ApproveState.NOT_APPROVED ? `Approve ${token?.symbol}` : ''}
                                {approveState === ApproveState.PENDING ? `Approve... ${token?.symbol}` : ''}
                            </ActionButton>
                        </Grid>
                    ) : null}

                    <Grid item xs={approveRequired ? 6 : 12}>
                        {!account || !chainIdValid ? (
                            <ActionButton className={classes.button} fullWidth variant="contained" size="large">
                                Connect a wallet
                            </ActionButton>
                        ) : validationMessage ? (
                            <ActionButton className={classes.button} fullWidth variant="contained" disabled>
                                {validationMessage}
                            </ActionButton>
                        ) : (
                            <ActionButton className={classes.button} fullWidth>
                                Send
                            </ActionButton>
                        )}
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

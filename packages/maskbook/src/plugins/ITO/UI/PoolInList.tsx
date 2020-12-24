import {
    TableContainer,
    Table,
    Paper,
    Card,
    Box,
    createStyles,
    makeStyles,
    Typography,
    LinearProgress,
    TableRow,
    TableHead,
    TableCell,
    TableBody,
} from '@material-ui/core'
import BigNumber from 'bignumber.js'
import ActionButton from '../../../extension/options-page/DashboardComponents/ActionButton'
import { languageSettings } from '../../../settings/settings'
import { useI18N } from '../../../utils/i18n-next-ui'
import { formatBalance } from '../../Wallet/formatter'
import type { JSON_PayloadInMask } from '../types'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            borderRadius: 10,
            display: 'flex',
            padding: theme.spacing(1),
            margin: theme.spacing(2),
        },
        icon: {
            display: 'flex',
            justifyContent: 'center',
            padding: theme.spacing(1),
        },
        content: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
        },
        header: {
            display: 'flex',
            paddingBottom: theme.spacing(1),
        },
        button: {
            borderRadius: 50,
        },
        title: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            paddingBottom: theme.spacing(1),
        },
        progress: {
            paddingBottom: theme.spacing(1),
        },
        price: {
            display: 'flex',
            justifyContent: 'space-between',
            paddingBottom: theme.spacing(1),
        },
        deteils: {
            deisplay: 'flex',
            flexDirection: 'column',
            paddingBottom: theme.spacing(1),
        },
        table: {
            paddingBottom: theme.spacing(1),
            borderRadius: 0,
        },
        cell: {
            border: '1px solid rgba(224, 224, 224, 1)',
        },
    }),
)

const USDCIcon = ({ size = 32 }: { size?: number }) => (
    <>
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0)">
                <path
                    d="M0 12C0 15.1826 1.26428 18.2348 3.51472 20.4853C5.76516 22.7357 8.8174 24 12 24C15.1826 24 18.2348 22.7357 20.4853 20.4853C22.7357 18.2348 24 15.1826 24 12C24 8.8174 22.7357 5.76516 20.4853 3.51472C18.2348 1.26428 15.1826 0 12 0C8.8174 0 5.76516 1.26428 3.51472 3.51472C1.26428 5.76516 0 8.8174 0 12H0Z"
                    fill="#2775C9"
                />
                <path
                    d="M11.28 7.545V6.795C11.28 6.60405 11.3559 6.42091 11.4909 6.28588C11.6259 6.15086 11.809 6.075 12 6.075C12.191 6.075 12.3741 6.15086 12.5091 6.28588C12.6441 6.42091 12.72 6.60405 12.72 6.795V7.542C14.0227 7.73775 14.916 8.47875 15.1545 9.534C15.1686 9.59624 15.1684 9.66084 15.1542 9.72303C15.1399 9.78521 15.1118 9.84338 15.0719 9.89323C15.0321 9.94307 14.9815 9.98332 14.924 10.011C14.8665 10.0386 14.8036 10.053 14.7397 10.053H14.3505C14.0355 10.053 13.7483 9.87075 13.6147 9.58575C13.3658 9.05775 12.777 8.75325 11.9932 8.75325C11.0122 8.75325 10.3507 9.23475 10.3507 9.95625C10.3507 10.5338 10.7902 10.8713 11.8545 11.1233L12.8535 11.352C14.616 11.7555 15.3615 12.483 15.3615 13.7768C15.3615 15.2093 14.361 16.179 12.72 16.4078V17.2748C12.72 17.3693 12.7014 17.4629 12.6652 17.5503C12.629 17.6376 12.576 17.717 12.5091 17.7839C12.4423 17.8507 12.3629 17.9038 12.2755 17.9399C12.1882 17.9761 12.0946 17.9948 12 17.9948C11.9054 17.9948 11.8118 17.9761 11.7245 17.9399C11.6371 17.9038 11.5577 17.8507 11.4909 17.7839C11.424 17.717 11.371 17.6376 11.3348 17.5503C11.2986 17.4629 11.28 17.3693 11.28 17.2748V16.4213C9.8265 16.2458 8.844 15.4763 8.61375 14.2988C8.60369 14.247 8.6052 14.1936 8.61818 14.1425C8.63116 14.0913 8.65528 14.0437 8.68883 14.003C8.72237 13.9623 8.7645 13.9295 8.81221 13.907C8.85991 13.8845 8.912 13.8728 8.96475 13.8728H9.55575C9.8235 13.8728 10.0673 14.0265 10.182 14.2688C10.4543 14.841 11.151 15.1958 12.0233 15.1958C13.0703 15.1958 13.7977 14.6783 13.7977 13.9568C13.7977 13.3313 13.3523 12.9705 12.258 12.7118L11.133 12.447C9.5325 12.0795 8.775 11.31 8.775 10.071C8.775 8.736 9.78225 7.77675 11.28 7.54425V7.545ZM3 12C3 8.02875 5.592 4.6605 9.183 3.483C9.24782 3.46168 9.31676 3.45601 9.38419 3.46647C9.45162 3.47692 9.51562 3.5032 9.57093 3.54315C9.62625 3.5831 9.67132 3.63559 9.70244 3.69631C9.73357 3.75703 9.74986 3.82427 9.75 3.8925V4.14675C9.75 4.533 9.51525 4.88175 9.1575 5.0265C6.39375 6.1455 4.446 8.84625 4.446 12C4.446 15.1523 6.3915 17.8523 9.15225 18.972C9.513 19.1183 9.74925 19.4685 9.74925 19.8578V20.0693C9.74928 20.142 9.73203 20.2136 9.69893 20.2784C9.66583 20.3431 9.61783 20.3991 9.55887 20.4416C9.49992 20.4842 9.43169 20.5121 9.35983 20.5231C9.28796 20.5341 9.2145 20.5279 9.1455 20.505C5.574 19.3163 3 15.9578 3 12ZM21 12C21 15.9488 18.438 19.3005 14.88 20.4968C14.8082 20.5211 14.7316 20.5279 14.6566 20.5167C14.5817 20.5056 14.5104 20.4767 14.4488 20.4325C14.3872 20.3882 14.3371 20.33 14.3025 20.2625C14.2679 20.1951 14.2499 20.1203 14.25 20.0445V19.875C14.25 19.476 14.4915 19.1175 14.8605 18.966C17.6137 17.8433 19.5532 15.147 19.5532 12C19.5532 8.856 17.6183 6.162 14.8688 5.037C14.6858 4.96225 14.5293 4.83474 14.4191 4.67073C14.3089 4.50671 14.2501 4.3136 14.25 4.116V3.9615C14.25 3.8851 14.2683 3.8098 14.3032 3.74184C14.3381 3.67387 14.3886 3.61519 14.4507 3.57064C14.5128 3.52608 14.5846 3.49694 14.6601 3.48561C14.7357 3.47429 14.8128 3.4811 14.8853 3.5055C18.4403 4.70325 21 8.05425 21 12Z"
                    fill="white"
                />
            </g>
            <defs>
                <clipPath id="clip0">
                    <rect width={size} height={size} fill="white" />
                </clipPath>
            </defs>
        </svg>
    </>
)

export interface PoolInListProps {
    index: number
    data: {
        pool: JSON_PayloadInMask
    }
}

export function PoolInList(props: PoolInListProps) {
    const classes = useStyles()
    const { t } = useI18N()
    const { pool } = props.data
    const dateTimeFormat = Intl.DateTimeFormat(languageSettings.value, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    })
    const progress = 100 * (Math.floor(Number(pool.total_remaining)) / Math.floor(Number(pool.total)))
    return (
        <Card className={classes.root}>
            <Box className={classes.icon}>
                <USDCIcon size={32} />
            </Box>
            <Box className={classes.content}>
                <Box className={classes.header}>
                    <Box className={classes.title}>
                        <Typography variant="body1" color="textPrimary">
                            {pool.message}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {t('plugin_ito_list_end_date', {
                                date: dateTimeFormat.format(new Date(pool.end_time * 1000)),
                            })}
                        </Typography>
                    </Box>
                    <Box className={classes.button}>
                        <ActionButton variant="contained">Claim</ActionButton>
                    </Box>
                </Box>
                <Box className={classes.progress}>
                    <LinearProgress variant="determinate" value={progress} />
                </Box>

                <Box className={classes.price}>
                    <Typography variant="body2" color="textSecondary" component="span">
                        {t('pluing_ito_list_sold_total')}
                        <Typography variant="body2" color="textPrimary" component="span">
                            {formatBalance(new BigNumber(pool.total_remaining), pool.token.decimals ?? 0)}
                        </Typography>
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="span">
                        {t('pluing_ito_list_total')}
                        <Typography variant="body2" color="textPrimary" component="span">
                            {formatBalance(new BigNumber(pool.total), pool.token.decimals ?? 0)}
                        </Typography>{' '}
                        {pool.token.symbol}
                    </Typography>
                </Box>

                <Box className={classes.deteils}>
                    <Typography variant="body2" color="textSecondary">
                        {t('pluing_ito_list_sold_details')}
                    </Typography>
                    <TableContainer component={Paper} className={classes.table}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.cell} align="center">
                                        <Typography variant="body2" color="textSecondary">
                                            {t('plugin_ito_list_table_type')}
                                        </Typography>
                                    </TableCell>
                                    <TableCell className={classes.cell} align="center">
                                        <Typography variant="body2" color="textSecondary">
                                            {t('plugin_ito_list_table_price')}
                                        </Typography>
                                    </TableCell>
                                    <TableCell className={classes.cell} align="center">
                                        <Typography variant="body2" color="textSecondary">
                                            {t('plugin_ito_list_table_sold', { token: pool.token.symbol })}
                                        </Typography>
                                    </TableCell>
                                    <TableCell className={classes.cell} align="center">
                                        <Typography variant="body2" color="textSecondary">
                                            {t('plugin_ito_list_table_got')}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pool.exchange_tokens.map((token, index) => (
                                    <TableRow>
                                        <TableCell className={classes.cell} align="center">
                                            {token.symbol}
                                        </TableCell>
                                        <TableCell className={classes.cell} align="center">
                                            {pool.exchange_amounts[index]} {token.symbol} / {pool.token.symbol}
                                        </TableCell>
                                        <TableCell className={classes.cell} align="center">
                                            {formatBalance(new BigNumber(pool.total), pool.token.decimals ?? 0)}
                                        </TableCell>
                                        <TableCell className={classes.cell} align="center">
                                            {formatBalance(
                                                new BigNumber(pool.total_remaining),
                                                pool.token.decimals ?? 0,
                                            )}{' '}
                                            {token.symbol}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </Card>
    )
}

import { formatBalance, resolveTokenLinkOnExplorer } from '@masknet/web3-shared'
import { Grid, Link, makeStyles, Paper, Typography } from '@material-ui/core'
import { isNative } from 'lodash-es'
import ActionButton from '../../../extension/options-page/DashboardComponents/ActionButton'
import { useI18N } from '../../../utils'
import type { RedPacketSettings } from './hooks/useCreateCallback'
import LaunchIcon from '@material-ui/icons/Launch'
import { FormattedBalance } from '@masknet/shared'
import BigNumber from 'bignumber.js'

const useStyles = makeStyles((theme) => ({
    link: {
        display: 'flex',
        marginLeft: theme.spacing(0.5),
    },
    grid: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    hit: {
        fontSize: 14,
        fontWeight: 300,
        borderRadius: 8,
        backgroundColor: theme.palette.divider,
        padding: theme.spacing(1, 0),
        marginBottom: theme.spacing(1),
    },
    token: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
}))

export interface ConfirmRedPacketFormProps {
    onBack: () => void
    onCreate: () => void
    settings?: Omit<RedPacketSettings, 'password'>
}

export function ConfirmRedPacketForm(props: ConfirmRedPacketFormProps) {
    const { t } = useI18N()
    const { onBack, settings, onCreate } = props
    const classes = useStyles()

    return (
        <Grid container spacing={2} className={classes.grid}>
            <Grid item xs={12}>
                <Typography variant="h4" color="textPrimary" align="center">
                    {settings?.message}
                </Typography>
            </Grid>
            <Grid item xs={6}>
                <Typography variant="body1" color="textSecondary">
                    {t('plugin_red_packet_token')}
                </Typography>
            </Grid>
            <Grid item xs={6}>
                <Typography variant="body1" color="textPrimary" align="right" className={classes.token}>
                    <span>{settings?.token?.symbol}</span>
                    {isNative(settings?.token?.address!) ? null : (
                        <Link
                            color="textPrimary"
                            className={classes.link}
                            href={resolveTokenLinkOnExplorer(settings?.token!)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={stop}>
                            <LaunchIcon fontSize="small" />
                        </Link>
                    )}
                </Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography variant="body1" color="textSecondary">
                    {t('plugin_red_packet_split_mode')}
                </Typography>
            </Grid>
            <Grid item xs={6}>
                <Typography variant="body1" color="textPrimary" align="right">
                    {settings?.isRandom ? t('plugin_red_packet_random') : t('plugin_red_packet_average')}
                </Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography variant="body1" color="textSecondary">
                    {t('plugin_red_packet_shares')}
                </Typography>
            </Grid>
            <Grid item xs={6}>
                <Typography variant="body1" color="textPrimary" align="right">
                    {settings?.shares}
                </Typography>
            </Grid>

            {settings?.isRandom ? null : (
                <>
                    <Grid item xs={6}>
                        <Typography variant="body1" color="textSecondary">
                            {t('plugin_red_packet_amount_per_share')}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body1" color="textPrimary" align="right">
                            <FormattedBalance
                                value={new BigNumber(settings?.total ?? 0).div(settings?.shares ?? 1)}
                                decimals={settings?.token?.decimals}
                                symbol={settings?.token?.symbol}
                            />
                        </Typography>
                    </Grid>
                </>
            )}

            <Grid item xs={6}>
                <Typography variant="body1" color="textSecondary">
                    {t('plugin_red_packet_amount_total')}
                </Typography>
            </Grid>
            <Grid item xs={6}>
                <Typography variant="body1" color="textPrimary" align="right">
                    <FormattedBalance
                        value={settings?.total}
                        decimals={settings?.token?.decimals!}
                        symbol={settings?.token?.symbol!}
                    />
                </Typography>
            </Grid>

            <Grid item xs={12}>
                <Paper className={classes.hit}>
                    <Typography variant="body1" color="textPrimary" align="center">
                        {t('plugin_red_packet_hint')}
                    </Typography>
                </Paper>
            </Grid>

            <Grid item xs={6}>
                <ActionButton variant="contained" size="large" fullWidth onClick={onBack}>
                    {t('plugin_red_packet_back')}
                </ActionButton>
            </Grid>
            <Grid item xs={6}>
                <ActionButton variant="contained" size="large" fullWidth onClick={onCreate}>
                    {t('plugin_red_packet_send_symbol', {
                        amount: formatBalance(settings?.total, settings?.token?.decimals ?? 0),
                        symbol: settings?.token?.symbol,
                    })}
                </ActionButton>
            </Grid>
        </Grid>
    )
}

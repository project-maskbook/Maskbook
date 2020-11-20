import { Button, createStyles, Grid, makeStyles } from '@material-ui/core'
import React from 'react'
import { useI18N } from '../../../../utils/i18n-next-ui'
import { QRCodeModel } from './QRCodeModel'
import classNames from 'classnames'

const useStyles = makeStyles(() =>
    createStyles({
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        },
        content: {
            height: 400,
        },
    }),
)

export const FirefoxPlatform: React.FC<{ uri: string }> = ({ uri }) => {
    const { t } = useI18N()
    const classes = useStyles()
    const onConnect = () => open(uri)
    const [qrMode, setQRMode] = React.useState(false)
    const ViewArea = () => {
        if (qrMode) {
            return <QRCodeModel uri={uri} />
        }
        return (
            <div className={classNames(classes.container, classes.content)}>
                <Button onClick={onConnect}>{t('plugin_wallet_on_connect_in_firefox')}</Button>
            </div>
        )
    }
    return (
        <Grid className={classes.container}>
            <ViewArea />
            <Button onClick={() => setQRMode(!qrMode)}>
                {t(qrMode ? 'plugin_wallet_return_mobile_wallet_options' : 'plugin_wallet_view_qr_code')}
            </Button>
        </Grid>
    )
}

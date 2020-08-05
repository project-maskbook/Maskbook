import { Attachment } from '@dimensiondev/common-protocols'
import { Checkbox, FormControlLabel, makeStyles, Typography } from '@material-ui/core'
import { isNil } from 'lodash-es'
import { useSnackbar } from 'notistack'
import React from 'react'
import { useHistory } from 'react-router'
import { useAsync } from 'react-use'
import Services from '../../../extension/service'
import { useI18N } from '../../../utils/i18n-next-ui'
import { makeFileKey } from '../arweave'
import { MAX_FILE_SIZE, pluginId } from '../constants'
import { RecentFiles } from './RecentFiles'
import { UploadDropArea } from './UploadDropArea'
import { Trans } from 'react-i18next'

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: 250,
    },
    upload: {
        flex: 1,
        display: 'flex',
    },
    legal: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 'fit-content',
    },
    encrypted: {
        userSelect: 'none',
        '& span': {
            fontSize: 12,
            lineHeight: 1.75,
            color: '#3B3B3B',
        },
    },
    legalText: {
        userSelect: 'none',
        fontSize: 12,
        lineHeight: 1.75,
        color: '#3B3B3B',
        '& a': {
            color: '#2CA4EF',
            textDecoration: 'none',
        },
    },
})

export const Upload: React.FC = () => {
    const { t } = useI18N()
    const classes = useStyles()
    const history = useHistory()
    const snackbar = useSnackbar()
    const [encrypted, setEncrypted] = React.useState(true)
    const recents = useAsync(() => Services.Plugin.invokePlugin(pluginId, 'getRecentFiles'), [])
    const onFile = async (file: File) => {
        let key
        if (encrypted) {
            key = makeFileKey()
        }
        const block = await file.arrayBuffer()
        const checksum = Buffer.from(await Attachment.checksum(block)).toString('base64')
        const item = await Services.Plugin.invokePlugin(pluginId, 'getFileInfo', checksum)
        if (isNil(item)) {
            history.push('/uploading', {
                key,
                name: file.name,
                size: file.size,
                type: file.type,
                block,
                checksum,
            })
        } else {
            history.push('/uploaded', item)
        }
    }
    const onMore = () => {
        // TODO: open new tab
        // show a selectable list
        // not started any designed
        snackbar.enqueueSnackbar(t('plugin_file_service_on_show_more'))
    }
    return (
        <section className={classes.container}>
            <section className={classes.upload}>
                <UploadDropArea maxFileSize={MAX_FILE_SIZE} onFile={onFile} />
                <RecentFiles files={recents.value ?? []} onMore={onMore} />
            </section>
            <section className={classes.legal}>
                <FormControlLabel
                    control={<Checkbox checked={encrypted} onChange={(event, checked) => setEncrypted(checked)} />}
                    className={classes.encrypted}
                    label={t('plugin_file_service_on_encrypt_it')}
                />
                <Typography className={classes.legalText}>
                    <Trans
                        i18nKey="plugin_file_service_legal_text"
                        components={{
                            terms: <a target="_blank" href={t('plugin_file_service_legal_terms_link')} />,
                            policy: <a target="_blank" href={t('plugin_file_service_legal_policy_link')} />,
                        }}
                    />
                </Typography>
            </section>
        </section>
    )
}

import { MaskDialog } from '@dimensiondev/maskbook-theme'
import { Button, DialogActions, DialogContent, makeStyles } from '@material-ui/core'
import { memo, useState } from 'react'
import { useDashboardI18N } from '../../../../locales/i18n_generated'
import { RestoreTab } from './RestoreTab'

const useStyles = makeStyles((theme) => ({
    file: {},
}))
export interface RestoreBackupDialogProps {
    open: boolean
}

export const RestoreBackupDialog = memo<RestoreBackupDialogProps>(({ open }) => {
    const t = useDashboardI18N()
    const [open_, setOpen_] = useState(open)
    const classes = useStyles()

    return (
        <MaskDialog open={open_} onClose={() => setOpen_(false)} title={t.register_restore_backups()}>
            <DialogContent>
                <RestoreTab />
            </DialogContent>
            <DialogActions>
                <Button color="secondary" onClick={() => setOpen_(false)}>
                    {t.register_restore_backups_cancel()}
                </Button>
                <Button>{t.register_restore_backups_confirm()}</Button>
            </DialogActions>
        </MaskDialog>
    )
})

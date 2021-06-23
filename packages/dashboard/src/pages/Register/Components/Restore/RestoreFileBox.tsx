import { makeStyles, Typography } from '@material-ui/core'
import { memo } from 'react'
import { RestoreFileIcon } from '@dimensiondev/icons'
import { useDashboardI18N } from '../../../../locales/i18n_generated'
import { MaskColorVar } from '@dimensiondev/maskbook-theme'

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: 182,
        backgroundColor: MaskColorVar.secondaryBackground,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',

        '& > svg': {
            fontSize: 42,
        },
    },
    hint: {
        color: MaskColorVar.textSecondary,
        fontSize: 13,
    },
}))
export interface RestoreFileBoxProps {
    file: File | null
    onClick: () => void
    children?: React.ReactNode
}

export const RestoreFileBox = memo<RestoreFileBoxProps>(({ file, children, onClick }) => {
    const classes = useStyles()
    const t = useDashboardI18N()

    return (
        <div className={classes.root} onClick={onClick}>
            {children ?? (
                <>
                    <RestoreFileIcon color="primary" style={{ fill: 'none' }} viewBox="0 0 48 48" />
                    <Typography className={classes.hint}>{t.register_restore_backups_hint()}</Typography>
                </>
            )}
        </div>
    )
})

import { Card, createStyles, makeStyles, CardContent, CardHeader, Typography } from '@material-ui/core'
import { useI18N } from '../../../utils/i18n-next-ui'

const useStyles = makeStyles((theme) => {
    return createStyles({
        root: {
            minHeight: 120,
            padding: 0,
            border: `solid 1px ${theme.palette.divider}`,
            margin: `${theme.spacing(2)} auto`,
            marginBottom: theme.spacing(2),
            '&:first-child': {
                marginTop: 0,
            },
            '&:last-child': {
                marginBottom: 0,
            },
        },
        header: {
            borderBottom: `1px solid ${theme.palette.divider}`,
        },
        content: {
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
        },
        title: {},
    })
})

export interface SnapshotCardProps {
    title: (JSX.Element & React.ReactNode) | string
    children?: React.ReactNode
}

export function SnapshotCard(props: SnapshotCardProps) {
    const { title, children } = props

    const { t } = useI18N()
    const classes = useStyles()

    return (
        <Card className={classes.root} variant="outlined">
            <CardHeader
                className={classes.header}
                title={<Typography className={classes.title}>{title}</Typography>}></CardHeader>
            <CardContent className={classes.content}>{children}</CardContent>
        </Card>
    )
}

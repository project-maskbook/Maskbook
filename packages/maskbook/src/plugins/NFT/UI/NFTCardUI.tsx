import { Typography, Paper, makeStyles } from '@material-ui/core'
import type { TokenDetails } from '../types'

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        alignItems: 'center',
        // width: '100%',
        border: `1px solid ${theme.palette.divider}`,
        boxSizing: 'border-box',
        borderRadius: 12,
        padding: theme.spacing(2),
        cursor: 'default',
        userSelect: 'none',
        '& p': { margin: 0 },
    },
    meta: {
        flex: 1,
        minWidth: '1%',
        marginLeft: 18,
        marginRight: 18,
        fontSize: 14,
        lineHeight: 1.85,
    },
}))

export default function NFTCardUI(props: TokenDetails) {
    const classes = useStyles()

    return (
        <Paper className={classes.root}>
            {props.imageUrl && <img src={props.imageUrl.toString()} width="100%" />}
            <div className={classes.meta}>
                <Typography component="p" color="textPrimary">
                    {props.name}
                </Typography>
            </div>
        </Paper>
    )
}

import { useContext, useRef, useEffect, useState } from 'react'
import classNames from 'classnames'
import {
    Card,
    createStyles,
    makeStyles,
    CardContent,
    CardHeader,
    Box,
    List,
    ListItem,
    Typography,
    LinearProgress,
    withStyles,
} from '@material-ui/core'
import { ShadowRootTooltip } from '../../../utils/shadow-root/ShadowRootComponents'
import millify from 'millify'
import { SnapshotContext } from '../context'
import { useI18N } from '../../../utils/i18n-next-ui'
import { useProposal } from '../hooks/useProposal'
import { useVotes } from '../hooks/useVotes'
import { useResults } from '../hooks/useResults'

const useStyles = makeStyles((theme) => {
    return createStyles({
        root: {
            margin: '16px auto',
            width: '80%',
            border: `solid 1px ${theme.palette.divider}`,
            padding: 0,
            minHeight: 320,
        },
        content: {
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: '0 !important',
        },
        header: {
            backgroundColor: theme.palette.mode === 'dark' ? '#24292e' : 'white',
            borderBottom: `1px solid ${theme.palette.divider}`,
            padding: '12px 16px',
        },
        title: {
            paddingLeft: theme.spacing(1),
            fontSize: 20,
        },
        list: {
            display: 'flex',
            flexDirection: 'column',
        },
        listItem: {
            display: 'flex',
            flexDirection: 'column',
        },
        listItemHeader: {
            display: 'flex',
            width: '100%',
        },
        power: {
            marginLeft: theme.spacing(2),
        },
        ratio: {
            marginLeft: 'auto',
        },
        choice: {
            maxWidth: 200,
        },
        linearProgressWrap: {
            width: '100%',
            marginTop: theme.spacing(1),
        },
        ellipsisText: {
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
        },
    })
})

const StyledLinearProgress = withStyles({
    root: {
        height: 8,
        borderRadius: 5,
    },
    bar: {
        borderRadius: 5,
    },
})(LinearProgress)

export function ResultCard() {
    const identifier = useContext(SnapshotContext)
    const {
        payload: { proposal, message },
    } = useProposal(identifier.id)
    const { payload: votes } = useVotes(identifier)
    const {
        payload: { results },
    } = useResults(identifier)
    const classes = useStyles()
    const { t } = useI18N()
    const listRef = useRef<HTMLSpanElement[]>([])
    const [tooltipVisibles, setTooltipVisibles] = useState<boolean[]>(new Array(results.length).fill(false))

    useEffect(() => {
        setTooltipVisibles(listRef.current.map((element) => (element.offsetWidth === 200 ? true : false)))
    }, [])
    console.log({ results })

    return (
        <Card className={classes.root} elevation={0}>
            <CardHeader
                className={classes.header}
                title={
                    <Box className={classes.title}>
                        {proposal.isEnd ? t('plugin_snapshot_result_title') : t('plugin_snapshot_current_result_title')}
                    </Box>
                }></CardHeader>
            <CardContent className={classes.content}>
                <List className={classes.list}>
                    {results.map((result, i) => (
                        <ListItem className={classes.listItem} key={i.toString()}>
                            <Box className={classes.listItemHeader}>
                                <ShadowRootTooltip
                                    PopperProps={{
                                        disablePortal: true,
                                    }}
                                    title={<Typography color="textPrimary">{result.choice}</Typography>}
                                    placement="top"
                                    disableHoverListener={!tooltipVisibles[i]}
                                    arrow>
                                    <Typography
                                        ref={(ref) => {
                                            listRef.current[i] = ref!
                                        }}
                                        className={classNames(classes.choice, classes.ellipsisText)}>
                                        {result.choice}
                                    </Typography>
                                </ShadowRootTooltip>
                                <ShadowRootTooltip
                                    PopperProps={{
                                        disablePortal: true,
                                    }}
                                    title={
                                        <Typography color="textPrimary" className={classes.ellipsisText}>
                                            {result.powerDetail.reduce((sum, cur, i) => {
                                                return `${sum} ${i === 0 ? '' : '+'} ${
                                                    millify(cur.power, { precision: 2, lowercase: true }) +
                                                    ' ' +
                                                    cur.name
                                                }`
                                            }, '')}
                                        </Typography>
                                    }
                                    placement="top"
                                    arrow>
                                    <Typography className={classes.power}>
                                        {millify(result.power, { precision: 2, lowercase: true })}
                                    </Typography>
                                </ShadowRootTooltip>
                                <Typography className={classes.ratio}>
                                    {parseFloat(result.percentage.toFixed(2))}%
                                </Typography>
                            </Box>
                            <Box className={classes.linearProgressWrap}>
                                <StyledLinearProgress variant="determinate" value={result.percentage} />
                            </Box>
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    )
}

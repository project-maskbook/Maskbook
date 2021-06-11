import { MaskColorVar } from '@dimensiondev/maskbook-theme'
import { makeStyles } from '@material-ui/styles'
import classNames from 'classnames'
export interface BackupPreview {
    email: string
    personas: number
    accounts: number
    posts: number
    contacts: number
    files: number
    wallets: number
}

const useStyles = makeStyles(() => ({
    root: {
        padding: '19px 24px 9px',
        minHeight: 205,
        borderRadius: 8,
        background: MaskColorVar.infoBackground,
    },
    item: {
        paddingBottom: 10,
        display: 'flex',
        justifyContent: 'space-between',
    },
    sub: {
        paddingLeft: 60,
    },
}))

interface Props {
    json: BackupPreview
}

export default function BackupPreviewCard({ json }: Props) {
    const classes = useStyles()

    const records = [
        {
            name: 'Account',
            value: json.email,
        },
        {
            name: 'Personas',
            value: json.personas,
        },
        {
            name: 'Associated account',
            value: json.accounts,
            sub: true,
        },
        {
            name: 'Encrypted Post',
            value: json.posts,
            sub: true,
        },
        {
            name: 'Contacts',
            value: json.contacts,
            sub: true,
        },
        {
            name: 'File',
            value: json.files,
            sub: true,
        },
        {
            name: 'Local Wallet',
            value: json.wallets,
        },
    ]

    return (
        <div className={classes.root}>
            {records.map((record, idx) => (
                <div className={classNames(classes.item, record.sub ? classes.sub : '')} key={idx}>
                    <span>{record.name}</span>
                    <span>{record.value}</span>
                </div>
            ))}
        </div>
    )
}

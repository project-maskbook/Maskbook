import { decompressBackupFile, extraPermissions, UpgradeBackupJSONFile } from '@dimensiondev/maskbook-shared'
import { makeStyles } from '@material-ui/core'
import { memo, useEffect, useRef, useState } from 'react'
import { useAsync, useDropArea } from 'react-use'
import { ReadFileBox } from './ReadFileBox'
import { RestoreFileBox } from './RestoreFileBox'

const useStyles = makeStyles((theme) => ({
    file: {
        display: 'none',
    },
}))

export interface RestoreFileProps {
    file: File | null
}

export const RestoreFile = memo<RestoreFileProps>(({ file }) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const classes = useStyles()
    const [file_, setFile_] = useState<File | null>(file)
    const [backupValue, setBackupValue] = useState('')
    const [json, setJSON] = useState<BackupJSONFileLatest | null>(null)
    const [bound, { over }] = useDropArea({
        onFiles(files) {
            setFile_(files[0])
        },
    })

    useEffect(() => {
        if (file_) {
            const fr = new FileReader()
            fr.readAsText(file_)
            fr.addEventListener('loadend', () => setBackupValue(fr.result as string))
        }
    }, [file_, setBackupValue])

    const permissionState = useAsync(async () => {
        const json = UpgradeBackupJSONFile(decompressBackupFile(backupValue))
        setJSON(json)
        console.log('------')
        console.log(json)
        console.log('======')
        if (!json) throw new Error('UpgradeBackupJSONFile failed')
        return extraPermissions(json.grantedHostPermissions)
    }, [backupValue])

    return (
        <div {...bound}>
            <input
                className={classes.file}
                type="file"
                accept="application/json"
                ref={inputRef}
                onChange={({ currentTarget }: React.ChangeEvent<HTMLInputElement>) => {
                    if (currentTarget.files) setFile_(currentTarget.files.item(0))
                }}
                data-testid="file_input"
            />
            <RestoreFileBox file={file_} onClick={() => inputRef.current && inputRef.current.click()}>
                {json ? <ReadFileBox value={json} /> : null}
            </RestoreFileBox>
        </div>
    )
})

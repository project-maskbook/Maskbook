import { useSnackbar } from 'notistack'
import { useCopyToClipboard } from 'react-use'
import { useI18NFileService } from '../utils'

interface Props {
    className?: string
}

export const CopyableCode: React.FC<Props> = ({ children, className }) => {
    const { t } = useI18NFileService()
    const snackbar = useSnackbar()
    const [, copy] = useCopyToClipboard()
    const onSelect = (event: React.MouseEvent<Node>) => {
        const selection = globalThis.getSelection()
        if (selection === null) {
            return
        }
        const range = globalThis.document.createRange()
        range.selectNode(event.currentTarget)
        selection.removeAllRanges()
        selection.addRange(range)
    }
    const onDeselect = () => {
        globalThis.getSelection()?.removeAllRanges()
    }
    const onCopy = async (event: React.MouseEvent<HTMLElement>) => {
        onSelect(event)
        copy(event.currentTarget.textContent!)
        snackbar.enqueueSnackbar(t('file_key_copied'))
    }
    return (
        <code
            className={className}
            onClick={onCopy}
            onMouseEnter={onSelect}
            onMouseLeave={onDeselect}
            children={children}
        />
    )
}

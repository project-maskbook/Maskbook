import { ButtonGroupTabList } from '@dimensiondev/maskbook-theme'
import { makeStyles, experimentalStyled as styled, Tab, TextField } from '@material-ui/core'
import { TabContext, TabPanel } from '@material-ui/lab'
import { memo, useState } from 'react'
import { useDashboardI18N } from '../../../../locales/i18n_generated'
import { RestoreFile } from './RestoreFile'

const Container = styled('div')`
    display: 'flex';
    padding: 24px;
`
const ButtonGroupTabContainer = styled('div')`
    width: 500px;
    padding: 0 24px;
`

const useStyles = makeStyles((theme) => ({
    root: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    file: {
        display: 'none',
    },
}))

const restoreBackup = ['File', 'Text'] as const
type tabType = typeof restoreBackup[number]

export const RestoreTab = memo(() => {
    const classes = useStyles()
    const t = useDashboardI18N()
    const restoreTabsLabel: Record<tabType, string> = {
        File: t.register_restore_backups_file(),
        Text: t.register_restore_backups_text(),
    }

    const [activeTab, setActiveTab] = useState<tabType>(restoreBackup[0])
    return (
        <>
            <Container>
                <TabContext value={restoreBackup.includes(activeTab) ? activeTab : restoreBackup[0]}>
                    <ButtonGroupTabContainer>
                        <ButtonGroupTabList
                            onChange={(e, v: tabType) => setActiveTab(v)}
                            aria-label={t.register_restore_backups_tabs()}
                            fullWidth>
                            {restoreBackup.map((key) => (
                                <Tab key={key} value={key} label={restoreTabsLabel[key]} />
                            ))}
                        </ButtonGroupTabList>
                    </ButtonGroupTabContainer>
                    <TabPanel value="File" key="File" classes={classes}>
                        <RestoreFile file={null} />
                    </TabPanel>
                    <TabPanel value="Text" key="Text" classes={classes}>
                        <TextField />
                    </TabPanel>
                </TabContext>
            </Container>
        </>
    )
})

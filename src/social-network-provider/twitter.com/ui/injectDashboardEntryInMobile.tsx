import { LiveSelector, MutationObserverWatcher } from '@holoflows/kit/es'
import React from 'react'
import { DashboardRoute } from '../../../extension/options-page/Route'
import Services from '../../../extension/service'
import { MaskbookIcon } from '../../../resources/Maskbook-Circle-WhiteGraph-BlueBackground'
import { renderInShadowRoot } from '../../../utils/jss/renderInShadowRoot'
import { isMobileTwitter } from '../utils/isMobile'

export function injectDashboardEntryInMobileTwitter() {
    if (!isMobileTwitter) return
    const ls = new LiveSelector().querySelector('nav[role="navigation"] a:last-of-type').enableSingleMode()
    new MutationObserverWatcher(ls)
        .setDOMProxyOption({ afterShadowRootInit: { mode: webpackEnv.shadowRootMode } })
        .useForeach((e, k, meta) => {
            return renderInShadowRoot(
                <MaskbookIcon
                    onClick={() => Services.Welcome.openOptionsPage(DashboardRoute.Personas)}
                    style={{ zoom: 1.25 }}
                />,
                {
                    normal: () => meta.after,
                    shadow: () => meta.afterShadow,
                    rootProps: {
                        style: {
                            display: 'flex',
                            width: '20vw',
                            height: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                    },
                },
            )
        })
        .startWatch({ subtree: true, childList: true })
}

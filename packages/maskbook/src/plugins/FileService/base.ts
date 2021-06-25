import type { Plugin } from '@masknet/plugin-infra'

export const base: Plugin.Shared.Definition = {
    ID: 'com.maskbook.fileservice',
    icon: '📃',
    name: { fallback: 'File Service' },
    description: { fallback: 'Upload and share files on top of Arweave network. Store data, permanently.' },
    publisher: { name: { fallback: 'Mask Network' }, link: 'https://mask.io' },
    enableRequirement: {
        architecture: { app: true, web: true },
        networks: { type: 'opt-out', networks: {} },
        target: 'stable',
    },
}

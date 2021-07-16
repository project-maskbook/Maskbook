import type { Plugin } from '@masknet/plugin-infra'
import { VoiceChatPluginID } from './constants'

export const base: Plugin.Shared.Definition = {
    ID: VoiceChatPluginID,
    icon: '🔊',
    name: { fallback: 'VoiceChat' },
    description: { fallback: 'VoiceChat' },
    publisher: { name: { fallback: 'venarius' }, link: 'https://github.com/venarius' },
    enableRequirement: {
        architecture: { app: false, web: true },
        networks: { type: 'opt-out', networks: {} },
        target: 'insider',
    },
}

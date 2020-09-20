import { createTypedMessageMetadataReader, createRenderWithMetadata } from '../../protocols/typed-message/metadata'
import type { PollMetaData } from './types'
import { POLL_META_KEY_1 } from './constants'

export const PollMetadataReader = createTypedMessageMetadataReader<PollMetaData>(POLL_META_KEY_1)
export const renderWithPollMetadata = createRenderWithMetadata(PollMetadataReader)

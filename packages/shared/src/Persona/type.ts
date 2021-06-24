import type { AESJsonWebKey, PersonaIdentifier, ProfileIdentifier } from '..'

/**
 * This interface contains the minimal information for UI display
 */
export interface PersonaInformation {
    /** The nickname of the persona. Should use profile.nickname if it presents. */
    nickname?: string
    identifier: PersonaIdentifier
    linkedProfiles: ProfileInformation[]
}
export interface ProfileInformation {
    /** The nickname of the profile. Should be used in prior. */
    nickname?: string
    identifier: ProfileIdentifier
}

export interface ProfileRecord {
    identifier: ProfileIdentifier
    nickname?: string
    localKey?: AESJsonWebKey
    linkedPersona?: PersonaIdentifier
    createdAt: Date
    updatedAt: Date
}

export interface LinkedProfileDetails {
    connectionConfirmState: 'confirmed' | 'pending' | 'denied'
}

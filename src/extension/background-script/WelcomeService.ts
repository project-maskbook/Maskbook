import { OnlyRunInContext } from '@holoflows/kit'
import { encodeText } from '../../utils/type-transform/String-ArrayBuffer'
import { sleep } from '../../utils/utils'
import { geti18nString } from '../../utils/i18n'
import {
    getLocalKeysDB,
    getMyIdentitiesDB,
    PersonRecordPublic,
    PersonRecordPublicPrivate,
    queryLocalKeyDB,
    queryMyIdentityAtDB,
    queryPeopleDB,
    storeLocalKeyDB,
    storeMyIdentityDB,
} from '../../database/people'
import { BackupJSONFileLatest, JSON_HINT_FOR_POWER_USER } from '../../utils/type-transform/BackupFile'
import { PersonIdentifier } from '../../database/type'
import { MessageCenter } from '../../utils/messages'
import getCurrentNetworkWorker from '../../social-network/utils/getCurrentNetworkWorker'
import { SocialNetworkUI } from '../../social-network/ui'
import { getWelcomePageURL } from '../options-page/Welcome/getWelcomePageURL'
import { getMyProveBio } from './CryptoServices/getMyProveBio'
import {
    generate_ECDH_256k1_KeyPair_ByMnemonicWord,
    recover_ECDH_256k1_KeyPair_ByMnemonicWord,
} from '../../utils/mnemonic-code'
import { derive_AES_GCM_256_Key_From_PBKDF2, import_PBKDF2_Key } from '../../utils/crypto.subtle'
import { CryptoKeyToJsonWebKey } from '../../utils/type-transform/CryptoKey-JsonWebKey'
import stableStringify from 'json-stable-stringify'
import { createDefaultFriendsGroup } from '../../database'

OnlyRunInContext('background', 'WelcomeService')
async function generateBackupJSON(whoAmI: PersonIdentifier, full = false): Promise<BackupJSONFileLatest> {
    const manifest = browser.runtime.getManifest()
    const myIdentitiesInDB: BackupJSONFileLatest['whoami'] = []
    const peopleInDB: NonNullable<BackupJSONFileLatest['people']> = []

    const promises: Promise<void>[] = []
    //#region data.whoami
    const localKeys = await getLocalKeysDB()
    const myIdentity = await getMyIdentitiesDB()
    if (!whoAmI.isUnknown) {
        if ((await hasValidIdentity(whoAmI)) === false) {
            throw new Error('Generate fail')
        }
    }
    async function addMyIdentitiesInDB(data: PersonRecordPublicPrivate) {
        myIdentitiesInDB.push({
            network: data.identifier.network,
            userId: data.identifier.userId,
            nickname: data.nickname,
            previousIdentifiers: data.previousIdentifiers,
            localKey: await exportKey(localKeys.get(data.identifier.network)![data.identifier.userId]!),
            publicKey: await exportKey(data.publicKey),
            privateKey: await exportKey(data.privateKey),
            [JSON_HINT_FOR_POWER_USER]:
                (await getMyProveBio(data.identifier)) ||
                'We are sorry, but this field is not available. It may help to set up Maskbook again.',
        })
    }
    for (const id of myIdentity) {
        promises.push(addMyIdentitiesInDB(id))
    }
    //#endregion

    //#region data.people
    async function addPeople(data: PersonRecordPublic) {
        peopleInDB.push({
            network: data.identifier.network,
            userId: data.identifier.userId,
            groups: data.groups.map(g => ({
                network: g.network,
                groupID: g.groupID,
                virtualGroupOwner: g.virtualGroupOwner,
            })),
            nickname: data.nickname,
            previousIdentifiers: (data.previousIdentifiers || []).map(p => ({ network: p.network, userId: p.userId })),
            publicKey: await exportKey(data.publicKey),
        })
    }
    if (full) {
        for (const p of await queryPeopleDB(() => true)) {
            if (p.publicKey) promises.push(addPeople(p as PersonRecordPublic))
        }
    }
    //#endregion

    await Promise.all(promises)
    const grantedHostPermissions = (await browser.permissions.getAll()).origins || []
    if (full)
        return {
            version: 1,
            whoami: myIdentitiesInDB,
            people: peopleInDB,
            grantedHostPermissions,
            maskbookVersion: manifest.version,
        }
    else
        return {
            version: 1,
            whoami: myIdentitiesInDB,
            grantedHostPermissions,
            maskbookVersion: manifest.version,
        }
    function exportKey(k: CryptoKey) {
        return crypto.subtle.exportKey('jwk', k)
    }
}
async function hasValidIdentity(whoAmI: PersonIdentifier) {
    const local = await queryLocalKeyDB(whoAmI)
    const ecdh = await queryMyIdentityAtDB(whoAmI)
    return !!local && !!ecdh && !!ecdh.privateKey && !!ecdh.publicKey
}

/**
 *
 * Generate new identity by a password
 *
 * !!! Need Security Audit !!!
 * !!! Don't use it in prod before audit !!!
 * @param whoAmI Who Am I
 * @param password password used to generate mnemonic word, can be empty string
 */
export async function createNewIdentityByMnemonicWord(whoAmI: PersonIdentifier, password: string) {
    const x = await generate_ECDH_256k1_KeyPair_ByMnemonicWord(password)
    return generateNewIdentity(whoAmI, x)
}

/**
 *
 * Recover new identity by a password and mnemonic words
 *
 * !!! Need Security Audit !!!
 * !!! Don't use it in prod before audit !!!
 * @param whoAmI Who Am I
 * @param password password used to generate mnemonic word, can be empty string
 * @param word mnemonic words
 */
export async function restoreNewIdentityWithMnemonicWord(whoAmI: PersonIdentifier, word: string, password: string) {
    return generateNewIdentity(whoAmI, await recover_ECDH_256k1_KeyPair_ByMnemonicWord(word, password))
}
/**
 * !!! Need Security Audit !!!
 * !!! Don't use it in prod before audit !!!
 */
async function generateNewIdentity(
    whoAmI: PersonIdentifier,
    usingKey: {
        key: CryptoKeyPair
        mnemonicWord: string
    },
) {
    const { key, mnemonicWord } = usingKey
    const pub = await CryptoKeyToJsonWebKey(key.publicKey)
    const priv = await CryptoKeyToJsonWebKey(key.privateKey)
    // !!! Need Security Audit !!!
    // ? Is it secure to "derive" localKey(a AES_GCM_256_Key that should never shared to others)
    // ? Derive method: publicKey as "password" and privateKey as hash
    const pbkdf2 = await import_PBKDF2_Key(encodeText(stableStringify(pub)))
    const localKey = await derive_AES_GCM_256_Key_From_PBKDF2(pbkdf2, encodeText(stableStringify(priv)))

    await storeLocalKeyDB(whoAmI, localKey)
    // TODO: If there is some old key that will be overwritten, warn the user.
    await storeMyIdentityDB({
        groups: [],
        identifier: whoAmI,
        publicKey: key.publicKey,
        privateKey: key.privateKey,
    })
    await createDefaultFriendsGroup(whoAmI).catch(console.error)
    MessageCenter.emit('identityUpdated', undefined)
    return mnemonicWord
}

export async function attachIdentityToPersona(whoAmI: PersonIdentifier, targetIdentity: PersonIdentifier) {
    const id = await queryMyIdentityAtDB(targetIdentity)
    if (!id) throw new Error('Not found')
    return generateNewIdentity(whoAmI, {
        key: { privateKey: id.privateKey, publicKey: id.publicKey },
        mnemonicWord: '',
    })
}

export async function backupMyKeyPair(whoAmI: PersonIdentifier, download = true) {
    // Don't make the download pop so fast
    await sleep(1000)
    const obj = await generateBackupJSON(whoAmI)
    if (!download) return obj
    const string = JSON.stringify(obj)
    const buffer = encodeText(string)
    const blob = new Blob([buffer], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const date = new Date()
    const today = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
        .getDate()
        .toString()
        .padStart(2, '0')}`
    browser.downloads.download({
        url,
        filename: `maskbook-keystore-backup-${today}.json`,
        saveAs: true,
    })
    return obj
}

export async function openWelcomePage(id?: SocialNetworkUI['lastRecognizedIdentity']['value']) {
    if (id) {
        if (!getCurrentNetworkWorker(id.identifier).isValidUsername(id.identifier.userId))
            throw new TypeError(geti18nString('service_username_invalid'))
    }
    return browser.tabs.create({ url: getWelcomePageURL(id) })
}

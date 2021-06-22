import React, { memo, useEffect, useState } from 'react'
import { SearchableList } from '@dimensiondev/maskbook-theme'
import { TokenInList } from './TokenInList'
import {
    Asset,
    EthereumTokenType,
    FungibleTokenDetailed,
    isSameAddress,
    useTrustedERC20TokensFromDB,
} from '@dimensiondev/web3-shared'
import { some } from 'lodash-es'
import { useERC20TokensDetailed } from '../../pages/Wallets/hooks/useERC20TokensDetailed'
import { useDashboardI18N } from '../../locales'

interface IProps {
    onSelect(asset: Asset): void
}

const isImportedToken = (token: FungibleTokenDetailed, tokens: FungibleTokenDetailed[]) =>
    token.type === EthereumTokenType.Native || some(tokens, (t: any) => isSameAddress(token.address, t.address))

export const TokenList: React.FC<IProps> = memo(({ onSelect }) => {
    const t = useDashboardI18N()
    const [status, setStatus] = useState('')
    const tokens = useTrustedERC20TokensFromDB()

    const { loading, value: assets } = useERC20TokensDetailed()
    const renderAsset = assets.map((x) => ({ ...x, isImported: isImportedToken(x.token, tokens) }))

    useEffect(() => {
        setStatus(loading ? t.wallets_loading_token() : '')
    }, [loading])

    return (
        <SearchableList<Asset & { isImported: boolean }>
            onSelect={onSelect}
            data={renderAsset}
            searchKey={['token.address', 'token.symbol']}
            itemRender={TokenInList}
            status={status}
        />
    )
})

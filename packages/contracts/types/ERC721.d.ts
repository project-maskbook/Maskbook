/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from 'bn.js'
import { ContractOptions } from 'web3-eth-contract'
import { EventLog } from 'web3-core'
import { EventEmitter } from 'events'
import {
    Callback,
    PayableTransactionObject,
    NonPayableTransactionObject,
    BlockType,
    ContractEventLog,
    BaseContract,
} from './types'

interface EventOptions {
    filter?: object
    fromBlock?: BlockType
    topics?: string[]
}

export type Approval = ContractEventLog<{
    owner: string
    approved: string
    tokenId: string
    0: string
    1: string
    2: string
}>
export type ApprovalForAll = ContractEventLog<{
    owner: string
    operator: string
    approved: boolean
    0: string
    1: string
    2: boolean
}>
export type Transfer = ContractEventLog<{
    from: string
    to: string
    tokenId: string
    0: string
    1: string
    2: string
}>

export interface ERC721 extends BaseContract {
    constructor(jsonInterface: any[], address?: string, options?: ContractOptions): ERC721
    clone(): ERC721
    methods: {
        supportsInterface(interfaceId: string | number[]): NonPayableTransactionObject<boolean>

        balanceOf(owner: string): NonPayableTransactionObject<string>

        ownerOf(tokenId: number | string | BN): NonPayableTransactionObject<string>

        name(): NonPayableTransactionObject<string>

        symbol(): NonPayableTransactionObject<string>

        tokenURI(tokenId: number | string | BN): NonPayableTransactionObject<string>

        baseURI(): NonPayableTransactionObject<string>

        tokenOfOwnerByIndex(owner: string, index: number | string | BN): NonPayableTransactionObject<string>

        totalSupply(): NonPayableTransactionObject<string>

        tokenByIndex(index: number | string | BN): NonPayableTransactionObject<string>

        approve(to: string, tokenId: number | string | BN): NonPayableTransactionObject<void>

        getApproved(tokenId: number | string | BN): NonPayableTransactionObject<string>

        setApprovalForAll(operator: string, approved: boolean): NonPayableTransactionObject<void>

        isApprovedForAll(owner: string, operator: string): NonPayableTransactionObject<boolean>

        transferFrom(from: string, to: string, tokenId: number | string | BN): NonPayableTransactionObject<void>

        'safeTransferFrom(address,address,uint256)'(
            from: string,
            to: string,
            tokenId: number | string | BN,
        ): NonPayableTransactionObject<void>

        'safeTransferFrom(address,address,uint256,bytes)'(
            from: string,
            to: string,
            tokenId: number | string | BN,
            _data: string | number[],
        ): NonPayableTransactionObject<void>
    }
    events: {
        Approval(cb?: Callback<Approval>): EventEmitter
        Approval(options?: EventOptions, cb?: Callback<Approval>): EventEmitter

        ApprovalForAll(cb?: Callback<ApprovalForAll>): EventEmitter
        ApprovalForAll(options?: EventOptions, cb?: Callback<ApprovalForAll>): EventEmitter

        Transfer(cb?: Callback<Transfer>): EventEmitter
        Transfer(options?: EventOptions, cb?: Callback<Transfer>): EventEmitter

        allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter
    }

    once(event: 'Approval', cb: Callback<Approval>): void
    once(event: 'Approval', options: EventOptions, cb: Callback<Approval>): void

    once(event: 'ApprovalForAll', cb: Callback<ApprovalForAll>): void
    once(event: 'ApprovalForAll', options: EventOptions, cb: Callback<ApprovalForAll>): void

    once(event: 'Transfer', cb: Callback<Transfer>): void
    once(event: 'Transfer', options: EventOptions, cb: Callback<Transfer>): void
}

import { useMemo, useState } from 'react'
import { useUpdateEffect } from 'react-use'
import {
    Box,
    Button,
    makeStyles,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    TableRow,
    Typography,
} from '@material-ui/core'
import { isSameAddress, useAccount, useChainId, useERC20TokenList, useTokenConstants } from '@masknet/web3-shared'
import { useTransactions } from '../../../../plugins/Wallet/hooks/useTransactions'
import { Row } from './Row'
import { FilterTransactionType, Transaction, TransactionPair } from '../../../../plugins/Wallet/types'

const useStyles = makeStyles(() => ({
    fixed: { height: 'calc(100% - 52px)' },
}))

export interface TransactionListProps {
    transactionType: FilterTransactionType
}

export interface WalletTransactionPair extends TransactionPair {
    logoURL?: string
}

export interface WalletTransaction extends Transaction {
    pairs: WalletTransactionPair[]
}

export function TransactionList({ transactionType }: TransactionListProps) {
    const styles = useStyles()
    const chainId = useChainId()
    const account = useAccount()
    const { NATIVE_TOKEN_ADDRESS } = useTokenConstants()
    const [page, setPage] = useState(0)
    const { value: tokens } = useERC20TokenList()

    const {
        value = { transactions: [], hasNextPage: false },
        loading: transactionsLoading,
        error: transactionsError,
        retry: transactionsRetry,
    } = useTransactions(account, page)

    const { transactions = [], hasNextPage } = value

    const dataSource = useMemo(() => {
        return transactions
            .filter(({ transactionType: type }) =>
                transactionType === FilterTransactionType.ALL ? true : type === transactionType,
            )
            .map((transaction) => {
                const pairs = transaction.pairs.map((pair) => {
                    if (pair.address === 'eth') {
                        return { ...pair, ...{ address: NATIVE_TOKEN_ADDRESS } }
                    } else {
                        const token = tokens?.find((token) => isSameAddress(token.address, pair.address))
                        return { ...pair, ...{ logoURL: token?.logoURI } }
                    }
                })
                return { ...transaction, ...{ pairs: pairs } }
            })
    }, [transactions, transactions.length, transactionType, tokens?.length])

    useUpdateEffect(() => {
        setPage(0)
    }, [transactionType, account, chainId])

    if (transactionsLoading)
        return (
            <Table>
                <TableBody>
                    {new Array(3).fill(0).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                <Skeleton animation="wave" variant="rectangular" width="100%" height={30} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        )

    return (
        <>
            <TableContainer className={styles.fixed}>
                {transactionsError || dataSource.length === 0 ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                        }}>
                        <Typography color="textSecondary">No transaction found.</Typography>
                        <Button
                            sx={{
                                marginTop: 1,
                            }}
                            variant="text"
                            onClick={() => transactionsRetry()}>
                            Retry
                        </Button>
                    </Box>
                ) : (
                    <Table>
                        <TableBody>
                            {dataSource.map((transaction) => (
                                <Row key={transaction.id} chainId={chainId} transaction={transaction} />
                            ))}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            {!(page === 0 && dataSource.length === 0) ? (
                <TablePagination
                    count={-1}
                    component="div"
                    onPageChange={() => {}}
                    page={page}
                    rowsPerPage={30}
                    rowsPerPageOptions={[30]}
                    labelDisplayedRows={() => null}
                    backIconButtonProps={{
                        onClick: () => setPage((prev) => prev - 1),
                        size: 'small',
                        disabled: page === 0,
                    }}
                    nextIconButtonProps={{
                        onClick: () => setPage((prev) => prev + 1),
                        disabled: !hasNextPage,
                        size: 'small',
                    }}
                />
            ) : null}
        </>
    )
}

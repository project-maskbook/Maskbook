export function unreachable(val: never): never {
    console.error('Unhandled value: ', val)
    throw new Error('Unreachable case:' + val)
}

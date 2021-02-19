import { createContext } from 'react'
import type { useMaskThemeI18N } from '../../locales'
export interface ErrorBoundaryError {
    /** Type of the Error */
    type: string
    /** The Error message */
    message: string
    /** The error stack */
    stack: string
}
const ErrorBoundaryContextDefault: Partial<
    {
        getBuildInfo(): string
    } & Pick<ReturnType<typeof useMaskThemeI18N>, 'error_boundary_report_email'>
> = {}
export const ErrorBoundaryContext = createContext(ErrorBoundaryContextDefault)

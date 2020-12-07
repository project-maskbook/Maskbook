import type * as settings from '../../settings/settings'
/**
 * JSON RPC calls that can be called from the native side.
 * JS = server, native = client
 */
export interface WebviewAPIs {
    web_echo<T>(arg: T): Promise<T>
    getDashboardUrl(path: string): Promise<string>
    getSettings(key: keyof typeof settings): Promise<any>
    getConnectedPersonas(): Promise<{ network: string; connected: boolean }[][]>
}
export interface SharedNativeAPIs {}
/**
 * JSON RPC calls that can be called if it is running on iOS.
 * JS = client, iOS = server
 */
export interface iOSNativeAPIs extends SharedNativeAPIs {
    scanQRCode(): Promise<string>
    log(...args: any[]): Promise<void>
}
/**
 * JSON RPC calls that can be called if it is running on Android.
 * JS = client, Android = server
 */
export interface AndroidNativeAPIs extends SharedNativeAPIs {
    android_echo(arg: string): Promise<string>
}

/// <reference path="./ShapeDetectionPolyfill.ts" />
import * as React from 'react'
import { useRef } from 'react'
import { useQRCodeScan } from '../../../utils/hooks/useQRCodeScan'
import { decompressBackupFile, compressBackupFile } from '../../../utils/type-transform/BackupFileShortRepresentation'

interface Props {
    scanning: boolean

    onResult(data: string): void

    onError(): void
}

export default function QRScanner(
    props: Props & React.DetailedHTMLProps<React.VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>,
) {
    const { scanning, onResult, onError, ...videoProps } = props
    const video = useRef<HTMLVideoElement | null>(null)

    useQRCodeScan(video, scanning, x => compressBackupFile(decompressBackupFile(x)), onError)
    return (
        <div style={{ position: 'relative' }}>
            <video ref={video} aria-label="QR Code scanner" {...videoProps} />
        </div>
    )
}

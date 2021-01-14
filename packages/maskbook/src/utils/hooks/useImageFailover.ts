import { useAsync } from 'react-use'

interface ImgCdnPair {
    img: string
    cdn: string
}

export function useImageFailover(imgCdnPairs: ImgCdnPair[]) {
    return useAsync(() => {
        return new Promise((resolve) => {
            const image = new Image()
            let imgCdnPair: ImgCdnPair
            image.addEventListener('error', () => {
                if (imgCdnPairs.length === 0) resolve('')
                imgCdnPair = imgCdnPairs.shift()!
                image.src = imgCdnPair.img
            })
            image.addEventListener('load', () => {
                resolve(imgCdnPair.cdn)
            })
            if (imgCdnPairs.length === 0) resolve('')
            imgCdnPair = imgCdnPairs.shift()!
            image.src = imgCdnPair.img
        })
    })
}

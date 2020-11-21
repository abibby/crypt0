import { bindValue } from '@zwzn/spicy'
import CryptoJS from 'crypto-js'
import AES from 'crypto-js/aes'
import { FunctionalComponent, h } from 'preact'
import { useState } from 'preact/hooks'
import { useArg } from '../args'

export const Home: FunctionalComponent = () => {
    const [hash] = useArg('hash', '')
    const [message, setMessage] = useState('')
    const key = 'key'

    const url = new URL(location.href)
    url.searchParams.set('hash', AES.encrypt(message, key).toString())
    return (
        <div>
            <h1>Home</h1>
            <pre>{AES.decrypt(hash, key).toString(CryptoJS.enc.Utf8)}</pre>

            <textarea
                value={message}
                onInput={bindValue(setMessage)}
            ></textarea>
            <div>
                <a href={url.toString()}>{url.toString()}</a>
            </div>
        </div>
    )
}

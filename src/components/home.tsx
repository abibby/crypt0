import { bindValue } from '@zwzn/spicy'
import { get, set } from 'idb-keyval'
import NodeRSA from 'node-rsa'
import { FunctionalComponent, h } from 'preact'
import { useCallback, useState } from 'preact/hooks'
import { useArg } from '../args'

export const Home: FunctionalComponent = () => {
    const [hash] = useArg('hash', '')
    const [message, setMessage] = useState('')
    const [encryptedMessage, setEncryptedMessage] = useState('')
    const [decryptedMessage, setDecryptedMessage] = useState('')
    const [key, setKey] = useState<NodeRSA | undefined>(undefined)

    const generateKeyPair = useCallback(async () => {
        const keys = await get<{ private: string; public: string }>('keys')

        let newKey: NodeRSA
        if (keys === undefined) {
            newKey = new NodeRSA({ b: 512 })
            set('keys', {
                private: newKey.exportKey('private'),
                public: newKey.exportKey('public'),
            })
            console.log('new')
        } else {
            newKey = new NodeRSA({ b: 512 })
            newKey.importKey(keys.private)
            console.log('old')
        }

        setDecryptedMessage(newKey.decrypt(hash, 'utf8'))
        setKey(newKey)
    }, [])

    const encrypt = useCallback(() => {
        console.log(key?.encrypt(message, 'base64') ?? '')

        setEncryptedMessage(key?.encrypt(message, 'base64') ?? '')
        console.log('test')
    }, [key, message])

    const url = new URL(location.href)
    url.searchParams.set('hash', encryptedMessage)
    return (
        <div>
            <h1>Home</h1>
            <pre>{decryptedMessage}</pre>

            <textarea value={message} onInput={bindValue(setMessage)} />
            <div>
                <a href={url.toString()}>{url.toString()}</a>
            </div>

            <button onClick={generateKeyPair}>Generate Key Pair</button>
            <button onClick={encrypt}>Encrypt</button>
        </div>
    )
}

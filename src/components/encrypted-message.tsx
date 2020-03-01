import { FunctionalComponent, h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { wrap } from "comlink";
const { decrypt } = wrap<typeof import('../encrypt')>(new Worker('../worker.ts'))

export const EncryptedMessage: FunctionalComponent<{ message: string }> = ({ message }) => {

    const [decryptedMessage, changeDecryptedMessage] = useState('')
    useEffect(() => {
        (async () => {
            if (message === '') {
                return
            }
            try {
                const decrypted = await decrypt('adam@bibby.io', message)
                changeDecryptedMessage(decrypted)
            } catch (e) {
                changeDecryptedMessage(`failed to decrypt message ${e}`)
            }
        })()
    }, [message])

    return <pre>
        {decryptedMessage}
    </pre>
}
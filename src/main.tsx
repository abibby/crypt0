import Peer from 'peerjs'
import { render, h, FunctionalComponent } from 'preact'
import { useLocationHash, useInputValue } from './utils'
import { useCallback, useState, useEffect } from 'preact/hooks'
import { wrap } from 'comlink'
import { EncryptedMessage } from './components/encrypted-message'

const { encrypt } = wrap<typeof import('./encrypt')>(new Worker('worker.ts'))

const App: FunctionalComponent = props => {
    const hash = useLocationHash()
    const [message, changeMessage] = useInputValue()

    const copy = useCallback(async () => {
        const encrypted = await encrypt('adam@bibby.io', message)
        await navigator.clipboard.writeText(location.origin + '#' + encrypted)
    }, [message])


    return <div>
        <textarea placeholder='message' onInput={changeMessage} value={message}></textarea>
        <button onClick={copy}>Copy</button>
        <EncryptedMessage message={hash} />
    </div>
}
render(<App />, document.getElementById('app')!)
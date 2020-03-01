import { useState, useEffect, useCallback } from 'preact/hooks'

export function useLocationHash(): string {
    const [hash, changeHash] = useState(location.hash.slice(1))
    useEffect(() => {
        const cb = () => changeHash(location.hash.slice(1))
        window.addEventListener('hashchange', cb)
        return () => window.removeEventListener('hashchange', cb)
    }, [changeHash])
    return hash
}

export function useInputValue(initialValue: string = ''): [string, ((e: Event) => void)] {
    const [value, changeValue] = useState(initialValue)
    const onChange = useCallback((e: Event) => {
        const input = e.target
        if (input instanceof HTMLInputElement
            || input instanceof HTMLTextAreaElement
            || input instanceof HTMLSelectElement) {

            changeValue(input.value)
        }
    }, [changeValue])
    return [value, onChange]
}
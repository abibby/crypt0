export function useArg(
    name: string,
): [string | undefined, (value: string) => void]
export function useArg<T>(
    name: string,
    defaultValue: T,
): [string | T, (value: string) => void]
export function useArg<T>(
    name: string,
    defaultValue?: T | undefined,
): [string | T | undefined, (value: string) => void] {
    const url = new URL(location.href)
    const param = url.searchParams.get(name) ?? defaultValue
    return [
        param,
        (value: string) => {
            const url = new URL(location.href)
            url.searchParams.set(name, value)
        },
    ]
}

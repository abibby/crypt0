declare module 'openpgp/dist/compat/openpgp' {
    const pgp: typeof import('openpgp');
    export = pgp
}

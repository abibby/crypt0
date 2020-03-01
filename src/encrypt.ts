import * as openpgp from 'openpgp/dist/compat/openpgp'
import { set, get } from 'idb-keyval'
export interface Key {
    email: string
    privateKeyArmored: string
    publicKeyArmored: string
    revocationCertificate: string
}

async function getKeys(email: string): Promise<Key> {
    let key = await get<Key | undefined>(email)
    if (key === undefined) {
        const { privateKeyArmored, publicKeyArmored, revocationCertificate } = await openpgp.generateKey({
            userIds: [{ name: 'Jon Smith', email: email }], // you can pass multiple user IDs
            // rsaBits: 4096,                                              // RSA key size
            // passphrase: 'super long and hard to guess secret'           // protects the private key
        });
        key = {
            email: email,
            privateKeyArmored: privateKeyArmored,
            publicKeyArmored: publicKeyArmored,
            revocationCertificate: revocationCertificate,
        }

        await set(email, key)
    }
    return key
}

async function read(b: ReadableStream<Uint8Array> | Uint8Array): Promise<Uint8Array> {
    if (b instanceof Uint8Array) {
        return Promise.resolve(b)
    }


    let data: number[] = []
    let reader = b.getReader()
    let current = await reader.read()

    while (!current.done) {
        data.push(...Array.from(current.value))

        current = await reader.read()
    }
    return new Uint8Array(data)
}


export async function encrypt(email: string, message: string): Promise<string> {
    const key = await getKeys(email)
    const result = await openpgp.encrypt({
        message: openpgp.message.fromText(message), // input as Message object
        armor: false,                                      // don't ASCII armor (for Uint8Array output)
        publicKeys: (await openpgp.key.readArmored(key.publicKeyArmored)).keys, // for encryption
        // privateKeys: (await openpgp.key.readArmored(key.privateKeyArmored)).keys
    });
    return await toBase64(await read(result.message.packets.write())); // get raw encrypted packets as Uint8Array
}
export async function decrypt(email: string, encrypted: string): Promise<string> {
    const key = await getKeys(email)

    const result = await openpgp.decrypt({
        message: await openpgp.message.read(await fromBase64(encrypted)),
        format: 'utf8',
        // publicKeys: (await openpgp.key.readArmored(key.publicKeyArmored)).keys, // for encryption
        privateKeys: (await openpgp.key.readArmored(key.privateKeyArmored)).keys
    });
    return result.data as string
}

async function toBase64(uint8: Uint8Array): Promise<string> {
    const blob = await (new Response(uint8)).blob();
    return await new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.onload = function () {
            var dataUrl = reader.result;
            if (dataUrl === null) {
                reject(new Error('reader result is null'))
                return
            }
            var base64 = dataUrl.toString().split(',')[1];
            resolve(base64);
        };
        reader.readAsDataURL(blob);
    });
}
async function fromBase64(b64: string): Promise<Uint8Array> {
    return Uint8Array.from(atob(b64), c => c.charCodeAt(0))
}
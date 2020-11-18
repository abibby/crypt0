import * as openpgp from 'openpgp/dist/compat/openpgp'
import { set, get, Store } from 'idb-keyval'
import { v4 as uuidV4 } from 'uuid';

const userStore = new Store('user')

export interface User {
    id: string
    name: string
    email: string
    publicKey: string
}

export interface MyUser extends User {
    privateKey: string
}

export async function saveUser(user: User): Promise<void> {
    await set(user.id, user, userStore)
}

export async function getUser(id: string): Promise<User | undefined> {
    return await get(id, userStore)
}

async function getID(): Promise<string> {
    let id = await get<string | undefined>('user-id')
    if (id === undefined) {
        id = uuidV4()
        await set('user-id', id)
    }
    return id
}


export async function getMyUser(): Promise<MyUser> {
    const id = await getID()
    let user: User | MyUser | undefined = await getUser(id)
    if (user === undefined) {

        const name = 'Adam Bibby'
        const email = 'adam@bibby.io'

        const { privateKeyArmored, publicKeyArmored } = await openpgp.generateKey({
            userIds: [{ name: name, email: email }], // you can pass multiple user IDs
            // rsaBits: 4096,                                              // RSA key size
            // passphrase: 'super long and hard to guess secret'           // protects the private key
        });
        user = {
            id: id,
            name: name,
            email: email,
            publicKey: publicKeyArmored,
            privateKey: privateKeyArmored,
        }
        await saveUser(user)
    }

    if (!('privateKey' in user)) {
        throw new Error('user does not have a private key')
    }
    return user
}




import Peer, { DataConnection } from 'peerjs'

export async function getKey(id: string) {
    const conn = await connect(id)
    await request(conn, 'hello')
}

function connect(id: string): Promise<Peer.DataConnection> {
    return new Promise((resolve, reject) => {
        const peer = new Peer()
        const conn = peer.connect(id)
        conn.on('open', () => {
            resolve(conn)
        })
    })
}

function request(conn: DataConnection, message: unknown): Promise<unknown> {
    return new Promise((resolve, reject) => {
        conn.on('data', (data) => {
            resolve(data)
        })
        conn.send(message)
    })
}

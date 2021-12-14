import { MongoClient } from "mongodb"

export const connectDatabase = async () => {
    const client = await MongoClient.connect(process.env.DATABASE_URL)

    return client
}

export const insertDocument = async (client: { db: (arg0: string) => any }, collection: any, document: any) => {
    const db = client.db('teach-class')

    const result = await db.collection(collection).insertOne(document)

    return result
}

export const getDocument = async (client: { db: (arg0: string) => any }, collection: any, document: any) => {
    const db = client.db('teach-class')

    const result = await db.collection(collection).findOne(document)

    return result
}

export const getCourses = async (client: { db: (arg0: string) => any }, collection: any, document: any) => {
    const db = client.db('teach-class')

    const result = await db.collection(collection).find(document).toArray()

    return result
}
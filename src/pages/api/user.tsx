import { MongoClient } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"
import { connectDatabase, insertDocument } from '../../../utils/database'

interface ResponseType {
  message: string;
}

interface SuccessResponseType {
  _id: string;
  name: string;
  email: string;
  cellphone: string;
  teacher: boolean;
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType | SuccessResponseType>
): Promise<void> => {

  if (req.method === 'POST') {
    const { name, email, cellphone, teacher } = req.body

    if (!name || !email ||!email.includes('@') || !cellphone || !teacher) {
      res.status(422).json({ message: 'Invalid field parameters' })
      return
    }


    let client: MongoClient
          
      try {
        client = await connectDatabase()
    } catch (error) {
        res.status(500).json({ message: 'Connecting to the database failed!' })
        return
    }

    try {
        await insertDocument(client, 'users', {
          name,
          email,
          cellphone,
          teacher
        })

        client.close()
    } catch (error) {
        res.status(500).json({ message: 'Insert data failed!' })
        return
    }     
        
    // res.status(201).json({ message: 'Signed up success' })
    res.status(201).json({ message: 'Created success' })
  
  }

}


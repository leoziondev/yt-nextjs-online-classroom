import { MongoClient, ObjectId } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"
import { connectDatabase, insertDocument, getDocument } from '../../../utils/database';

interface ResponseType {
  message: string;
}

interface SuccessResponseType {
    _id: string,
    name: string,
    email: string,
    cellphone: string,
    teacher: boolean,
    coins: 1,
    courses: string[],
    available_hours: object,
    available_locations: string[],
    reviews: object[],
    appointments: object[]
  }

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType | SuccessResponseType>
): Promise<void> => {

  if ( req.method === 'GET' ) {
    let client: MongoClient
    const {id} = req.body

    if (!id) {
      res.status(422).json({message: 'Missing Teacher ID on request body'})
      return
    }
          
    try {
        client = await connectDatabase()
    } catch (error) {
        res.status(500).json({ message: 'Connecting to the database failed!' })
        return
    }

    try {
        const response = await getDocument(client, 'users', {
          _id: new ObjectId(id)
        })

        if (!response) {
          res.status(422).json({message: 'Teacher ID not found'})
        }

        res.status(200).json(response)

        client.close()
    } catch (error) {
        res.status(500).json({ message: 'Get data failed!' })
        return
    }  
  } else {
    res.status(500).json({ message: 'Wrong request method!' })
  }

}


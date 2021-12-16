import { MongoClient } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"
import { connectDatabase, insertDocument, getDocument } from '../../../../utils/database';

interface ResponseType {
  message: string;
}

interface SuccessResponseType {
  _id: string;
  name: string;
  email: string;
  cellphone: string;
  teacher: boolean;
  coins: number;
  courses: string[];
  available_hours: Record<string, number[]>;
  available_locations: string[];
  reviews: Record<string, unknown>[];
  appointments: { date: string }[];
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType | SuccessResponseType>
): Promise<void> => {

  if ( req.method === 'GET' ) {
    let client: MongoClient
    const {email} = req.query

    if (!email) {
      res.status(422).json({message: 'Missing e-mail on request body'})
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
          email
        })

        if (!response) {
          res.status(422).json({message: 'User with this email not found'})
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


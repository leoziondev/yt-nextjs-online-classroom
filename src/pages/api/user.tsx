import { MongoClient } from "mongodb"
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

  if (req.method === 'POST') {
    const { name, email, cellphone, teacher, courses, available_hours, available_locations } = req.body

    if (!teacher) {
      if (!name || !email ||!email.includes('@') || !cellphone) {
        res.status(422).json({ message: 'Invalid field parameters' })
        return
      }
    } else if (teacher) {
      if (!name || !email ||!email.includes('@') || !cellphone || !courses || !available_hours || !available_locations) {
        res.status(422).json({ message: 'Invalid field parameters' })
        return
      }
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
          teacher,
          coins: 1,
          courses: courses || [],
          available_hours: available_hours || {},
          available_locations: available_locations || [],
          reviews: [],
          appointments: []
        })

        client.close()
    } catch (error) {
        res.status(500).json({ message: 'Insert data failed!' })
        return
    }     
        
    // res.status(201).json({ message: 'Signed up success' })
    res.status(201).json({ message: 'Created success' })
  
  } else if ( req.method === 'GET' ) {
    let client: MongoClient
    const {email} = req.body

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


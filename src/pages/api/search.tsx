import { MongoClient } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"
import { connectDatabase, getCourses } from '../../../utils/database';

interface ResponseType {
  message: string;
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType | object[]>
): Promise<void> => {

  if ( req.method === 'GET' ) {
    let client: MongoClient
    const {courses} = req.body

    if (!courses) {
      res.status(422).json({message: 'Missing Course Name on request body'})
      return
    }
          
    try {
        client = await connectDatabase()
    } catch (error) {
        res.status(500).json({ message: 'Connecting to the database failed!' })
        return
    }

    try {
        const response = await getCourses(client, 'users', {
          courses: { $in: [new RegExp(`^${courses}`, 'i')] }
        })

        if (response.length === 0) {
          res.status(422).json({message: 'Courses not found'})
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


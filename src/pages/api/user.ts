import { MongoClient } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"
import { connectDatabase, insertDocument, getDocument } from '../../../utils/database';

interface ResponseType {
  message: string;
}

interface IAvailableHours {
  monday: number[];
  tuesday: number[];
  wednesday: number[];
  thursday: number[];
  friday: number[];
}

interface SuccessResponseType {
  _id: string;
  name: string;
  email: string;
  cellphone: string;
  teacher: boolean;
  coins: number;
  courses: string[];
  available_hours: IAvailableHours;
  available_locations: string[];
  reviews: Record<string, unknown>[];
  appointments: { date: string }[];
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType | SuccessResponseType>
): Promise<void> => {

  if (req.method === 'POST') {
    const {
      name,
      email,
      cellphone,
      teacher,
      courses,
      available_hours,
      available_locations 
    }: {
      name: string;
      email: string;
      cellphone: string;
      teacher: boolean;
      courses: string[];
      available_hours: IAvailableHours;
      available_locations: string[];
    } = req.body

    // Check if available hours is between 7:00 and 20:00    
    let invalidHour = false
    for(const dayOfTheWeek in available_hours) {
      available_hours[dayOfTheWeek].forEach((hour) => {
        if (hour < 7 && hour > 20 && hour !== "") {
          invalidHour = true
          return
        }
      })
    }

    if (invalidHour) {
      res.status(422).json({ message: 'You cannot teach between 20:00  and 7:00' })
      return
    }

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
        
    res.status(201).json({ message: 'Created success' })
  
  } else {
    res.status(500).json({ message: 'Wrong request method!' })
  }

}


import { MongoClient, ObjectId } from "mongodb"
import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import { connectDatabase, getDocument, insertAppointement } from '../../../utils/database';

interface ResponseType {
  message: string;
}

interface User {
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

interface SuccessResponseType {
    date: string;
    teacher_name: string;
    teacher_id: string;
    student_name: string;
    student_id: string;
    course: string;
    location: string;
    appointment_link: string;
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType | SuccessResponseType>
): Promise<void> => {

  if ( req.method === 'POST' ) {
    const session = await getSession({ req })

    if (!session) {
        res.status(422).json({message: 'Please login first'})
        return
    }

    let client: MongoClient
    const { 
      date,
      teacher_name,
      teacher_id,
      student_name,
      student_id,
      course,
      location,
      appointment_link 
    }: {
      date: string;
      teacher_name: string;
      teacher_id: string;
      student_name: string;
      student_id: string;
      course: string;
      location: string;
      appointment_link: string;
    } = req.body

    if (!date || !teacher_name || !teacher_id || !student_name || !student_id || !course || !location) {
      res.status(422).json({message: 'Missing Appointment parameter on request body'})
      return
    }
          
    try {
        client = await connectDatabase()
    } catch (error) {
        res.status(500).json({ message: 'Connecting to the database failed!' })
        return
    }

    try {
        const teacherExists = await getDocument(client, 'users', {
            _id: new ObjectId(teacher_id)
        })

        if (!teacherExists) {
          res.status(422).json({message: `Teacher ${teacher_name} with ID ${teacher_id} does not exist`})

          return
        }

        const studentExists = await getDocument(client, 'users', {
            _id: new ObjectId(student_id)
        })

        if (!studentExists) {
          res.status(422).json({message: `Student ${student_name} with ID ${student_id} does not exist`})

          return
        }

        const appointment = {
            date,
            teacher_name,
            teacher_id,
            student_name,
            student_id,
            course,
            location,
            appointment_link: appointment_link || ''
        }

        await insertAppointement(client, 'users', {
            _id: new ObjectId(teacher_id)
        },{
            $push: {appointments: appointment},
            $inc: {coins: 1}
        })

        await insertAppointement(client, 'users', {
            _id: new ObjectId(student_id)
        },{
            $push: {appointments: appointment},
            $inc: {coins: -1}
        })

        res.status(200).json(appointment)

        client.close()
    } catch (error) {
        res.status(500).json({ message: 'Post data failed!' })
        return
    }  
  } else {
    res.status(500).json({ message: 'Wrong request method!' })
  }

}


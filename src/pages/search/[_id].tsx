import axios from "axios"
import { GetServerSideProps, GetServerSidePropsContext } from "next"
import Layout from "../../components/Layout"

interface Teacher {
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

const SearchTeacherById = ({name, email, _id}: Teacher) => {

    return (
        <Layout>
            <h1>Resultado Teacher by id: {name}</h1>
            <p>Email: {email}</p>
            <p>ID: {_id}</p>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    const _id = context.query._id as string

    const response = await axios.get<Teacher>(`http://localhost:3000/api/teacher/${_id}`)
    const teacher = response.data

    return {
        props: teacher
    }
}

export default SearchTeacherById
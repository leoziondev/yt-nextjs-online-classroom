import { useCallback, useState } from 'react'
import api from '../../../utils/api'
import { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '../../components/Layout'

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

const SearchPage: NextPage = () => {
  const [textInput, setTextInput] = useState('')
  const [data, setData] = useState<Teacher[]>([])

  const handleSearch = useCallback(
    () => {
      api(`/api/search/${textInput}`)
        .then((response) => {
          const teachers: Teacher[] = response.data

          setData(teachers)
        })
    },  
    [textInput],
  )

  return (
    <Layout>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>      

      {/* <h1 className="text-5xl font-bold text-gray-800">Search Page</h1> */}
      <div className="text-center mt-4">
        {/* <form onSubmit={handleSearch}> */}
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className="py-1 px-3 w-1/2"  
          />
          <button            
            type="submit"
            onClick={handleSearch}
            className="bg-indigo-500 text-white py-1 px-3"
          >
            Buscar
          </button>
        {/* </form> */}

        {data.length !== 0 && ( 
          <div className='p-5 mt-8 text-left'>
            {data.map((teacher) => (
                <Link href={`/search/${teacher._id}`} key={teacher._id}>
                  <a><h2>{teacher.name}</h2></a>
                </Link>
            ))}
          </div>
        )}
        {console.log(data)}
      </div>
    </Layout>
  )
}

export default SearchPage
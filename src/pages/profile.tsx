import useSWR from 'swr'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'

import api from '../../utils/api'
import { NextPage } from 'next'
import Head from 'next/head'
import Layout from '../components/Layout'

const ProfilePage: NextPage = () => {
  const [loggedUserWithoutAccount, setLoggedUserWithoutAccount] = useState(false)
  const [isTeacher, setIsTeacher] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [cellphone, setCellphone] = useState("")
  const [courses, setCourses] = useState("")
  const [availableLocations, setAvailableLocations] = useState("")
  const [monday, setMonday] = useState("")
  const [tuesday, setTuesday] = useState("")
  const [wednesday, setWednesday] = useState("")
  const [thursday, setThursday] = useState("")
  const [friday, setFriday] = useState("")
  const [errorCount, setErrorCount] = useState(0)
  const {data: session, status} = useSession()

  const { data, error } = useSWR(
    !loggedUserWithoutAccount
      ? `/api/user/${session?.user.email}`
      : null,
    api
  );

  useEffect(() => {
    setErrorCount((prevstate) => prevstate + 1);
    if (error && errorCount === 1) setLoggedUserWithoutAccount(true);
  }, [error, setErrorCount]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const available_hours = {
      monday: monday
        ?.split(',')
        .map((item) => item.trim())
        .map((item) => parseInt(item)),
      tuesday: tuesday
        ?.split(',')
        .map((item) => item.trim())
        .map((item) => parseInt(item)),
      wednesday: wednesday
        ?.split(',')
        .map((item) => item.trim())
        .map((item) => parseInt(item)),
      thursday: thursday
        ?.split(',')
        .map((item) => item.trim())
        .map((item) => parseInt(item)),
      friday: friday
        ?.split(',')
        .map((item) => item.trim())
        .map((item) => parseInt(item)),
    };

    for (const dayOfTheWeek in available_hours) {
      if (!available_hours[dayOfTheWeek]) delete available_hours[dayOfTheWeek]
    }

    const data = {
      name,
      email,
      cellphone,
      teacher: isTeacher,
      courses: courses?.split(',').map((item) => item.trim()),
      available_locations: availableLocations
        ?.split(',')
        .map((item) => item.trim()),
      available_hours,
    };

    console.log(data)

    // try {
    //   await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/user`, data)
    //   setLoggedUserWithoutAccount(false)
    // } catch (err) {
    //   alert(
    //     err?.response?.data?.error || 'Houve um problema na criação da conta'
    //   )
    // }
  }

  return (
    <Layout>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>      

      <div className="container mx-auto"><h1 className="text-2xl font-bold text-gray-800">Profile Page</h1></div>
      {!session && (
        <p>Favor efetuar o login para acessar esta página!</p>
      )}
      {session && data && (
        <>
          <p>Bem vindo de volta {data.data.name}</p>
          <p>Você possui {data.data.coins} {data.data.coins === 1 ? 'moeda': 'moedas'}</p>
        </>
      )}
      {loggedUserWithoutAccount && session && (
        <div className="w-full md:w-1/2 mx-auto bg-white rounded-md p-5 mt-8">
          <h2 className="text-gray-700 font-bold text-xl">Seja bem vindo ao Teach Class!</h2>
          <p className="text-gray-500">Por favor finalize a criação de seu perfil</p>
          

          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="mb-4 mt-8">
              <input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-50 py-2 px-3 rounded-md w-full"
              />
            </div>
            <div className="mb-4">
              <input
                id="email"
                type="email"
                placeholder="Seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 py-2 px-3 rounded-md w-full"
              />
            </div>
            <div className="mb-4">
              <input
                id="cellphone"
                type="text"
                placeholder="Seu telefone"
                value={cellphone}
                onChange={(e) => setCellphone(e.target.value)}
                className="bg-gray-50 py-2 px-3 rounded-md w-full"
              />
            </div>
            <div className="mb-4">
              <div className="flex items-center w-full">
  
                <label 
                  htmlFor="teacher"
                  className="flex items-center cursor-pointer"
                >
                  <div className="relative">
                    <input
                      id="teacher"
                      name="teacher"
                      type="checkbox"                          
                      className="switch-input sr-only"
                      onClick={() => setIsTeacher(!isTeacher)}                          
                    />
                    {/* <!-- line --> */}
                    <div className="w-10 h-4 bg-gray-300 rounded-full shadow-inner"></div>
                    {/* <!-- dot --> */}
                    <div className="dot absolute w-6 h-6 bg-white rounded-full shadow-md -left-1 -top-1 transition"></div>
                  </div>
                  {/* <!-- label --> */}
                  <div className="ml-3 text-gray-700 font-medium">
                    {!isTeacher ? 'Perfil de Conta Aluno!' : 'Perfil de Conta Professor'}
                  </div>
                </label>              
              </div>
            </div>

            {isTeacher && (
              <>
                <div className="mb-4">
                  <input
                    id="courses"
                    name="courses"
                    type="text"
                    placeholder="Digite os cursos que você leciona"
                    value={courses}
                    onChange={(e) => setCourses(e.target.value)}
                    className="bg-gray-50 py-2 px-3 rounded-md w-full"
                  />
                  <small className="text-xs italic text-gray-400">Digite os cursos separados por virgula. Ex: Excel, Word</small>
                </div>
                <div className="mb-4">
                  <input
                    id="available_locations"
                    name="available_locations"
                    type="text"
                    placeholder="Digite os locais onde leciona"
                    value={availableLocations}
                    onChange={(e) => setAvailableLocations(e.target.value)}
                    className="bg-gray-50 py-2 px-3 rounded-md w-full"
                  />
                  <small className="text-xs italic text-gray-400">Digite os locais separados por virgula. Ex: Fac UNIABC, Metodista</small>
                </div> 
                <h3 className="text-lg font-bold text-gray-700 mb-4">Horarios da semana que você leciona</h3>
                <div className="mb-4">
                  <label htmlFor="monday" className="text-gray-500 text-xs font-semibold uppercase">Segunda</label>
                  <input                      
                    id="monday"
                    value={monday}
                    onChange={(e) => setMonday(e.target.value)}
                    type="text"
                    placeholder="Digite os horarios disponiveis para aula"
                    className="bg-gray-50 py-2 px-3 rounded-md w-full"
                  />
                  <small className="text-xs italic text-gray-400">Digite os horarios separados por virgula. Ex: 8, 10, 14, 16</small>
                </div>
                <div className="mb-4">
                  <label htmlFor="tuesday" className="text-gray-500 text-xs font-semibold uppercase">Terça</label>
                  <input
                    id="tuesday"
                    value={tuesday}
                    onChange={(e) => setTuesday(e.target.value)}
                    type="text"
                    placeholder="Digite os horarios disponiveis para aula"
                    className="bg-gray-50 py-2 px-3 rounded-md w-full"
                  />
                  <small className="text-xs italic text-gray-400">Digite os horarios separados por virgula. Ex: 8, 10, 14, 16</small>
                </div>
                <div className="mb-4">
                  <label htmlFor="wednesday" className="text-gray-500 text-xs font-semibold uppercase">Quarta</label>
                  <input
                    id="wednesday"
                    value={wednesday}
                    onChange={(e) => setWednesday(e.target.value)}
                    type="text"
                    placeholder="Digite os horarios disponiveis para aula"
                    className="bg-gray-50 py-2 px-3 rounded-md w-full"
                  />
                  <small className="text-xs italic text-gray-400">Digite os horarios separados por virgula. Ex: 8, 10, 14, 16</small>
                </div>
                <div className="mb-4">
                  <label htmlFor="thursday" className="text-gray-500 text-xs font-semibold uppercase">Quinta</label>
                  <input
                    id="thursday"
                    value={thursday}
                    onChange={(e) => setThursday(e.target.value)}
                    type="text"
                    placeholder="Digite os horarios disponiveis para aula"
                    className="bg-gray-50 py-2 px-3 rounded-md w-full"
                  />
                  <small className="text-xs italic text-gray-400">Digite os horarios separados por virgula. Ex: 8, 10, 14, 16</small>
                </div>
                <div className="mb-4">
                  <label htmlFor="friday" className="text-gray-500 text-xs font-semibold uppercase">Sexta</label>
                  <input
                    id="friday"
                    value={friday}
                    onChange={(e) => setFriday(e.target.value)}
                    type="text"
                    placeholder="Digite os horarios disponiveis para aula"
                    className="bg-gray-50 py-2 px-3 rounded-md w-full"
                  />
                  <small className="text-xs italic text-gray-400">Digite os horarios separados por virgula. Ex: 8, 10, 14, 16</small>
                </div>
              </>
            )}

            <div className="flex justify-end mt-12">
              <button
                type="submit"
                className="py-2 px-4 rounded-md bg-indigo-500 text-white text-sm tracking-wide font-semibold"
              >
                Criar perfil
              </button>
            </div>
          </form>
        </div>
      )}
    </Layout>
  )
}

export default ProfilePage
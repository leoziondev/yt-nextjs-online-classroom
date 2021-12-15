import useSWR from 'swr'
import { useSession } from 'next-auth/react'
import api from '../../utils/api'
import { NextPage } from 'next'
import Head from 'next/head'
import Layout from '../components/Layout'

const ProfilePage: NextPage = () => {
  const {data: session, status} = useSession()
  const { data, error } = useSWR(`/api/user/${session?.user.email}`, api)

  if (error) {
    console.log(error)
  }
  if (data) {
    console.log(data)
  }

  return (
    <Layout>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>      

      <h1 className="text-5xl font-bold text-gray-800">Profile Page</h1>
      {!session && (
        <p>Favor efetuar o login para acessar esta página!</p>
      )}
      {session && data && (
        <>
          <p>Bem vindo de volta {data.data.name}</p>
          <p>Você possui {data.data.coins} {data.data.coins === 1 ? 'moeda': 'moedas'}</p>
        </>
      )}
      {error && (
        <p>O usuário {session.user.email} não existe</p>
      )}
    </Layout>
  )
}

export default ProfilePage
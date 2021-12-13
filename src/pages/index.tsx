import { NextPage } from 'next'
import Head from 'next/head'
import Layout from '../components/Layout'

const HomePage: NextPage = () => {

  return (
    <Layout>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>      

      <h1 className="text-5xl font-bold text-gray-800">Home Page</h1>
    </Layout>
  )
}

export default HomePage

import { NextPage } from 'next'
import Head from 'next/head'
import Layout from '../components/Layout'

const SearchPage: NextPage = () => {

  return (
    <Layout>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>      

      <h1 className="text-5xl font-bold text-gray-800">Search Page</h1>
    </Layout>
  )
}

export default SearchPage
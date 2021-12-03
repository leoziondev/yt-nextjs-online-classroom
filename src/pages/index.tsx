import { NextPage } from 'next'
import Head from 'next/head'

const HomePage: NextPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-5xl font-bold text-gray-800">Next and Tailwind</h1>
    </div>
  )
}

export default HomePage

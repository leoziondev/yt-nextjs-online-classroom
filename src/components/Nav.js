import { useSession, signIn, signOut } from "next-auth/react"
import Link from 'next/link'

const Nav = () => {
    const { data: session, status } = useSession()

    return (
        <div className="bg-white h-12 flex items-center">
            <div className="flex justify-between container mx-auto px-2 sm:px-0">
                <span className="font-bold uppercase text-gray-700">Logo</span>
                <nav>
                    <ul className="flex space-x-4">
                        <li>
                            <Link href="/profile">
                                <a>Profile</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/search">
                                <a>Search</a>
                            </Link>
                        </li>
                        {!session && (
                            <li>                    
                                <button 
                                    onClick={() => signIn('auth0')}
                                    className="text-sm font-semibold text-indigo-500"
                                >
                                    Entrar
                                </button>
                            </li>
                        )}
                        {session && (
                            <li> 
                                <span className="mr-2 text-xs">{session.user.email}</span>
                                <button
                                    onClick={() => signOut()}
                                    className="text-sm font-semibold text-indigo-500"
                                >
                                    Sair
                                </button>
                            </li>
                        )}                        
                    </ul>
                    {status === "loading" && (
                        <div className="fixed left-0 top-0 z-10 w-full h-screen bg-white opacity-75 flex justify-center items-center">
                            <span className="text-indigo-500 font-bold text-2xl">Carregando...</span>
                        </div>
                    )}
                </nav>
            </div>
        </div>
    )
}

export default Nav
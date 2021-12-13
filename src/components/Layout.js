import Nav from './Nav'
import Footer from './Footer'

const Layout = ({ children }) => {
    return (
        <div className='bg-gray-50'>
            <Nav />
            <main className='min-h-screen p-5'>
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default Layout
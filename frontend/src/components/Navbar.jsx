import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="font-serif text-3xl font-bold text-primary tracking-tight hover:text-secondary transition-colors">
            Urban <span className="text-secondary">Bistro</span>
          </Link>
          
          <div className="flex gap-8 items-center">
            <Link to="/" className="text-sm font-medium tracking-wide uppercase text-gray-700 hover:text-secondary transition-colors">Home</Link>
            <Link to="/menu" className="text-sm font-medium tracking-wide uppercase text-gray-700 hover:text-secondary transition-colors">Menu</Link>
            <Link to="/booking" className="text-sm font-medium tracking-wide uppercase text-gray-700 hover:text-secondary transition-colors">Reservations</Link>
            
            {user ? (
              <>
                <Link to="/my-bookings" className="text-sm font-medium tracking-wide uppercase text-gray-700 hover:text-secondary transition-colors">My Bookings</Link>
                <button 
                  onClick={logout}
                  className="bg-primary text-white px-6 py-2.5 rounded-none text-sm font-semibold tracking-wider uppercase hover:bg-secondary transition-all duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium tracking-wide uppercase text-gray-700 hover:text-secondary transition-colors">Login</Link>
                <Link 
                  to="/register" 
                  className="bg-secondary text-primary px-6 py-2.5 rounded-none text-sm font-semibold tracking-wider uppercase hover:bg-opacity-90 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Reserve Now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

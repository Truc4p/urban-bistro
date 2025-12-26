import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold">Urban Bistro</Link>
          
          <div className="flex gap-6 items-center">
            <Link to="/" className="hover:text-secondary transition">Home</Link>
            <Link to="/menu" className="hover:text-secondary transition">Menu</Link>
            <Link to="/booking" className="hover:text-secondary transition">Book Table</Link>
            
            {user ? (
              <>
                <Link to="/my-bookings" className="hover:text-secondary transition">My Bookings</Link>
                <button 
                  onClick={logout}
                  className="bg-secondary px-4 py-2 rounded hover:bg-opacity-80 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-secondary transition">Login</Link>
                <Link 
                  to="/register" 
                  className="bg-secondary px-4 py-2 rounded hover:bg-opacity-80 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

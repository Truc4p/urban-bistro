import { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AuthContext } from '../context/AuthContext'
import { authAPI } from '../services/api'

export default function Login() {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await authAPI.login(formData)
      login(response.data.token, response.data.customer)
      toast.success('Login successful!')
      navigate('/booking')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1920&q=80" 
          alt="Restaurant ambiance" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="max-w-md w-full bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl p-8 relative z-10 border border-white/20">
        <div className="text-center mb-6">
          <div className="inline-block bg-cream border-2 border-secondary rounded-full p-4 mb-4">
            <svg className="w-12 h-12 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="font-serif text-4xl font-bold text-primary mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to continue your dining journey</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-secondary focus:outline-none transition-colors"
              placeholder="your@email.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-secondary focus:outline-none transition-colors"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary text-primary font-bold py-3 rounded-lg hover:bg-secondary/90 transition-all duration-300 disabled:bg-gray-400 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-700">
          Don't have an account? <Link to="/register" className="text-secondary font-semibold hover:underline">Create Account</Link>
        </p>
      </div>
    </div>
  )
}

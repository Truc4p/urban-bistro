import { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AuthContext } from '../context/AuthContext'
import { authAPI } from '../services/api'

export default function Register() {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const { confirmPassword, ...registerData } = formData
      const response = await authAPI.register(registerData)
      login(response.data.token, response.data.customer)
      toast.success('Registration successful!')
      navigate('/booking')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1920&q=80" 
          alt="Fine dining experience" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="max-w-md w-full bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl p-8 relative z-10 border border-white/20">
        <div className="text-center mb-6">
          <div className="inline-block bg-cream border-2 border-secondary rounded-full p-4 mb-4">
            <svg className="w-12 h-12 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="font-serif text-4xl font-bold text-primary mb-2">Join Us</h2>
          <p className="text-gray-600">Create your account to start booking</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">First Name</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-secondary focus:outline-none transition-colors"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Last Name</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-secondary focus:outline-none transition-colors"
                placeholder="Doe"
              />
            </div>
          </div>

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
            <label className="block text-sm font-semibold mb-2 text-gray-700">Phone Number</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-secondary focus:outline-none transition-colors"
              placeholder="+1 (555) 123-4567"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Password</label>
            <input
              type="password"
              required
              minLength="6"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-secondary focus:outline-none transition-colors"
              placeholder="Min. 6 characters"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Confirm Password</label>
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-secondary focus:outline-none transition-colors"
              placeholder="Re-enter password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary text-primary font-bold py-3 rounded-lg hover:bg-secondary/90 transition-all duration-300 disabled:bg-gray-400 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-700">
          Already have an account? <Link to="/login" className="text-secondary font-semibold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  )
}

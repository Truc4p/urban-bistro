import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Urban Bistro</h1>
          <p className="text-xl mb-8">Experience fine dining with exquisite cuisine</p>
          <Link 
            to="/booking" 
            className="bg-white text-primary px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition inline-block"
          >
            Book a Table
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🍽️</div>
            <h3 className="text-xl font-bold mb-2">Gourmet Menu</h3>
            <p className="text-gray-600">Curated dishes from world-class chefs</p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">Instant Booking</h3>
            <p className="text-gray-600">Real-time availability and instant confirmations</p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🌟</div>
            <h3 className="text-xl font-bold mb-2">Premium Experience</h3>
            <p className="text-gray-600">Elegant ambiance and exceptional service</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Dine?</h2>
          <p className="text-gray-600 mb-8">Browse our menu and reserve your table today</p>
          <div className="flex gap-4 justify-center">
            <Link to="/menu" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition">
              View Menu
            </Link>
            <Link to="/booking" className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition">
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

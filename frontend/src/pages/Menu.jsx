import { useState, useEffect } from 'react'
import { menuAPI } from '../services/api'
import { toast } from 'react-toastify'

export default function Menu() {
  const [items, setItems] = useState([])
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)

  const categories = [
    { id: 'appetizer', name: 'Appetizers', icon: '🥗' },
    { id: 'main', name: 'Main Course', icon: '🍽️' },
    { id: 'dessert', name: 'Desserts', icon: '🍰' },
    { id: 'beverage', name: 'Beverages', icon: '🍷' },
    { id: 'special', name: 'Chef\'s Special', icon: '⭐' }
  ]

  useEffect(() => {
    fetchMenu()
  }, [category])

  const fetchMenu = async () => {
    try {
      setLoading(true)
      const response = await menuAPI.getAllItems(category)
      setItems(response.data)
    } catch (error) {
      toast.error('Failed to load menu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-gradient-dark text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">Our Menu</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover our exquisite collection of culinary masterpieces
          </p>
          <div className="w-24 h-1 bg-secondary mx-auto mt-6"></div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Category Filter */}
        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          <button
            onClick={() => setCategory('')}
            className={`px-6 py-3 rounded-none font-medium tracking-wide uppercase text-sm transition-all duration-300 ${
              !category 
                ? 'bg-secondary text-primary shadow-lg scale-105' 
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
            }`}
          >
            All Items
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-6 py-3 rounded-none font-medium tracking-wide uppercase text-sm transition-all duration-300 ${
                category === cat.id 
                  ? 'bg-secondary text-primary shadow-lg scale-105' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
              }`}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading our finest selections...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No items found in this category</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map(item => (
              <div 
                key={item.id} 
                className="card-elegant group cursor-pointer"
              >
                {item.imageUrl && (
                  <div className="relative overflow-hidden h-56">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-secondary text-primary px-3 py-1 text-sm font-bold rounded-full shadow-lg">
                        ${Number(item.price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <div className="mb-3">
                    <h3 className="font-serif text-2xl font-bold text-primary mb-1 group-hover:text-secondary transition-colors">
                      {item.name}
                    </h3>
                    {!item.imageUrl && (
                      <span className="text-secondary font-bold text-xl">${Number(item.price).toFixed(2)}</span>
                    )}
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex gap-2 flex-wrap items-center">
                    <span className="inline-block text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full font-medium uppercase tracking-wide">
                      {item.category}
                    </span>
                    {item.allergens?.length > 0 && (
                      <span className="inline-block text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-full font-medium">
                        ⚠️ {item.allergens.join(', ')}
                      </span>
                    )}
                    {!item.isAvailable && (
                      <span className="inline-block text-xs bg-gray-200 text-gray-500 px-3 py-1.5 rounded-full font-medium">
                        Currently Unavailable
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

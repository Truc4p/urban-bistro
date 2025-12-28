import { useState, useEffect } from 'react'
import { menuAPI } from '../services/api'
import { toast } from 'react-toastify'

export default function Menu() {
  const [items, setItems] = useState([])
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)

  const categories = [
    { id: 'appetizer', name: 'Appetizers', icon: '🥗', description: 'Start your journey' },
    { id: 'main', name: 'Main Course', icon: '🍽️', description: 'The centerpiece' },
    { id: 'dessert', name: 'Desserts', icon: '🍰', description: 'Sweet endings' },
    { id: 'beverage', name: 'Beverages', icon: '🍷', description: 'Perfect pairings' },
    { id: 'special', name: 'Chef\'s Special', icon: '⭐', description: 'Curated selections' }
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
      {/* Hero Header */}
      <div className="relative bg-gradient-dark text-white py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-block border border-secondary/30 px-4 py-1.5 rounded-full mb-6">
            <p className="text-secondary text-sm font-medium tracking-widest uppercase">Culinary Excellence</p>
          </div>
          <h1 className="font-serif text-6xl md:text-7xl font-bold mb-6">Our Menu</h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            Discover our exquisite collection of culinary masterpieces,<br className="hidden md:block"/>crafted with passion and the finest ingredients
          </p>
          <div className="w-24 h-1 bg-secondary mx-auto mt-8"></div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {/* Category Filter */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="section-title">Browse By Category</h2>
            <div className="w-24 h-1 bg-secondary mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
            <button
              onClick={() => setCategory('')}
              className={`group relative overflow-hidden transition-all duration-300 ${
                !category 
                  ? 'bg-white border-2 border-secondary shadow-xl scale-105' 
                  : 'bg-white hover:bg-gray-50 shadow-md hover:shadow-lg border border-gray-200'
              }`}
            >
              <div className="p-6 text-center">
                <div className={`text-4xl mb-3 transition-transform duration-300 group-hover:scale-110`}>🍴</div>
                <h3 className={`font-semibold text-sm uppercase tracking-wide mb-1 ${
                  !category ? 'text-primary' : 'text-gray-800'
                }`}>All Items</h3>
                <p className={`text-xs ${
                  !category ? 'text-secondary' : 'text-gray-500'
                }`}>Everything</p>
              </div>
              {!category && <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary"></div>}
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`group relative overflow-hidden transition-all duration-300 ${
                  category === cat.id 
                    ? 'bg-white border-2 border-secondary shadow-xl scale-105' 
                    : 'bg-white hover:bg-gray-50 shadow-md hover:shadow-lg border border-gray-200'
                }`}
              >
                <div className="p-6 text-center">
                  <div className="text-4xl mb-3 transition-transform duration-300 group-hover:scale-110">{cat.icon}</div>
                  <h3 className={`font-semibold text-sm uppercase tracking-wide mb-1 ${
                    category === cat.id ? 'text-primary' : 'text-gray-800'
                  }`}>{cat.name}</h3>
                  <p className={`text-xs ${
                    category === cat.id ? 'text-secondary' : 'text-gray-500'
                  }`}>{cat.description}</p>
                </div>
                {category === cat.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary"></div>}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-6 text-gray-600 font-medium text-lg">Loading our finest selections...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-6">
              <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="font-serif text-2xl font-bold text-primary mb-2">No Items Found</h3>
            <p className="text-gray-500 text-lg">Try selecting a different category</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-10">
              <p className="text-gray-600">
                <span className="font-semibold text-secondary text-lg">{items.length}</span> {items.length === 1 ? 'dish' : 'dishes'} {category ? `in ${categories.find(c => c.id === category)?.name}` : 'available'}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map(item => (
                <div 
                  key={item.id} 
                  className="card-elegant group cursor-pointer hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                >
                  {!item.isAvailable && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-gray-800/90 text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider shadow-lg">
                        Sold Out
                      </span>
                    </div>
                  )}
                  {item.imageUrl && (
                    <div className="relative overflow-hidden h-64">
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 ${!item.isAvailable ? 'opacity-50' : ''}`}></div>
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${!item.isAvailable ? 'grayscale' : ''}`}
                      />
                      <div className="absolute bottom-4 left-4 right-4 z-20">
                        <div className="flex items-end justify-between">
                          <div className="text-white">
                            <h3 className="font-serif text-2xl font-bold mb-1 drop-shadow-lg">
                              {item.name}
                            </h3>
                          </div>
                          <div className="bg-secondary text-primary px-4 py-2 font-bold text-lg shadow-xl">
                            ${Number(item.price).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    {!item.imageUrl && (
                      <div className="mb-4 flex items-start justify-between">
                        <h3 className="font-serif text-2xl font-bold text-primary group-hover:text-secondary transition-colors">
                          {item.name}
                        </h3>
                        <span className="text-secondary font-bold text-xl ml-4">${Number(item.price).toFixed(2)}</span>
                      </div>
                    )}
                    <p className="text-gray-600 leading-relaxed mb-5 min-h-[3rem]">
                      {item.description}
                    </p>
                    <div className="flex gap-2 flex-wrap items-center">
                      <span className="inline-flex items-center gap-1.5 text-xs bg-white text-primary border-2 border-secondary px-3 py-1.5 font-semibold uppercase tracking-wider">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                        {item.category}
                      </span>
                      {item.allergens?.length > 0 && (
                        <span className="inline-flex items-center gap-1.5 text-xs bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 font-medium">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {item.allergens.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { menuAPI } from '../services/api'
import { toast } from 'react-toastify'

export default function Menu() {
  const [items, setItems] = useState([])
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)

  const categories = ['appetizer', 'main', 'dessert', 'beverage', 'special']

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Our Menu</h1>

      {/* Category Filter */}
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        <button
          onClick={() => setCategory('')}
          className={`px-4 py-2 rounded ${!category ? 'bg-primary text-white' : 'bg-gray-200'}`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded capitalize ${category === cat ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      {loading ? (
        <div className="text-center py-12">Loading menu...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover" />
              )}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{item.name}</h3>
                  <span className="text-primary font-bold">${item.price}</span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded capitalize">{item.category}</span>
                  {item.allergens?.length > 0 && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                      Allergens: {item.allergens.join(', ')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

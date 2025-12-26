import { useState, useEffect, useContext } from 'react'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import { AuthContext } from '../context/AuthContext'
import { bookingAPI } from '../services/api'

export default function MyBookings() {
  const { user } = useContext(AuthContext)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchBookings()
    }
  }, [user])

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getCustomerBookings(user.id)
      setBookings(response.data)
    } catch (error) {
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return

    try {
      await bookingAPI.cancelBooking(id)
      toast.success('Booking cancelled')
      fetchBookings()
    } catch (error) {
      toast.error('Failed to cancel booking')
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
      'no-show': 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100'
  }

  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600 mb-4">No bookings yet</p>
          <a href="/booking" className="text-primary hover:underline">Make your first reservation</a>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookings.map(booking => (
            <div key={booking.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    {format(new Date(booking.bookingDate), 'MMMM dd, yyyy')}
                  </h3>
                  <div className="space-y-1 text-gray-600">
                    <p>⏰ {booking.startTime.substring(0, 5)} - {booking.endTime.substring(0, 5)}</p>
                    <p>👥 {booking.guests} guests</p>
                    <p>🪑 {booking.table.name} ({booking.table.location})</p>
                    {booking.specialRequests && (
                      <p className="text-sm mt-2">📝 {booking.specialRequests}</p>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                  {booking.status === 'confirmed' && new Date(booking.bookingDate) > new Date() && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="mt-4 text-red-600 hover:text-red-800 text-sm"
                    >
                      Cancel Booking
                    </button>
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

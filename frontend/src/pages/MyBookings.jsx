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
      pending: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
      confirmed: 'bg-green-50 text-green-700 border border-green-200',
      cancelled: 'bg-red-50 text-red-700 border border-red-200',
      completed: 'bg-blue-50 text-blue-700 border border-blue-200',
      'no-show': 'bg-gray-50 text-gray-700 border border-gray-200'
    }
    return colors[status] || 'bg-gray-50 border border-gray-200'
  }

  if (loading) return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading your reservations...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-gradient-dark text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">My Reservations</h1>
          <p className="text-xl text-gray-300">View and manage your upcoming dining experiences</p>
          <div className="w-24 h-1 bg-secondary mx-auto mt-6"></div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {bookings.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-16 bg-white shadow-lg">
            <div className="mb-6">
              <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-serif text-2xl font-bold text-primary mb-3">No Reservations Yet</h3>
            <p className="text-gray-600 mb-8">Start your culinary journey with us</p>
            <a href="/booking" className="btn-primary inline-block">Make a Reservation</a>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {bookings.map(booking => (
              <div key={booking.id} className="card-elegant group">
                <div className="p-8">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 bg-cream border-2 border-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-serif text-2xl font-bold text-primary mb-1">
                            {format(new Date(booking.bookingDate), 'EEEE, MMMM dd, yyyy')}
                          </h3>
                          <p className="text-gray-500 text-sm">Booking ID: {booking.id.substring(0, 8)}</p>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-3 text-gray-700">
                          <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium">{booking.startTime.substring(0, 5)} - {booking.endTime.substring(0, 5)}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                          <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span className="font-medium">{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                          <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span className="font-medium">{booking.table.name}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                          <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="font-medium">{booking.table.location}</span>
                        </div>
                      </div>
                      
                      {booking.specialRequests && (
                        <div className="bg-cream p-4 rounded border-l-4 border-secondary">
                          <p className="text-sm text-gray-700"><span className="font-semibold">Special Requests:</span> {booking.specialRequests}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end gap-4">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      {booking.status === 'confirmed' && new Date(booking.bookingDate) > new Date() && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          className="px-6 py-2.5 border-2 border-red-200 text-red-600 rounded-none font-semibold text-sm uppercase tracking-wide hover:bg-red-50 hover:border-red-300 transition-all duration-300"
                        >
                          Cancel Reservation
                        </button>
                      )}
                    </div>
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

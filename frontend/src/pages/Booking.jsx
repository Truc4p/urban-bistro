import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { format, addDays } from 'date-fns'
import { toast } from 'react-toastify'
import { AuthContext } from '../context/AuthContext'
import { bookingAPI } from '../services/api'
import socketService from '../services/socket'

export default function Booking() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [guests, setGuests] = useState(2)
  const [availability, setAvailability] = useState([])
  const [selectedTable, setSelectedTable] = useState(null)
  const [selectedTime, setSelectedTime] = useState('')
  const [specialRequests, setSpecialRequests] = useState('')
  const [loading, setLoading] = useState(false)

  const timeSlots = ['11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', 
                     '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00']

  useEffect(() => {
    if (!user) {
      toast.error('Please login to make a booking')
      navigate('/login')
    }
  }, [user, navigate])

  useEffect(() => {
    fetchAvailability()
    const socket = socketService.connect()
    
    socketService.onNewBooking((data) => {
      if (data.date === format(selectedDate, 'yyyy-MM-dd')) {
        fetchAvailability()
      }
    })

    socketService.onBookingCancelled((data) => {
      if (data.date === format(selectedDate, 'yyyy-MM-dd')) {
        fetchAvailability()
      }
    })

    return () => socketService.disconnect()
  }, [selectedDate, guests])

  const fetchAvailability = async () => {
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd')
      const response = await bookingAPI.getAvailability(dateStr, guests)
      setAvailability(response.data)
    } catch (error) {
      toast.error('Failed to fetch availability')
    }
  }

  const isTimeSlotAvailable = (table, time) => {
    return !table.bookedSlots.some(slot => {
      const slotStart = slot.startTime.substring(0, 5)
      const slotEnd = slot.endTime.substring(0, 5)
      return time >= slotStart && time < slotEnd
    })
  }

  const handleBooking = async () => {
    if (!selectedTable || !selectedTime) {
      toast.error('Please select a table and time')
      return
    }

    setLoading(true)
    try {
      const endTime = format(
        new Date(`2000-01-01 ${selectedTime}`).getTime() + 90 * 60 * 1000,
        'HH:mm'
      )

      await bookingAPI.createBooking({
        customerId: user.id,
        tableId: selectedTable.tableId,
        bookingDate: format(selectedDate, 'yyyy-MM-dd'),
        startTime: selectedTime,
        endTime,
        guests,
        specialRequests
      })

      toast.success('Booking confirmed! Check your email for details.')
      navigate('/my-bookings')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Booking failed')
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
            <p className="text-secondary text-sm font-medium tracking-widest uppercase">Reserve Your Experience</p>
          </div>
          <h1 className="font-serif text-6xl md:text-7xl font-bold mb-6">Book a Table</h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            Secure your seat at the finest dining destination<br className="hidden md:block"/>in the city
          </p>
          <div className="w-24 h-1 bg-secondary mx-auto mt-8"></div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left: Date and Guests Selection */}
          <div className="space-y-6">
            {/* Date Picker Card */}
            <div className="card-elegant overflow-hidden">
              <div className="bg-white p-6 border-b border-gray-200 border-l-4 border-l-secondary">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-cream rounded-lg flex items-center justify-center border-2 border-secondary">
                    <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-primary">Select Date</h2>
                    <p className="text-sm text-primary/70">Choose your dining date</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="booking-calendar">
                  <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    minDate={new Date()}
                    maxDate={addDays(new Date(), 60)}
                    className="w-full border-0 shadow-none"
                  />
                </div>
                <div className="mt-4 p-4 bg-cream border-l-4 border-secondary">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Selected:</span> {format(selectedDate, 'EEEE, MMMM dd, yyyy')}
                  </p>
                </div>
              </div>
            </div>

            {/* Guest Selector Card */}
            <div className="card-elegant">
              <div className="bg-gradient-gold p-6 border-b-2 border-secondary">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-primary">Party Size</h2>
                    <p className="text-sm text-primary/70">Number of guests</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="w-12 h-12 bg-gray-200 hover:bg-secondary hover:text-primary transition-all duration-300 flex items-center justify-center font-bold text-xl"
                  >
                    −
                  </button>
                  <div className="flex-1 text-center">
                    <div className="text-5xl font-bold text-primary mb-1">{guests}</div>
                    <div className="text-sm text-gray-600 uppercase tracking-wide">{guests === 1 ? 'Guest' : 'Guests'}</div>
                  </div>
                  <button
                    onClick={() => setGuests(Math.min(20, guests + 1))}
                    className="w-12 h-12 bg-gray-200 hover:bg-secondary hover:text-primary transition-all duration-300 flex items-center justify-center font-bold text-xl"
                  >
                    +
                  </button>
                </div>
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {[2, 4, 6, 8].map(num => (
                    <button
                      key={num}
                      onClick={() => setGuests(num)}
                      className={`py-2 text-sm font-semibold transition-all duration-300 ${
                        guests === num
                          ? 'bg-secondary text-primary shadow-lg'
                          : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Available Tables and Times */}
          <div className="space-y-6">
            <div className="card-elegant">
              <div className="bg-gradient-gold p-6 border-b-2 border-secondary">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-primary">Available Tables</h2>
                    <p className="text-sm text-primary/70">{format(selectedDate, 'MMM dd, yyyy')}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 max-h-[600px] overflow-y-auto">
                {availability.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mb-4">
                      <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <p className="text-gray-500">Loading availability...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {availability.map(table => (
                      <div key={table.tableId} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-cream flex items-center justify-center border-2 border-gray-300">
                              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-serif text-xl font-bold text-primary">{table.tableName}</h3>
                              <p className="text-sm text-gray-600">
                                <span className="font-semibold">{table.capacity} seats</span> · {table.location}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {timeSlots.map(time => {
                            const available = isTimeSlotAvailable(table, time)
                            const isSelected = selectedTable?.tableId === table.tableId && selectedTime === time
                            
                            return (
                              <button
                                key={time}
                                disabled={!available}
                                onClick={() => {
                                  setSelectedTable(table)
                                  setSelectedTime(time)
                                }}
                                className={`px-3 py-2.5 text-sm font-semibold transition-all duration-300 ${
                                  isSelected
                                    ? 'bg-secondary text-primary shadow-lg scale-105 z-10'
                                    : available
                                    ? 'bg-white text-gray-700 hover:bg-green-50 hover:border-green-300 border border-gray-200 hover:shadow-md'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                                }`}
                              >
                                {time}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Booking Confirmation Section */}
            {selectedTable && selectedTime && (
              <div className="card-elegant border-2 border-secondary">
                <div className="bg-white p-6 border-b border-gray-200 border-l-4 border-l-secondary">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-cream rounded-lg flex items-center justify-center border-2 border-secondary">
                      <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-primary">Confirm Reservation</h2>
                      <p className="text-sm text-primary/70">Review your booking details</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="bg-cream p-4 border-l-4 border-secondary space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Date</span>
                      <span className="font-semibold text-primary">{format(selectedDate, 'MMMM dd, yyyy')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Time</span>
                      <span className="font-semibold text-primary">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Guests</span>
                      <span className="font-semibold text-primary">{guests} {guests === 1 ? 'person' : 'people'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Table</span>
                      <span className="font-semibold text-primary">{selectedTable.tableName} ({selectedTable.location})</span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-800 mb-2">Special Requests (Optional)</label>
                    <textarea
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="w-full border-2 border-gray-200 focus:border-secondary focus:outline-none px-4 py-3 transition-colors duration-300"
                      rows="3"
                      placeholder="Dietary restrictions, celebrations, accessibility needs..."
                    />
                  </div>
                  
                  <button
                    onClick={handleBooking}
                    disabled={loading}
                    className="w-full btn-primary bg-secondary text-primary py-4 text-lg font-bold uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Confirm Reservation
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

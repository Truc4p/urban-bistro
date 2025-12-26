import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Calendar from 'react-calendar'
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Book a Table</h1>

      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Left: Date and Guests */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4">Select Date</h2>
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              minDate={new Date()}
              maxDate={addDays(new Date(), 60)}
              className="w-full"
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Number of Guests</h2>
            <input
              type="number"
              min="1"
              max="20"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              className="w-full border rounded px-4 py-2"
            />
          </div>
        </div>

        {/* Right: Available Tables and Times */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">
            Available for {format(selectedDate, 'MMM dd, yyyy')}
          </h2>

          {availability.map(table => (
            <div key={table.tableId} className="mb-6 border-b pb-4">
              <h3 className="font-bold mb-2">
                {table.tableName} - {table.capacity} seats ({table.location})
              </h3>
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
                      className={`px-3 py-2 rounded text-sm ${
                        isSelected
                          ? 'bg-primary text-white'
                          : available
                          ? 'bg-green-100 hover:bg-green-200'
                          : 'bg-gray-200 cursor-not-allowed'
                      }`}
                    >
                      {time}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          {selectedTable && selectedTime && (
            <div className="mt-6">
              <label className="block font-bold mb-2">Special Requests</label>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full border rounded px-4 py-2"
                rows="3"
                placeholder="Dietary restrictions, celebrations, etc."
              />
              
              <button
                onClick={handleBooking}
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-lg mt-4 hover:bg-opacity-90 transition disabled:bg-gray-400"
              >
                {loading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

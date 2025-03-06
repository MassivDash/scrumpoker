import React, { useState } from 'react'
import { axiosBackendInstance } from '../../axiosInstance/axiosBackendInstance'

interface Room {
  id: string
  name: string
}

const ListRooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleListRooms = async () => {
    try {
      const response = await axiosBackendInstance.get('/list_rooms')
      if (response.status === 200) {
        setRooms(response.data)
        setError(null)
      } else {
        setError('Failed to fetch rooms.')
      }
    } catch (error) {
      console.error('Error fetching rooms:', error)
      setError('Failed to fetch rooms.')
    }
  }

  return (
    <div>
      <button onClick={handleListRooms}>List Rooms</button>
      {error && <p>{error}</p>}
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            {room.name} (ID: {room.id})
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ListRooms

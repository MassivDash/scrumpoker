import React from 'react'
import { Link } from 'react-router-dom'

export interface Room {
  id: string
  name: string
}

interface RoomProps {
  rooms: Room[]
}

const ListRooms: React.FC<RoomProps> = ({ rooms }) => {
  return (
    <div>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            <Link to={`/room/${room.id}`}>
              {' '}
              {room.name} (ID: {room.id})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ListRooms

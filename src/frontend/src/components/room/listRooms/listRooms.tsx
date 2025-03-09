import React from 'react'
import { Link } from 'react-router-dom'
import CreateRoomForm from '../createRoomForm/createRoomForm'
import { useUsername } from '../../usernameContext/usernameContext'

export interface Room {
  id: string
  name: string
}

interface RoomProps {
  rooms: Room[]
}

const ListRooms: React.FC<RoomProps> = ({ rooms }) => {
  const { username } = useUsername()
  return (
    <div>
      <CreateRoomForm roomOnly />
      <h2>Welcome, {username}!</h2>
      <h3>Rooms:</h3>
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

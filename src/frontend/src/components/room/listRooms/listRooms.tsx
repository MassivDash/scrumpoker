import React from 'react'
import { Link } from 'react-router-dom'
import CreateRoomForm from '../createRoomForm/createRoomForm'
import { useUsername } from '../../usernameContext/usernameContext'
import './listRooms.css'
import Hero from '../../hero/hero'

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
    <div className='list-rooms-container'>
      {' '}
      <Hero />
      <h2>Welcome, {username}!</h2>
      <h3>Rooms:</h3>
      <div className='rooms-list'>
        {rooms.map((room) => (
          <Link to={`/room/${room.id}`} key={room.id} className='room-card'>
            <div className='room-card-content'>
              <h4>{room.name}</h4>
              <p>ID: {room.id}</p>
            </div>
          </Link>
        ))}
      </div>
      <CreateRoomForm roomOnly />
    </div>
  )
}

export default ListRooms

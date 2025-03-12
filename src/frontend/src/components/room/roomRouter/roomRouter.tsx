import React, { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation
} from 'react-router-dom'
import { axiosBackendInstance } from '../../../axiosInstance/axiosBackendInstance'
import CreateRoomForm from '../createRoomForm/createRoomForm'
import ListRooms from '../listRooms/listRooms'
import Room from '../room/room'
import {
  UsernameProvider,
  useUsername
} from '../../usernameContext/usernameContext'
import Hero from '../../hero/hero'
import './roomRouter.css'

interface ListResponse {
  username: string
  rooms: { id: string; name: string }[]
}

const CreateWithHero = () => {
  return (
    <div className='list-rooms-container'>
      <Hero />
      <CreateRoomForm />
    </div>
  )
}

const RoomRouter: React.FC<{ ws_url: string }> = ({ ws_url }) => {
  const [rooms, setRooms] = useState<ListResponse['rooms']>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const { setUsername, username } = useUsername()

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axiosBackendInstance.get('/list_rooms')
        if (
          response.status === 200 &&
          response.data.rooms.length > 0 &&
          response.data.username
        ) {
          setRooms(response.data.rooms)
          setUsername(response.data.username)
          //if location is /room/:id, redirect to room/:id
          if (location.pathname.includes('/room/')) {
            const roomId = location.pathname.split('/').pop()
            setLoading(false)
            navigate(`/room/${roomId}`)
            return
          }
          setLoading(false)
          navigate('/rooms')
        }

        if (response.status === 200 && response.data.username) {
          setUsername(response.data.username)
          setLoading(false)
          navigate('/rooms')
        }
      } catch (error) {
        if (location.pathname.includes('/room/')) {
          alert(
            'No session found, before joining other rooms you need to create a room and username'
          )
        }
        setLoading(false)
        navigate('/create-room')
      }
    }

    fetchRooms()
  }, [])

  if (loading) {
    return <div className='loading'>Loading...</div>
  }

  return (
    <Routes>
      {username && (
        <Route path='/room/:id' element={<Room ws_url={ws_url} />} />
      )}
      {username && (
        <Route path='/rooms' element={<ListRooms rooms={rooms} />} />
      )}
      <Route path='/create-room' element={<CreateWithHero />} />
      <Route path='/' element={<CreateWithHero />} />
    </Routes>
  )
}

const RouterApp = ({ ws_url }) => {
  return (
    <React.StrictMode>
      <UsernameProvider>
        <Router>
          <RoomRouter ws_url={ws_url} />
        </Router>
      </UsernameProvider>
    </React.StrictMode>
  )
}

export default RouterApp

import React, { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate
} from 'react-router-dom'
import { axiosBackendInstance } from '../../../axiosInstance/axiosBackendInstance'
import CreateRoomForm from '../createRoomForm/createRoomForm'
import ListRooms from '../listRooms/listRooms'
import type { Room as R } from '../listRooms/listRooms'
import Room from '../room/room'

const RoomRouter: React.FC = () => {
  const [rooms, setRooms] = useState<R[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axiosBackendInstance.get('/list_rooms')
        if (response.status === 200 && response.data.length > 0) {
          console.log(response)
          setRooms(response.data)
          navigate('/rooms')
        } else {
          navigate('/create-room')
        }
      } catch (error) {
        console.error('Error fetching rooms:', error)
        navigate('/create-room')
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Routes>
      <Route path='/room/:id' element={<Room />} />
      <Route path='/rooms' element={<ListRooms rooms={rooms} />} />
      <Route path='/create-room' element={<CreateRoomForm />} />
    </Routes>
  )
}

const RouterApp = () => {
  return (
    <React.StrictMode>
      <Router>
        <RoomRouter />
      </Router>
    </React.StrictMode>
  )
}

export default RouterApp

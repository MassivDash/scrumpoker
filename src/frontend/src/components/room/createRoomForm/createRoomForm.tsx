import React, { useState } from 'react'
import { axiosBackendInstance } from '../../../axiosInstance/axiosBackendInstance'
import { useNavigate } from 'react-router-dom'
import Hero from '../../hero/hero'
import './createRoomForm.css'

interface CreateRoomFormProps {
  roomOnly?: boolean
}

const CreateRoomForm: React.FC<CreateRoomFormProps> = ({
  roomOnly = false
}) => {
  const [username, setUsername] = useState('')
  const [roomname, setRoomname] = useState('')

  const navigate = useNavigate()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    let response = null
    try {
      if (!roomOnly) {
        response = await axiosBackendInstance.post('/create_room', {
          user_name: username,
          room_name: roomname
        })
      } else {
        response = await axiosBackendInstance.post('/create_room_session', {
          room_name: roomname
        })
      }

      if (response.status === 200) {
        alert('Room created successfully!')
        // Redirect to the room page or handle success
        navigate(`/room/${response.data.room_id}`)
      } else {
        alert('Failed to create room.')
        // Handle error
      }
    } catch (error) {
      console.error('Error creating room:', error)
      alert('Failed to create room.')
      // Handle error
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        {!roomOnly && (
          <>
            <label htmlFor='username'>Username:</label>
            <input
              type='text'
              id='username'
              name='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <br />
          </>
        )}
        <label htmlFor='roomname'>Room Name:</label>
        <input
          type='text'
          id='roomname'
          name='roomname'
          value={roomname}
          onChange={(e) => setRoomname(e.target.value)}
          required
        />
        <br />
        <button type='submit'>Create Room</button>
      </form>
    </>
  )
}

export default CreateRoomForm

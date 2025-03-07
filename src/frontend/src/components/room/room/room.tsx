import React, { useEffect, useState } from 'react'
import { axiosBackendInstance } from '../../../axiosInstance/axiosBackendInstance'
import { useLocation } from 'react-router-dom'

const Room = () => {
  const [room, setRoom] = useState(null)
  const [ws, setWs] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const location = useLocation()

  const roomId = location.pathname.split('/').pop()

  useEffect(() => {
    // Fetch room details
    axiosBackendInstance
      .get(`/get_room/${roomId}`)
      .then((response) => {
        setRoom(response.data)
        // Establish WebSocket connection after room details are fetched
        const socket = new WebSocket(`ws://localhost:8080/ws/${roomId}`)
        setWs(socket)

        socket.onopen = () => {
          console.log('WebSocket connected')
        }

        socket.onmessage = (event) => {
          const message = JSON.parse(event.data)
          console.log(message)
          handleWsMessage(message)
        }

        socket.onclose = () => {
          console.log('WebSocket disconnected')
        }

        return () => {
          socket.close()
        }
      })
      .catch((error) => {
        console.error('Error fetching room details:', error)
      })
  }, [roomId])

  const handleWsMessage = (message) => {
    switch (message.type_) {
      case 'AddQuestion':
        setRoom(() => message.data)
        break
      case 'AddAnswer':
        setRoom((prevRoom) => {
          const updatedEstimations = prevRoom.estimations.map((estimation) => {
            if (estimation[message.question]) {
              return {
                ...estimation,
                [message.question]: {
                  ...estimation[message.question],
                  answers: [
                    ...estimation[message.question].answers,
                    { answer: message.answer, username: message.username }
                  ]
                }
              }
            }
            return estimation
          })
          return { ...prevRoom, estimations: updatedEstimations }
        })
        break
      default:
        console.error('Unknown message type:', message.type)
    }
  }

  const sendMessage = (event) => {
    event.preventDefault()
    if (ws && input.trim()) {
      const message = JSON.stringify({
        type: 'AddQuestion',
        question: input
      })
      ws.send(message)
      setInput('')
    }
  }

  return (
    <div>
      <h1>Room: {room ? room.name : 'Loading...'}</h1>
      {room && (
        <div>
          <h2>Estimations</h2>
          <ul>
            {room.estimations.map((estimation, index) => (
              <li key={index}>
                {Object.keys(estimation)[0]}:{' '}
                {estimation[Object.keys(estimation)[0]].question}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <h2>Messages</h2>
        <div id='log'>
          {messages.map((msg, index) => (
            <p key={index} className='msg msg--message'>
              {msg}
            </p>
          ))}
        </div>
        <form onSubmit={sendMessage}>
          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoComplete='off'
          />
          <button type='submit'>Send</button>
        </form>
      </div>
    </div>
  )
}

export default Room

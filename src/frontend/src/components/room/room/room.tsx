import React, { useEffect, useState } from 'react'
import { axiosBackendInstance } from '../../../axiosInstance/axiosBackendInstance'
import { useLocation, useNavigate } from 'react-router-dom'
import Deck from '../../deck/deck'
import ScrumPokerTable from '../table/table'
import Userbar from './userbar/userbar'
import './room.css'
import { useUsername } from '../../usernameContext/usernameContext'
import Estimations from './estimations/estimations'

export interface Answer {
  username: string
  answer: string
}

export interface Estimation {
  question: string
  revealed: boolean
  answers: Array<Answer>
}
export interface Room {
  id: string
  name: string
  owner: string
  estimations: Array<Estimation>
  current_estimation: number
  users: string[]
}

const Room = () => {
  const [room, setRoom] = useState<Room | null>(null)
  const [ws, setWs] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { username } = useUsername()

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
        navigate('/rooms')
        console.error('Error fetching room details:', error)
      })
  }, [roomId, username])

  const handleWsMessage = (message) => {
    try {
      setRoom(() => message.data)
    } catch (error) {
      console.error('Error handling websocket message:', error)
    }
  }

  const handleAddQuestion = (input) => {
    const message = JSON.stringify({
      type: 'AddQuestion',
      question: input
    })
    ws.send(message)
  }

  const handleRemoveQuestion = (index) => {
    const message = JSON.stringify({
      type: 'RemoveQuestion',
      estimation: index
    })
    ws.send(message)
  }

  const handleAddAnswer = (answer: string) => {
    if (ws) {
      const message = JSON.stringify({
        type: 'AddAnswer',
        answer: answer,
        estimation: room.current_estimation,
        username: username
      })
      ws.send(message)
    }
  }

  const onSetCurrentEstimation = (index: number) => {
    if (ws) {
      const message = JSON.stringify({
        type: 'SetCurrentEstimation',
        estimation: index
      })
      ws.send(message)
    }
  }

  const onRevealEstimations = (index: number) => {
    if (ws) {
      const message = JSON.stringify({
        type: 'RevealEstimations',
        estimation: index
      })
      ws.send(message)
    }
  }
  const current_user_is_owner = room ? room.owner === username : false
  const current_estimation = room ? room.current_estimation : 0
  const current_question =
    room && room.estimations.length > 0
      ? room.estimations[current_estimation].question
      : ''
  const current_vote =
    room &&
    room.estimations.length > 0 &&
    room.estimations[current_estimation].answers.find(
      (answer) => answer.username === username
    )

  return (
    <div className='room_wrapper'>
      <Userbar
        roomName={room ? room.name : ''}
        users={room ? room.users : []}
      />
      {room && current_user_is_owner && (
        <Estimations
          estimations={room.estimations}
          onRevealEstimations={onRevealEstimations}
          onSetCurrentEstimation={onSetCurrentEstimation}
          onAddQuestion={handleAddQuestion}
          removeQuestion={handleRemoveQuestion}
        />
      )}
      <ScrumPokerTable
        question={current_question}
        users={room ? room.users : []}
        user={username}
        estimations={room ? room.estimations : []}
      />
      <Deck
        onCardClick={(answer) => handleAddAnswer(answer)}
        presentedCard={current_vote?.answer}
      />
    </div>
  )
}

export default Room

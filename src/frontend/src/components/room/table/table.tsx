import React from 'react'
import './table.css'
import UserIcon from '../../userIcon/userIcon'
import Card from '../../card/card'
import type { Estimation } from '../room/room'

interface ScrumPokerTableProps {
  users: string[]
  user: string
  question: string
  estimations: Array<Estimation>
}

const ScrumPokerTable: React.FC<ScrumPokerTableProps> = ({
  users,
  user,
  question,
  estimations
}) => {
  const currentEstimation = estimations.find((est) => est.question === question)

  return (
    <>
      <div className='question-holder'>
        <div className='userbar__hint-name'>question:</div>
        <h1 className='table-question'>{question}</h1>
      </div>
      <div className='table-container'>
        <div className='table'>
          {users.map((u) => {
            const userAnswer = currentEstimation?.answers.find(
              (answer) => answer.username === u
            )
            const cardValue =
              u === user || currentEstimation?.revealed
                ? userAnswer?.answer || '?'
                : '?'

            return (
              <div
                key={u}
                className={`user ${u === user ? 'current-user' : ''}`}
              >
                <UserIcon username={u} />
                {userAnswer && (
                  <div className='user-card'>
                    <Card
                      suit='heart'
                      value={cardValue}
                      symbols={parseInt(cardValue)}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default ScrumPokerTable

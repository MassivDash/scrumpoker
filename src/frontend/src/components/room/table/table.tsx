import React from 'react'
import './table.css'

interface ScrumPokerTableProps {
  users: string[]
  user: string
  question: string
}

const ScrumPokerTable: React.FC<ScrumPokerTableProps> = ({
  users,
  user,
  question
}) => {
  const totalUsers = users.length
  const angleStep = 360 / totalUsers

  return (
    <div className='table-container'>
      <div className='question'>{question}</div>
      <div className='table'>
        {users.map((u, index) => {
          const angle = angleStep * index
          const style = {
            transform: `rotate(${angle}deg) translate(150px) rotate(-${angle}deg)`
          }
          return (
            <div
              key={u}
              className={`user ${u === user ? 'current-user' : ''}`}
              style={style}
            >
              {u}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ScrumPokerTable

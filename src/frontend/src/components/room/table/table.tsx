import React from 'react'
import './table.css'

interface ScrumPokerTableProps {
  users: string[]
  user: string
}

const ScrumPokerTable: React.FC<ScrumPokerTableProps> = ({ users, user }) => {
  const totalUsers = users.length
  const angleStep = 360 / totalUsers

  return (
    <div className='table-container'>
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

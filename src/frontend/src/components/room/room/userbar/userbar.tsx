import React from 'react'
import UserIcon from '../../../userIcon/userIcon'
import './userbar.css'

interface UserbarProps {
  roomName: string
  users: string[]
}

const Userbar: React.FC<UserbarProps> = ({ roomName, users }) => {
  return (
    <div className='userbar'>
      <div className='userbar__hint-name'>room name:</div>
      <div className='userbar__room-name'>{roomName}</div>
      <div className='userbar__users'>
        {users.map((user) => (
          <UserIcon key={user} username={user} />
        ))}
      </div>
    </div>
  )
}

export default Userbar

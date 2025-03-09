import React from 'react'
import './userIcon.css'

interface UserIconProps {
  username: string
}

const UserIcon: React.FC<UserIconProps> = ({ username }) => {
  const initials = username.slice(0, 2).toUpperCase()

  return (
    <div className='user-icon'>
      <div className='user-icon__circle'>{initials}</div>
      <div className='user-icon__tooltip'>{username}</div>
    </div>
  )
}

export default UserIcon

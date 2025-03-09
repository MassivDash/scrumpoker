import React, { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface UsernameContextProps {
  username: string
  setUsername: (username: string) => void
}

const UsernameContext = createContext<UsernameContextProps | undefined>(
  undefined
)

export const UsernameProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [username, setUsername] = useState<string>('')

  return (
    <UsernameContext.Provider value={{ username, setUsername }}>
      {children}
    </UsernameContext.Provider>
  )
}

export const useUsername = (): UsernameContextProps => {
  const context = useContext(UsernameContext)
  if (!context) {
    throw new Error('useUsername must be used within a UsernameProvider')
  }
  return context
}

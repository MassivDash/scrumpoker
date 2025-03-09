import React from 'react'
import Card from '../card/card'
import './deck.css'

interface DeckProps {
  onCardClick: (value: string) => void
  presentedCard: string
}

const Deck: React.FC<DeckProps> = ({ onCardClick, presentedCard }) => {
  const suits = ['spade'] as const
  const values = [
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '20',
    '40',
    '100'
  ] as const

  return (
    <div className='deck_wrapper'>
      <div className='deck'>
        {suits.map((suit) =>
          values.map((value) => (
            <Card
              key={`${suit}-${value}`}
              suit={suit}
              value={value}
              symbols={parseInt(value)}
              onClick={() => onCardClick(value)}
              selected={presentedCard === value}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default Deck

import React from 'react'
import Card from '../card/card'
import './deck.css'

interface DeckProps {
  onCardClick: (value: string) => void
}

const Deck: React.FC<DeckProps> = ({ onCardClick }) => {
  const suits = ['spade'] as const
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10']

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
            />
          ))
        )}
      </div>
    </div>
  )
}

export default Deck

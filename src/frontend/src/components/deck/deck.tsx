import React, { useState } from 'react'
import Card from '../card/card'
import './deck.css'

interface DeckProps {
  onCardClick: (value: string) => void
  presentedCard: string
}

const Deck: React.FC<DeckProps> = ({ onCardClick, presentedCard }) => {
  const suits = ['spade'] as const
  const [deck, setDeck] = useState<'normal' | 'fibonacci'>('normal');

  const normalDeck = [
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
  ]

  const fibonacciDeck = [
    '0',
    '1',
    '2',
    '3',
    '5',
    '8',
    '13',
    '21',
    '34',
    '55',
    '89',
    '144',
  ]

  const values = deck === 'normal' ? normalDeck : fibonacciDeck;

  return (
    <>
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
      <div className="deck-changer">
        <button className='deck-changer-button' onClick={() => setDeck(deck === 'normal' ? 'fibonacci' : 'normal')}>change deck for {deck === 'normal' ? 'fibonacci' : 'normal'}</button>
      </div>
    </>
  )
}

export default Deck

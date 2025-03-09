import React from 'react'
import './card.css'

interface CardProps {
  suit: 'heart' | 'spade'
  value: string
  symbols: number
  onClick?: () => void
  selected?: boolean
}

const Card: React.FC<CardProps> = ({
  suit,
  value,
  symbols,
  onClick,
  selected
}) => {
  const renderSymbols = (count: number) => {
    const symbolElements = []
    for (let i = 0; i < count; i++) {
      symbolElements.push(<div key={i} className='card__symbol'></div>)
    }
    return symbolElements
  }

  return (
    <section
      className={`card card--${suit} ${selected ? 'card--selected' : ''}`}
      value={value}
      onClick={onClick}
      style={{ zIndex: value }}
    >
      <div
        className={`card__inner ${symbols === 2 || symbols === 3 ? 'card__inner--centered' : ''}`}
      >
        {symbols <= 3 && (
          <div className='card__column'>{renderSymbols(symbols)}</div>
        )}
        {symbols === 4 && (
          <>
            <div className='card__column'>{renderSymbols(2)}</div>
            <div className='card__column'>{renderSymbols(2)}</div>
          </>
        )}
        {symbols === 5 && (
          <>
            <div className='card__column'>{renderSymbols(2)}</div>
            <div className='card__column card__column--centered'>
              {renderSymbols(1)}
            </div>
            <div className='card__column'>{renderSymbols(2)}</div>
          </>
        )}
        {symbols === 6 && (
          <>
            <div className='card__column'>{renderSymbols(3)}</div>
            <div className='card__column'>{renderSymbols(3)}</div>
          </>
        )}
        {symbols === 7 && (
          <>
            <div className='card__column'>{renderSymbols(3)}</div>
            <div className='card__column card__column--centered'>
              <div className='card__symbol card__symbol--huge'></div>
            </div>
            <div className='card__column'>{renderSymbols(3)}</div>
          </>
        )}
        {symbols === 8 && (
          <>
            <div className='card__column'>{renderSymbols(3)}</div>
            <div className='card__column card__column--centered'>
              <div className='card__symbol card__symbol--big'></div>
              <div className='card__symbol card__symbol--big'></div>
            </div>
            <div className='card__column'>{renderSymbols(3)}</div>
          </>
        )}
        {symbols === 9 && (
          <>
            <div className='card__column'>
              {renderSymbols(2)}
              <div className='card__symbol card__symbol--rotated'></div>
              {renderSymbols(1)}
            </div>
            <div className='card__column card__column--centered'>
              <div className='card__symbol'></div>
            </div>
            <div className='card__column'>
              {renderSymbols(1)}
              <div className='card__symbol card__symbol--rotated'></div>
              {renderSymbols(2)}
            </div>
          </>
        )}
        {symbols === 10 && (
          <>
            <div className='card__column'>
              {renderSymbols(2)}
              <div className='card__symbol card__symbol--rotated'></div>
              {renderSymbols(1)}
            </div>
            <div className='card__column card__column--centered'>
              <div className='card__symbol card__symbol--big'></div>
              <div className='card__symbol card__symbol--big'></div>
            </div>
            <div className='card__column'>
              {renderSymbols(1)}
              <div className='card__symbol card__symbol--rotated'></div>
              {renderSymbols(2)}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default Card

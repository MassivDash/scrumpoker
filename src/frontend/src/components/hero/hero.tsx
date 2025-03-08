import React from 'react'
import Card from '../card/card'
import './hero.css'

const Hero: React.FC = () => {
  return (
    <div className='hero'>
      <div className='hero__cards'>
        <Card suit='heart' value='P' symbols={3} />
        <Card suit='spade' value='S' symbols={7} />
      </div>
      <div className='hero__banner'>
        <p className='ribbon'>Scrum Poker</p>
      </div>
    </div>
  )
}

export default Hero

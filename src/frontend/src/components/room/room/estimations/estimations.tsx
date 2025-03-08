import React, { useState } from 'react'
import type { Estimation } from '../room'
import './estimations.css'

interface EstimationsProps {
  estimations: Array<Estimation>
  onSetCurrentEstimation: (index: number) => void
  onRevealEstimations: (index: number) => void
  onAddQuestion: (question: string) => void
}

const Estimations: React.FC<EstimationsProps> = ({
  estimations,
  onSetCurrentEstimation,
  onRevealEstimations,
  onAddQuestion
}) => {
  const [input, setInput] = useState('')

  const handleAddQuestion = (event: React.FormEvent) => {
    event.preventDefault()
    if (input.trim()) {
      onAddQuestion(input)
      setInput('')
    }
  }

  return (
    <div className='estimations-menu'>
      <ul className='estimations-list'>
        {estimations.map((estimation, index) => (
          <li key={index}>
            <button
              className='question'
              onClick={() => onSetCurrentEstimation(index)}
            >
              {estimation.question}
            </button>
            {!estimation.revealed && (
              <button
                className='reveal-button'
                onClick={() => onRevealEstimations(index)}
              >
                Reveal Cards
              </button>
            )}
          </li>
        ))}
      </ul>
      <form className='add-question-form' onSubmit={handleAddQuestion}>
        <input
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Add a question'
          autoComplete='off'
        />
        <button type='submit'>Add</button>
      </form>
    </div>
  )
}

export default Estimations

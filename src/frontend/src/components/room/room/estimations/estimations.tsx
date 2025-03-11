import React, { useState } from 'react'
import type { Estimation } from '../room'
import './estimations.css'
import DeleteIcon from './svg/delete'
import FlipIcon from './svg/flip'
import ExcelBar from './excelBar/excelBar'

interface EstimationsProps {
  currentEstimation: number
  estimations: Array<Estimation>
  onSetCurrentEstimation: (index: number) => void
  onRevealEstimations: (index: number) => void
  onAddQuestion: (question: string) => void
  removeQuestion: (index: number) => void
}

const trimStringToLength = (str: string, length: number) => {
  if (str.length <= length) {
    return str
  }
  return str.slice(0, length) + '...'
}

const Estimations: React.FC<EstimationsProps> = ({
  currentEstimation = 0,
  estimations,
  onSetCurrentEstimation,
  onRevealEstimations,
  onAddQuestion,
  removeQuestion
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
      <div className='estimation-header'>
        <p className='userbar__hint-name estimation-title'>questions</p>
        <ExcelBar estimations={estimations} onAddQuestion={onAddQuestion} />
      </div>

      <ul className='estimations-list'>
        {estimations.map((estimation, index) => (
          <li
            key={index}
            className={index === currentEstimation ? 'current-estimation' : ''}
          >
            <div
              className={`circle ${index === currentEstimation ? 'circle-current' : ''}`}
            >
              {index + 1}
            </div>
            <button
              className='question'
              onClick={() => onSetCurrentEstimation(index)}
            >
              {trimStringToLength(estimation.question, 18)}
            </button>
            {!estimation.revealed && (
              <button
                className='estimation-menu-button'
                onClick={() => onRevealEstimations(index)}
              >
                <FlipIcon />
                <div className='tooltip'>Flip cards</div>
              </button>
            )}
            <button
              className='estimation-menu-button'
              onClick={() => removeQuestion(index)}
            >
              <DeleteIcon />
              <div className='tooltip'>Delete</div>
            </button>
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

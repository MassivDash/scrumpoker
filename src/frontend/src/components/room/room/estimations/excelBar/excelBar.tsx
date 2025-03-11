import React, { useState } from 'react'
import ImportIcon from '../svg/import'
import DownloadIcon from '../svg/download'
import DropzonePopup from './dropzonePopup'
import * as XLSX from 'xlsx'
import type { Estimation } from '../../room'

interface ExcelBarProps {
  estimations: Array<Estimation>
  onAddQuestion: (question: string) => void
}

const ExcelBar: React.FC<ExcelBarProps> = ({ estimations, onAddQuestion }) => {
  const [showPopup, setShowPopup] = useState(false)

  const handleExportToExcel = () => {
    const data = estimations.map((estimation) => {
      const row: { [key: string]: string } = { Question: estimation.question }
      estimation.answers.forEach((answer) => {
        row[answer.username] = answer.answer
      })
      return row
    })

    const headers = [
      'Question',
      ...estimations[0].answers.map((answer) => answer.username)
    ]
    const worksheet = XLSX.utils.json_to_sheet(data, { header: headers })
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Estimations')
    XLSX.writeFile(workbook, 'estimations.xlsx')
  }

  const handleImportClick = () => {
    setShowPopup(true)
  }

  const handleClosePopup = () => {
    setShowPopup(false)
  }

  return (
    <div className='excel-bar'>
      <button
        className='estimation-menu-button'
        onClick={() => handleExportToExcel()}
      >
        <DownloadIcon />
        <div className='tooltip'>Export to excel</div>
      </button>
      <button
        className='estimation-menu-button'
        onClick={() => handleImportClick()}
      >
        <ImportIcon />
        <div className='tooltip'>Import from excel</div>
      </button>
      {showPopup && (
        <DropzonePopup
          onClose={handleClosePopup}
          onAddQuestion={onAddQuestion}
        />
      )}
    </div>
  )
}

export default ExcelBar

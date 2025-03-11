import React, { useRef, useState } from 'react'
import * as XLSX from 'xlsx'
import DownloadIcon from '../svg/download'

interface DropzonePopupProps {
  onClose: () => void
  onAddQuestion: (question: string) => void
}

const DropzonePopup: React.FC<DropzonePopupProps> = ({
  onClose,
  onAddQuestion
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json<{ Question: string }>(
          worksheet
        )
        jsonData.forEach((row) => {
          if (row.Question) {
            onAddQuestion(row.Question)
          }
        })
      }
      reader.readAsArrayBuffer(file)
      onClose()
    }
  }

  const handleDropzoneClick = () => {
    fileInputRef.current?.click()
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = () => {
    setDragging(false)
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setDragging(false)
    const file = event.dataTransfer.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json<{ Question: string }>(
          worksheet
        )
        jsonData.forEach((row) => {
          if (row.Question) {
            onAddQuestion(row.Question)
          }
        })
      }
      reader.readAsArrayBuffer(file)
      onClose()
    }
  }

  const createExampleExcel = () => {
    const data = [
      { Question: 'Example Question 1' },
      { Question: 'Example Question 2' },
      { Question: 'Example Question 3' }
    ]
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Example')
    XLSX.writeFile(workbook, 'example.xlsx')
  }

  return (
    <div className='dropzone-popup'>
      <div className='popup-content'>
        <button className='close-button' onClick={onClose}>
          &times;
        </button>
        <div
          className={`dropzone ${dragging ? 'dragging' : ''}`}
          onClick={handleDropzoneClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <p>Click to select an Excel file or drag and drop here</p>
          <input
            type='file'
            accept='.xlsx, .xls'
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
        </div>
        <button
          className='estimation-menu-button'
          onClick={() => createExampleExcel()}
        >
          <DownloadIcon />
          <div className='tooltip'>Download example file</div>
        </button>
      </div>
    </div>
  )
}

export default DropzonePopup

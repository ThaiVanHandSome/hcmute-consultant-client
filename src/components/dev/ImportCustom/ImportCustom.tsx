/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { X, Check, Cloud } from 'lucide-react'
import * as XLSX from 'xlsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import importConfig from '@/components/dev/ImportCustom/importConfig'

interface ImportConfig {
  role: { name: string; required: boolean }[]
  user: { name: string; required: boolean }[]
}

export default function ImportCustom() {
  const [file, setFile] = useState<{ file: File; progress: number; isUploading: boolean } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [tableData, setTableData] = useState<any[]>([])
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false)
  const [errorLog, setErrorLog] = useState<string | null>(null)
  const [importType] = useState<keyof ImportConfig>('role')

  const inputFileRef = useRef<HTMLInputElement | null>(null)

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      if (
        droppedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        droppedFile.type === 'application/vnd.ms-excel'
      ) {
        setFile({ file: droppedFile, progress: 0, isUploading: true })
        e.dataTransfer.clearData()
        readFile(droppedFile)
      } else {
        alert('Only Excel files are allowed.')
      }
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleClickInputFile = () => {
    if (!inputFileRef.current) return
    inputFileRef.current.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      if (
        selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        selectedFile.type === 'application/vnd.ms-excel'
      ) {
        setFile({ file: selectedFile, progress: 0, isUploading: true })
        readFile(selectedFile)
      } else {
        alert('Only Excel files are allowed.')
        e.target.value = '' // Reset input file
      }
    }
  }

  const readFile = (file: File) => {
    const reader = new FileReader()
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100
        setFile((prevFile) => (prevFile && prevFile.file === file ? { ...prevFile, progress } : prevFile))
      }
    }
    reader.onloadend = () => {
      setFile((prevFile) => (prevFile && prevFile.file === file ? { ...prevFile, isUploading: false } : prevFile))
    }
    reader.onerror = () => {
      console.error('Error reading file')
    }
    reader.readAsArrayBuffer(file)
  }

  const handleCancelUpload = () => {
    setFile(null)
  }

  const handleUpload = () => {
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        setTableData(jsonData)
        setIsTableDialogOpen(true)
      }
      reader.readAsArrayBuffer(file.file)
    }
  }

  const handleImport = () => {
    const config = importConfig[importType]
    const headers = tableData[0]

    const missingRequiredColumns = config.filter((col: any) => col.required && !headers.includes(col.name))
    if (missingRequiredColumns.length > 0) {
      const errorMessage = `Missing required columns: ${missingRequiredColumns.map((col: any) => col.name).join(', ')}`
      console.error(errorMessage)
      setErrorLog(errorMessage)
    } else {
      console.log('Import successful')
      alert('Import successful')
      setErrorLog(null)
    }
  }

  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Button size='sm'>Import</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>Import</DialogHeader>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed p-5 text-center cursor-pointer transition-colors ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
            } rounded-lg shadow-md`}
          >
            <Cloud size={48} className='mx-auto text-gray-400' />
            <p className='mb-4 text-lg font-bold text-gray-700'>Choose a file or drag & drop it here</p>
            <p className='mb-4 text-sm text-red-500'>Only Excel files are allowed</p>
            <Button onClick={handleClickInputFile} className='bg-blue-500 text-white hover:bg-blue-600'>
              Browse file
              <input
                ref={inputFileRef}
                type='file'
                className='hidden'
                onChange={handleFileChange}
                accept='.xlsx,.xls'
              />
            </Button>
          </div>
          {file && (
            <div className='mt-8'>
              <h3 className='text-lg font-semibold text-gray-700'>File:</h3>
              <ul className='mt-4 space-y-4'>
                <li className='flex flex-col p-4 bg-gray-50 rounded-lg shadow-sm'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-gray-800'>
                      {file.file.name} ({(file.file.size / 1024).toFixed(2)} KB)
                    </span>
                    {file.isUploading && (
                      <button className='text-red-500 ml-2 hover:text-red-700' onClick={handleCancelUpload}>
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  {file.isUploading && (
                    <div className='mt-2'>
                      <Progress value={file.progress} className='w-full' />
                      <p className='text-sm mt-1 text-gray-600'>Uploading to browser: {file.progress.toFixed(2)}%</p>
                    </div>
                  )}
                  {!file.isUploading && (
                    <span className='text-green-500 mt-2 flex items-center'>
                      <Check size={16} className='mr-1' /> Uploaded
                    </span>
                  )}
                </li>
              </ul>
            </div>
          )}
          <Button onClick={handleUpload} className='mt-4 bg-green-500 text-white hover:bg-green-600'>
            Upload
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={isTableDialogOpen} onOpenChange={setIsTableDialogOpen}>
        <DialogContent className='max-w-[1200px] max-h-[80vh] overflow-auto'>
          <DialogHeader>Excel Data</DialogHeader>
          <div className='overflow-x-auto'>
            <Table className='min-w-full divide-y divide-gray-200'>
              <TableHeader className='bg-gray-50'>
                <TableRow>
                  {tableData[0]?.map((header: string, index: number) => (
                    <TableHead
                      key={index}
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                    >
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className='bg-white divide-y divide-gray-200'>
                {tableData.slice(1).map((row, rowIndex) => (
                  <TableRow key={rowIndex} className='hover:bg-gray-50'>
                    {row.map((cell: any, cellIndex: number) => (
                      <TableCell key={cellIndex} className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {cell}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Button onClick={handleImport} className='mt-4 bg-blue-500 text-white hover:bg-blue-600'>
            Import
          </Button>
          {errorLog && (
            <div className='mt-4 p-4 bg-red-100 text-red-700 rounded-lg'>
              <p className='font-bold'>Error:</p>
              <p>{errorLog}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

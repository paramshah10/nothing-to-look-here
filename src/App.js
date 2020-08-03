import React, { useState, useCallback } from 'react';
import './App.css';
import axios from 'axios'
import {useDropzone} from 'react-dropzone'
import {CSVLink} from 'react-csv'

function App() {
  const [incorrectFileType, setIncorrectFileType] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [convertedFile, setConvertedFile] = useState('')

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles[0].type !== 'application/vnd.ms-excel') {
      setIncorrectFileType(true)
    }
    else {
      setSelectedFile(acceptedFiles[0])
      setIncorrectFileType(false)
    }
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  const onSubmitClicked = () => {
    if (selectedFile && !incorrectFileType) {
      const data = new FormData()
      data.append('file', selectedFile)
      // console.log(selectedFile)
      axios.post('https://param-csv-converter.herokuapp.com/upload', data, {})
      .then((response) => {
        // console.log(response)
        setConvertedFile(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        {
          incorrectFileType ? 
            <label> Incorrect File type submitted </label> 
            : 
            <> </>
        }
        <label style={{marginBottom: '30px'}}>Upload your file</label>
        <div {...getRootProps()} style={{backgroundColor: '#a1a1a1'}}>
          <input {...getInputProps()}/>
          {
            isDragActive ?
              <p style={{color: '#000000'}}>Drop the files here ...</p> :
              <p style={{color: '#000000'}}>Drag 'n' drop some files here, or click to select files</p>
          }
        </div>
        <button style={{marginTop: '20px'}} type="button" name="submit" onClick={onSubmitClicked}>Submit</button>
        
        {
          convertedFile !== '' && 
          <CSVLink data={convertedFile} filename={selectedFile.name} >
            Download Me
          </CSVLink>
        }
      </header>
    </div>
  );
}

export default App;

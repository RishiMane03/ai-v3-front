import React, { useEffect, useState, useContext } from 'react';
import './Pdf.css';
import axios from 'axios';
import NavBar from '../NavBar/NavBar';
import { useNavigate } from 'react-router-dom';
import { pdfjs } from 'react-pdf';
import toast from 'react-hot-toast';
// import VariableContext from '../../Content/VariableContext';

// modal
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CircularProgress from '@mui/material/CircularProgress';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60%',
  height: '23rem',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '1rem'
};


pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

function Pdf() {  
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [showButtons, setShowButtons] = useState(false);
  const [askDoubt, setAskDoubt] = useState(false);
  const [pdfSummary, setPdfSummary] = useState('');
  const [pdfQuestions, setPdfQuestions] = useState('');
//   const { userInfo } = useContext(VariableContext);
  const [pdfContent, setPdfContent] = useState('');
  const [selectedPdf, setSelectedPdf] = useState(null); 

  // modal
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  // doubt
  const [isEnterPress, setIsEnterPress] = useState(false);
  const [question, setQuestion] = useState('')
  const [questionValue, setQuestionValue] = useState('')
  const [answer, setAnswer] = useState('');
  const navigate = useNavigate()
  const BackendURL = process.env.REACT_APP_BACKEND_URL

  useEffect(() => {
      if (selectedPdf) {
        fetchPdfContent(selectedPdf);
        console.log(selectedPdf);
      }
  }, [selectedPdf]);

  useEffect(() => {
    if (file) {
        fetchPdfContent(file);
    }
  }, [file]);


  // check Token is present
  function getCookie(cookieName) {
    // Split the cookie string into individual cookies
    let cookies = document.cookie.split(';');
  
    // Iterate through the cookies to find the one with the specified name
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      // Check if this cookie starts with the name we're looking for
      if (cookie.indexOf(cookieName + '=') === 0) {
        // If found, return the value of the cookie
        return cookie.substring(cookieName.length + 1);
      }
    }
    // If cookie not found, return null
    return null;
  }

  async function fetchPdfContent(pdfFile) {
    let content = '';
    const reader = new FileReader();

    reader.onload = async (event) => {
        const fileData = new Uint8Array(event.target.result);
        const pdfDoc = await pdfjs.getDocument({ data: fileData }).promise;

        for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        content += textContent.items.map(item => item.str).join(' ') + '\n';
        }
        setPdfContent(content);
        console.log('pdfContent > ',pdfContent);
  };

  reader.readAsArrayBuffer(pdfFile);
  }

  async function getShortSummary(){
    toast.success('Wait for few seconds')
      if(pdfContent && selectedPdf){
          try {
              const response = await axios.post(`https://ai-v3-back.onrender.com/pdfSummary`, { pdfContent });
              console.log('response > ',response);
              setPdfSummary(response.data.summary);
              toast.success('Here we go!')
            } catch (error) {
              console.error('Error:', error);
              if(error.response.data.sessionExpired){
                navigate('/login')
                return  toast.error("Session Exipred Please Login")
              }
          }
      }
  }

  async function getQuestions(){
    toast.success(`Wait for few seconds`)
    setPdfQuestions('')
      if(pdfContent && selectedPdf){
          try {
              const response = await axios.post(`https://ai-v3-back.onrender.com/pdfQuestions`, { pdfContent });
              
              console.log('response > ',response);
              setPdfQuestions(response.data.allQuestions);
              toast.success('Lets train your brain together!')
            } catch (error) {
              console.error('Error:', error);
              if(error.response.data.sessionExpired){
                navigate('/login')
                return  toast.error("Session Exipred Please Login")
              }
          }
      }
  }

  async function getDoubtSolved(){
    setAskDoubt(true)
    setOpen(true)
  }

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
    setDragging(false);
    setShowButtons(true);
  };

  const handleFileInputChange = (e) => {
    // console.log('im inside handleFileInputChange');
    const selectedFile = e.target.files[0];
    // console.log('file > ', e.target.files[0])
      if (selectedFile.type !== 'application/pdf') {
        toast.success('Please upload only PDF file');
        return;
      }
      setFile(selectedFile);
      setSelectedPdf(selectedFile);
      setShowButtons(true);
  };

  const handleEnter = async (e) => {
    if (e.key === 'Enter') {
      setAnswer('')
      setQuestionValue(question)
      setIsEnterPress(true);
      console.log(question);
      // Make an API call to get the answer
      if(question){
        try {
          const response = await axios.post(`https://ai-v3-back.onrender.com/askDoubt`, { pdfContent , question });
          
          console.log(response.data.ansToDoubt.content);
          setAnswer(response.data.ansToDoubt.content);
          toast.success(`Your wish is my command`)
        } catch (error) {
          console.error('Error:', error);
          if(error.response.data.sessionExpired){
            navigate('/login')
            return  toast.error("Session Exipred Please Login")
          }
        }
      }else{
        toast.error('Enter Question')
      }
    }
  };

  return (
    <div className="pdfSum">
      <NavBar/>

      <div className='aiHeading'>
        <h1>Ai-PDF</h1>
        <p>Introducing the ultimate PDF sidekick. Upload your PDF, and voilà! You've got three buttons at your service. No more PDF panic—just fun, fast, and fabulous solutions at your fingertips!</p>
        
        <div className='uploadSection'>
          <h2
            className="upload-header"
            onClick={() => document.getElementById('fileInput').click()}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {showButtons ? `${file.name} ` : <div> <i class="fa-solid fa-upload fa-bounce fa-l"></i>Upload or Drag PDF </div>}
           
          </h2>
        </div>

      </div>

      <div className='allContent' style={{display:'flex', alignItems:'start'}}>

          {
            showButtons && (
              <div className='bttm'>
                <div className='allBtns'
                  style={{
                    marginTop: '2rem',
                    marginBottom: '2rem',
                  }}
                >

                  <div className='allSections'>
                    <section id="s1" className="sections">
                      {
                        pdfSummary.content ?
                         <div 
                          style={{
                            backgroundColor: '#1d2026',
                            textAlign: 'center',
                            fontSize: '19px'
                          }}
                         >
                           <h2>Summary :  <br/></h2>
                           
                           <p>{pdfSummary.content.split('\n').map((line, index) => (
                              <div key={index} className="code_line">{line}</div>
                            ))}
                          </p>
                         </div>
                        :

                        <button className= 'pdfBtn' onClick={getShortSummary}>Get Summary</button>
                      }
                    </section>

                    <section id="s2" className="section">
                      {
                        pdfQuestions.content ?
                        (
                         <div 
                          style={{
                            backgroundColor: '#1d2026',
                            textAlign: 'start',
                            fontSize: '19px',
                            height: '20rem',
                            paddingLeft: '1rem',
                            overflowY: 'auto',
                            width: '70rem'
                          }}
                         >
                           <h2>Questions :  <br/></h2>
                           
                           <p>{pdfQuestions.content.split('\n').map((line, index) => (
                              <div key={index} className="code_line">
                               {line.toLowerCase() === 'easy level questions:' || line.toLowerCase() === 'medium level questions:' || line.toLowerCase() === 'hard level questions:' ? (
                                  <b style={{ color: '#2C87AA' }}>{line}</b>
                                ) : (
                                  line
                                )}
                              </div>
                            ))}
                          </p>
                         </div>
                        )
                        :
                        (
                          <button className= 'pdfBtn' onClick={getQuestions}>Get Questions</button>
                        )
                      }
                    </section>

                    {
                      askDoubt ? 
                      <section id="s3" className="sections">
                        <button className= 'pdfBtn' onClick={getDoubtSolved}>Ask Doubt</button>
                        <Modal
                          open={open}
                          onClose={handleClose}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <Box sx={style} >
                            <Typography id="modal-modal-title" variant="h5" component="h2">
                              Keyboard Conversations
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                              <div className='chattingDiv'>
                               
                                <div className='qusnAns'>
                                  {
                                     isEnterPress && (
                                      <div>
                                        <h3>{<b>Question :</b>} {questionValue || 'Please enter a question'}</h3>
                                        <h4>
                                          {<b>Answer :</b>}{' '}
                                          {answer ? (
                                            answer.split('\n').map((line, index) => (
                                              <div key={index}>
                                                {line}
                                              </div>
                                            ))
                                          ) 
                                          : (
                                              <CircularProgress 
                                                size={25} 
                                                color="primary" 
                                                thickness={8}
                                                style={{ marginLeft: '0.5rem', marginTop: '1rem', }} 
                                              />
                                          )}
                                        </h4>
                                      </div>
                                    )
                                  }
                                </div>

                                <div className='doubtInput'>
                                  <input 
                                    type='text' 
                                    placeholder='Type your doubt...'
                                    onChange={(e)=> setQuestion(e.target.value)}
                                    onKeyDown={handleEnter}
                                    // value={questionValue}
                                    style={{
                                      width: '100%',
                                      padding: '0.5rem 1rem',
                                      borderRadius: '1.7rem',
                                      border: '1px solid black',
                                      outline: 'none'
                                    }}
                                  />
                                </div>
                              </div>
                            </Typography>
                          </Box>
                        </Modal>
                      </section>
                      :
                      <section id="s3" className="sections">
                        <button className= 'pdfBtn' onClick={getDoubtSolved}>Ask Doubt</button>
                      </section>

                    }

                    
                  </div>
                   
                </div>
              </div>
            )
          }

      </div>
      <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileInputChange} />

    </div>
  );
}

export default Pdf;


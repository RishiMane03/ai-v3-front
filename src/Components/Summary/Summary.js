import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import './Summary.css'
import NavBar from '../NavBar/NavBar';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
// import VariableContext from '../../Content/VariableContext';

function Summary() {

  useEffect(()=>{
    window.scrollTo(0, 0);
  },[])
  
  const [paragraph, setParagraph] = useState('');
  const [summary, setSummary] = useState('');
  const [typingContent, setTypingContent] = useState('');
  const [loaderDisplay, setLoaderDisplay] = useState(false)
//   const { userInfo } = useContext(VariableContext);
  const BackendURL = process.env.REACT_APP_BACKEND_URL
  // console.log(BackendURL);
  
  const navigate = useNavigate()

  axios.defaults.withCredentials = true;


  const handleSummarize = async () => {
    setTypingContent('')
    setSummary('')
    if(paragraph === '' || paragraph === null){
      toast.error(`Please add the paragraph`)
      return
    }

    if(paragraph.length < 100){
      toast.error(`Please add at least 100 characters`)
      return
    }

    try {
      setLoaderDisplay(true)
      const response = await axios.post(`https://ai-v3-back.onrender.com/summarize`, { paragraph });
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Error or NoToken:', error);
      if(error.response.data.sessionExpired){
        navigate('/login')
        return  toast.error("Session Exipred Please Login")
      }
    }
  };
//   console.log(summary);

  useEffect(() => {
    if (summary.content) {
      const typingEffectInterval = setInterval(() => {
        if (summary.content.length > typingContent.length) {
          setTypingContent((prevContent) => summary.content.slice(0, prevContent.length + 1));
        } else {
          clearInterval(typingEffectInterval);
        }
      }, 35); // Adjust typing speed as needed
      return () => clearInterval(typingEffectInterval);
    }
  }, [summary.content, typingContent]);

  return (
    <div className="Summary">
      <NavBar />
      <div className='inputSummary'>
        <div className='aiHeading'>
            <h1>Summary</h1>
            <p>Revolutionize your writing with our summary tool! Paste, click, and watch your text transform faster than a rabbit in a magic hat. Say goodbye to long-winded essays and hello to punchy summaries!</p>
        </div>
        <textarea
          className="textarea"
          placeholder="Place your paragraph..."
          value={paragraph}
          onChange={(e) => setParagraph(e.target.value)}
        ></textarea>
        <button onClick={handleSummarize} className="aiBtn"><span>Get Summary</span></button>

        <div className="content">
          {summary && loaderDisplay ? (
              <span>{typingContent}</span>
          ) : (
            <div className={loaderDisplay ? 'spinner' : 'block'}>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          )}
        </div>

      </div>

      
      
    </div>
  );
}

export default Summary;

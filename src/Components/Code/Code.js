import React,{useEffect, useState, useContext} from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Code.css'
import NavBar from '../NavBar/NavBar';
import toast from 'react-hot-toast';
// import VariableContext from '../../Content/VariableContext';


function Code() {
  useEffect(()=>{
    window.scrollTo(0, 0);
  },[])
  
    const [inputedCode, setInputedCode] = useState('');
    const [language, setlanguage] = useState('');
    const [yourCode, setyourCode] = useState('');
    const [typingContent, setTypingContent] = useState('');
    const [loaderDisplay, setLoaderDisplay] = useState(false)
    // const { userInfo } = useContext(VariableContext);
    const [customLanguage, setCustomLanguage] = useState('');
    const BackendURL = process.env.REACT_APP_BACKEND_URL
    const navigate = useNavigate()

    // console.log(language);

    useEffect(() => {
      if (yourCode.content) {
        const typingEffectInterval = setInterval(() => {
          if (yourCode.content.length > typingContent.length) {
            setTypingContent((prevContent) => yourCode.content.slice(0, prevContent.length + 1));
          } else {
            clearInterval(typingEffectInterval);
          }
        }, 30); // Adjust typing speed as needed
        return () => clearInterval(typingEffectInterval);
      }
    }, [yourCode.content, typingContent]);

    async function handleCode(){
        setTypingContent('')
        setyourCode('')
        if(!inputedCode){
          toast.error(`Please enter your question`)
          return
        }
        try {
            setLoaderDisplay(true)
            const response = await axios.post(`https://ai-v3-back.onrender.com/getCode`, { inputedCode,language });
            setyourCode(response.data.codeSolution);
          } catch (error) {
            console.error('Error:', error);
            if(error.response.data.sessionExpired){
              navigate('/login')
              return  toast.error("Session Exipred Please Login")
            }
          }
    }

    function copyToClipboard() {
      if (yourCode.content) {
        navigator.clipboard.writeText(yourCode.content);
        toast.success('Code copied to clipboard!');
      } else {
        toast.error('No code available to copy!');
      }
    }

  return (
    <div className='codeDiv'>
      <NavBar/>
      <div className='codeSection'>
         <div className='aiHeading'>
            <h1 className='CodingSol'>Coding Solution</h1>
            <p>Welcome to our coding playground, where even bugs are invited to dance! Post your coding questions, hit the button, and watch as solutions pop out like magic spells from a wizard's wand.</p>
          </div>

          <div className='allContent'>
            <div className='left'>
                <h2>Input Chamber</h2>
                <p className='selectLauange'>Select Coding Language</p>
                  
                  <div className='dropdownNcustomTag'>
                    <select className='dropDownForLang' onClick={(e)=>setlanguage(e.target.value)}>
                        <option>Any Random</option>
                        <option>Javascript</option>
                        <option>Java</option>
                        <option>Python</option>
                        <option>HTML</option>
                        <option>CSS</option>
                        <option value={customLanguage}>{customLanguage}</option>
                    </select>

                    <input
                      type='text'
                      placeholder='Add language inside dropdown'
                      value={customLanguage}
                      onChange={(e) => setCustomLanguage(e.target.value)}
                      className='customTag'
                    />
                  </div>

                <textarea
                    className="textareaCode"
                    placeholder="Enter your Code Question"
                    value={inputedCode}
                    onChange={(e) => setInputedCode(e.target.value)}
                ></textarea>
                <button onClick={handleCode} className='aiBtn'>Get Code</button>
            </div>
            
            <div className='right'>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <h2>Your Code</h2>
                {yourCode.content && (
                  <button onClick={copyToClipboard} className="copyBtn">
                    Copy Code
                  </button>
                )} 
              </div>
                <div className='yourCode'>

                  {
                    typingContent && loaderDisplay ?(
                      typingContent.split('\n').map((line, index) => (
                        <div key={index} className="code_line">{line}</div>
                    ))
                    )
                    :
                    (
                    <div className={loaderDisplay ? 'spinner' : 'block'} style={{position:'relative', top:'12rem', left:'5rem'}}>
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
                    )
                  }

                </div>

            </div>
          </div>
      </div>
    </div>
  )
}

export default Code
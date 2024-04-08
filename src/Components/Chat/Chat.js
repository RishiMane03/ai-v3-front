import React, { useState, useContext } from 'react'
import axios from 'axios';
import'./Chat.css'
import nouserlogo from '../../assets/nouserlogo.png'
import flowerLogo2 from '../../assets/flower-logo2.png'
import { NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import SendIcon from '@mui/icons-material/Send';
import toast from 'react-hot-toast';
// import VariableContext from '../../Content/VariableContext';

// MUI
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import SummaryIcon from '@mui/icons-material/Assignment';
import CodeIcon from '@mui/icons-material/Code';
import ChatIcon from '@mui/icons-material/Chat';
import PdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import LogoutIcon from '@mui/icons-material/Logout';
import SaveIcon from '@mui/icons-material/Save';
import UndoIcon from '@mui/icons-material/Undo';
import ClearIcon from '@mui/icons-material/Clear';


const Chat = () => {
    const [message, setMessage] = useState('') //the msg we type
    const [allMessages, setAllMessages] = useState([]) //saving all the msg of you and chatGPT
    const [isLoader, setIsLoader] = useState(false)
    // const { userInfo } = useContext(VariableContext);
    const BackendURL = process.env.REACT_APP_BACKEND_URL
    
    // MUI
    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };


  const icons = [<SummaryIcon />, <CodeIcon />, <ChatIcon />, <PdfIcon />, <ImageIcon />, <LogoutIcon />];
  const icons2 = [<SaveIcon />, <UndoIcon />, <ClearIcon />];

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {['Summary', 'Code', 'Chat', 'PDF', 'Image', 'Logout'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => handleDrawerItemClick(text)}>
              <ListItemIcon>
                {icons[index]}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ borderBottom: '1px solid #1d2026', marginTop: '12px', marginBottom: '12px' }}/>
      <List>
        {['Save-Chat', 'Previous-Chat', 'Clear-Chat'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => handleDrawerItemClick(text)}>
              <ListItemIcon>
                {icons2[index]}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const navigate = useNavigate();

  const handleDrawerItemClick = (text) => {
    switch (text) {
      case 'Summary':
        navigate('/summaryHub');
        break;
      case 'Code':
        navigate('/codeHub');
        break;
      case 'Chat':
        navigate('/chatHub');
        break;
      case 'PDF':
        navigate('/pdfHub');
        break;
      case 'Image':
        navigate('/imageHub');
        break;
      case 'Logout':
        logoutFun();
        break;
      case 'Save-Chat':
        handleSaveChat();
        break;
      case 'Previous-Chat':
        handlePreviousChat();
        break;
      case 'Clear-Chat':
        handleClearChat();
        break;
      default:
        break;
    }
  };

  const logoutFun = async () => {
    try {
      const response = await axios.get(`https://ai-v3-back.onrender.com/logout`);
      console.log(response.data);
      if(response.data.logout){
        navigate('/login')
      }
    } catch (error) {
      console.error('Error or NoToken:', error);
    }
  }

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

    const openAiAPI = process.env.REACT_APP_API_KEY

    const sendMessage = async () => {

        setIsLoader(true)
        // console.log(message)
        let url = "https://api.openai.com/v1/chat/completions"

        // let token;
        let token = `Bearer ${openAiAPI}`
        let model = 'gpt-3.5-turbo'

        // adding old msg to new msg list
        let messagesToSend = [
            ...allMessages,
            {
                role: 'user',
                content: message
            }
        ]

        let res = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model,
                messages: messagesToSend
            })
        })
        
        let resjson = await res.json()
        if (resjson) {
            console.log(resjson)

            // console.log(resjson.choices[0].message)

            // appending new msg to old msg
            let newAllMessages = [
                ...messagesToSend,
                resjson.choices[0].message
            ]


            // console.log(newAllMessages)

            setAllMessages(newAllMessages)
            setIsLoader(false)
            setMessage('')
        }
    }
    // console.log('allMessages > ',allMessages);

    async function handleSaveChat(){
        try {
            await axios.post(`https://ai-v3-back.onrender.com/saveChat`, { allMessages});
            console.log('Chat saved to MongoDB');
            if(allMessages.length > 0){
              toast.success('Memories created!')
            }else{
              toast.error(`There is nothing to create memories!`)
            }
        } catch (error) {
            if(allMessages.length > 0){
              toast.success('Memories created!')
            }
            console.log('Error saving chat to Database:', error);
            if(error.response.data.sessionExpired){
              navigate('/login')
              return  toast.error("Session Exipred Please Login")
            }
        }
    }

    const handlePreviousChat = async () => {
        try {
            const response = await axios.get(`https://ai-v3-back.onrender.com/getAllChats`);
            setAllMessages(response.data);
            console.log(response.data);
            return toast.success('Memories restored!')
        } catch (error) {
            console.error('Error fetching previous chats:', error);
            toast.error('Error connecting to your memories');
        }
    };

    const handleClearChat = ()=>{
        setAllMessages([])
        toast.success('Done with it!')
    }

    const handleEnter = async (e) => {
        if (e.key === 'Enter') {
            console.log('you press enter');
            sendMessage()
        } 
      };

    return (
        <div className='rightSection'>
            <div className='top'>
                <div className='logoNtitle'>
                    <img onClick={()=>navigate('/dashboard')} src={flowerLogo2} style={{ width: '65px', height: '50px' }} alt="" className="logo" />
                    <h1 onClick={()=>navigate('/dashboard')} style={{fontSize:'28px'}}>AiHub</h1>
                </div>
                <ul className='linksToNavigate'>
                    <NavLink to='/summaryHub'>Summary</NavLink>
                    <NavLink to='/codeHub'>Code</NavLink>
                    <NavLink to='/chatHub'>Chat</NavLink>
                    <NavLink to='/pdfHub'>PDF</NavLink>
                    <NavLink to='/imageHub'>Image</NavLink>
                </ul>
                
                <div className='btns'>
                    <button className='aiBtn' onClick={handleSaveChat}>Save chat</button>
                    <button className='aiBtn' onClick={handlePreviousChat}>Previous chats</button>
                    <button className='aiBtn' onClick={handleClearChat}>Clear chats</button>
                </div>

                <div className='muiDrawer'>
                    <Button onClick={toggleDrawer(true)}><MenuIcon style={{fontSize: '5rem', marginBottom: '1rem'}}/></Button>
                    <Drawer open={open} onClose={toggleDrawer(false)}>
                    {DrawerList}
                    </Drawer>
                </div>
            </div>

            {
                allMessages.length > 0 ?
                    <div className='messages'>
                        {allMessages.map((msg, index) => (
                            <div key={index} className='message'>
                                <img src={msg.role === 'user' ? nouserlogo : flowerLogo2} style={{width:'45px', height:'40px'}} alt="" />
                                <div className='details'>
                                    <h2 style={{marginTop: '0.5rem'}}>{msg.role === 'user' ? ('You') : ('AI')}</h2>
                                    <p style={{fontSize:'18px'}}>{msg.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    :
                    <div className='nochat'>
                        <div className='s1'>
                            <img src={flowerLogo2} style={{width:'60px', height:'50px'}}/>
                            <h1>how can I help you today?</h1>
                        </div>
                    </div>
            }

            <div className='bottomsection'>
                <div className='messagebar'>
                    <input type='text' placeholder='Lets Chat'
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                        onKeyDown={handleEnter}
                    />
                    {
                        isLoader ? 
                        <div 
                            className={isLoader ? 'spinner' : 'block'}
                            style={{
                                marginLeft: '85%',
                            }}
                        >
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
                        :
                        <SendIcon 
                            onClick={sendMessage} 
                            id ='sendIcon' 
                            style={{
                                color: '#2C87AA',
                                cursor: 'pointer',
                            }}
                        />
                    }
                </div>
            </div>
        </div>
    )
}

export default Chat
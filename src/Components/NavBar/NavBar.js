import React from 'react'
import './NavBar.css'
import { NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import flowerLogo2 from '../../assets/flower-logo2.png'
import axios from 'axios';

// MUI
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
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


function NavBar() {
  // MUI
  const [open, setOpen] = React.useState(false);
  const BackendURL = process.env.REACT_APP_BACKEND_URL

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const icons = [<SummaryIcon />, <CodeIcon />, <ChatIcon />, <PdfIcon />, <ImageIcon />, <LogoutIcon />];

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

  return (
    <div className='NavBar'>
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
            <div className='logoutBtn' onClick={logoutFun}>
              <i class="fa-solid fa-right-from-bracket fa-2xl"></i>
            </div>
          </ul>

          <div className='muiDrawer'>
            <Button onClick={toggleDrawer(true)}><MenuIcon style={{fontSize: '3rem', marginBottom: '1rem'}}/></Button>
            <Drawer open={open} onClose={toggleDrawer(false)}>
              {DrawerList}
            </Drawer>
          </div>
    </div>
  )
}

export default NavBar
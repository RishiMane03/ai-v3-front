import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components:
import LandingPage from './Components/LandingPage/LandingPage';
import HomePage from './Components/HomePage/homePage';
import Summary from './Components/Summary/Summary';
import Code from './Components/Code/Code';
import Chat from './Components/Chat/Chat';
import Pdf from './Components/Pdf/Pdf';
import ImagePage from './Components/Image/ImagePage';

function App() {
  return (
    <div>
 <ToastContainer />
        <Router>
          <Routes>
            <Route path='/' element={<LandingPage/>}/>
            <Route path='/dashboard' element={<HomePage/>}/>
            <Route path='/summaryHub' element={<Summary/>}/>
            <Route path='/codeHub' element={<Code/>}/>
            <Route path='/chatHub' element={<Chat/>}/>
            <Route path='/pdfHub' element={<Pdf/>}/>
            <Route path='/imageHub' element={<ImagePage/>}/>
          </Routes>
        </Router>
    </div>
  );
}

export default App;

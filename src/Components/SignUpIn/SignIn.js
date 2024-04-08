import axios from 'axios';
import React, { useEffect, useState,  useContext } from 'react'
import { useNavigate } from 'react-router-dom';
// import VariableContext from '../../Content/VariableContext'
import './SignIn.css'
import flowerLogo2 from '../../assets/flower-logo2.png'
import toast from 'react-hot-toast';

// Mui icons
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';


function SignUpIn() {

    const [isSignUpMode, setIsSignUpMode] = useState(false);
    const [valueOfToken, setValueOfToken] = useState('')
    // const { userInfo, setUserInfo } = useContext(VariableContext);
    const BackendURL = process.env.REACT_APP_BACKEND_URL
    const [logInFormData, setLogInFormData] = useState({
        name: '',
        password: ''
    });
    const [signUpFormData, setSignUpFormData] = useState({
        name: '',
        email: '',
        username: '',
        password: ''
    });

    const navigate = useNavigate()


    useEffect(()=>{
        if(valueOfToken){
            navigate('/dashboard')
        }
    },[valueOfToken])
    
    

    function navHome(){
        navigate('/')
    }

    function handleSignUpChange(event) {
        const { name, value } = event.target;
        setSignUpFormData(prevState => ({
            ...prevState,
            [name]: value //[name] >> dynamic property naming. This means that the property name is not fixed but rather determined at runtime
        }));
    }
  
    function handleSignUpSubmit(event) {
        event.preventDefault();
        axios.post(`https://ai-v3-back.onrender.com/register`, signUpFormData)
            .then(response => {
                console.log(response.data);
                if(response.data.alreadyEmail){
                    return  toast.error(response.data.message)
                }
                if(response.data.alreadyUser){
                    return  toast.error(response.data.message)
                }
                return  toast.success('Registration Successful. Please Login')
            })
            .catch(error => {
                console.log(error)
            });
    }

    const handleSignUpClick = () => {
      setIsSignUpMode(true);
    };
  
    const handleSignInClick = () => {
      setIsSignUpMode(false);
    };


    axios.defaults.withCredentials = true;
    function handleLogInChange(event) {
        const { name, value } = event.target;
        setLogInFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    async function handleLogInSubmit(event){
        event.preventDefault();
        try {
            const response = await axios.post(`https://ai-v3-back.onrender.com/signIn`, logInFormData)
            console.log(response.data);
            
            if(response.data.noUser){
                toast.error(response.data.message)
            }

            // user not found
            if(response.data.noUser){
                return toast.error(response.data.message)
            }

            // password is wrong
            if(response.data.wrongPassword){
                return toast.error(response.data.message)
            }

            // DB error
            if(response.data.dataBaseError){
                return toast.error(response.data.message)
            }

            // login Successful
            if(response.data.loginSuccessful){
                toast.success(response.data.message)
                navigate('/dashboard')
            }

        } catch (error) {
            console.log(error)
        }
    }

  return (
    <div className='backgroundDiv'>
        <div className={`container ${isSignUpMode ? 'sign-up-mode' : ''}`}>
            <div className="forms-container">
                <div className="signin-signup">
                    <form onSubmit={handleLogInSubmit}  className="sign-in-form">
                        <h2 className="title">Log in</h2>
                        <div className="input-field">
                            <PersonIcon className='allIcons'/>
                            
                            <input type="text" placeholder="Username" name="name" value={logInFormData.name} onChange={handleLogInChange} required />
                        </div>

                        <div className="input-field">
                            <LockIcon className='allIcons'/>
                            <input type="password" placeholder="Password" name="password" value={logInFormData.password} onChange={handleLogInChange} required />
                        </div>
                        <input type="submit" value="Login" className="Btn" />
                        <p style={{color: 'white', marginTop:'1rem'}}>Don't have account? click on Sign up</p>
                    </form>

                    <form onSubmit={handleSignUpSubmit} className="sign-up-form">
                        <h2 className="title">Sign up</h2>
                        <div className="input-field">
                            <PersonIcon className='allIcons'/>
                            <input type="text" placeholder="Name" name="name" value={signUpFormData.name} onChange={handleSignUpChange} required />
                        </div>

                        <div className="input-field">
                            <PersonIcon className='allIcons'/>
                            <input type="text" placeholder="Username" name="username" value={signUpFormData.username} onChange={handleSignUpChange} required />
                        </div>

                        <div className="input-field">
                            <EmailIcon className='allIcons'/>
                            <input type="text" placeholder="Email" name="email" value={signUpFormData.email} onChange={handleSignUpChange} required />
                        </div>

                        

                        <div className="input-field">
                            <LockIcon className='allIcons'/>
                            <input type="password" placeholder="Password" name="password" value={signUpFormData.password} onChange={handleSignUpChange} required />
                        </div>
                        
                        <input type="submit" className="Btn" value="Sign up" />
                        <p style={{color: 'white', marginTop:'1rem'}}>Already have account? click on Log in</p>
                    </form>
                </div>
            </div>

            <div className="panels-container">
                <div className="panel left-panel">
                    <div className="content">
                        <h3>New to our community?</h3>
                        <p
                            style={{
                                textAlign: 'center',
                                fontSize: '20px',
                            }}
                        >
                            Sign up now and let's make the internet a weirder place together!
                        </p>
                        <button className="changeBtn" id="sign-up-btn" onClick={handleSignUpClick}>
                            Sign up
                        </button>
                    </div>
                    <img  src={flowerLogo2} onClick={navHome} className="image" alt="" />
                </div>
                <div className="panel right-panel">
                    <div className="content">
                        <h3>One of Our Valued Members</h3>
                        <p
                            style={{
                                textAlign: 'center',
                                fontSize: '20px',
                            }}
                        >
                            Welcome back, time traveler! Login to return to the present.
                        </p>
                        <button className="changeBtn" id="sign-in-btn" onClick={handleSignInClick}>
                            Log in
                        </button>
                    </div>
                    <img src={flowerLogo2} onClick={navHome} className="image" alt="" />
                </div>
            </div>
        </div>
    </div>
  )
}

export default SignUpIn
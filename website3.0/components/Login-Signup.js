"use client";

import React,{useEffect, useState} from 'react';
import "@stylesheets/login-signup.css";
import OTP from '@pages/OTP';
import Profile from '@pages/Profile';
import Popup from "@components/Popup";
import Popup1 from './Popup1';
import {FaEye,FaEyeSlash} from 'react-icons/fa'

export const Login = ({ onClose, onSignupClick }) => {
  const [showPassword,setShowPassword]=useState(false)
  function toggle(){
    if(showPassword){
      setShowPassword(false)
    }else{
      setShowPassword(true)
    }
  }
  return (
    <div className="login-auth-container">
      <h1>Login to HelpOps-Hub</h1>
      <button className="google-btn">
      <img src="google.png" alt="Google" />
        Sign in with Google
      </button>
      <button className="github-btn">
      <img src="github.png" alt="GitHub" />
        Sign in with Github
      </button>
      <p>Or</p><br/>
      <input type="text" placeholder="Email or username" />
      <input             type={`${showPassword?"text":"password"}`}
 placeholder="Password" />         {showPassword ? <FaEye className='eye1' onClick={toggle}/>:<FaEyeSlash className='eye1' onClick={toggle}/>}
<br/>
      <a href="#" onClick={onSignupClick}>New here? Sign up now</a><br/>
      <button className="login-btn">Login</button>
      <button className="close-btn" onClick={onClose}>X</button>
    </div>
  );
};

export const Signup = ({ onClose, onLoginClick }) => {
  const [showOTP, setShowOTP] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState("");  // State to hold error messages
  const [errorOtp, setErrorOtp] = useState(false);  // State to hold error messages

  const [popup,setPopup]=useState(false)
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };
  const handleContinue =async () => {
    if(validateEmail(email)){
      await fetch("/api/signup",{
        method:"POST",
        body:JSON.stringify({
          email:email,
        isSend:true
        })
      })
      localStorage.setItem('email',email)
      setShowOTP(true);
      // Here you would typically trigger sending an OTP to the provided email
    }else{
      setError('Please Enter a valid Email address')
      setPopup(true)
      setTimeout(() => {
        setError('')
        setPopup(false)
        setEmail('')
}, 2000);
    }
    
  };
  const handleOTPSubmit =async (otp) => {
    try {
      let email = localStorage.getItem('email');
      let response = await fetch('/api/signup', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, isSend: false })
      });

      let data = await response.json();

      // Here you would typically verify the OTP
      if (data.otp == otp) {
        setShowProfile(true);
      } else {
        console.log("inside error")
        setErrorOtp(true);
        setPopup(true)
        setTimeout(() => {
          setErrorOtp(false);
        }, 2000);
      }
    } catch (error) {
      setErrorOtp('An error occurred');
      setTimeout(() => {
        setErrorOtp('');
      }, 2000);
    }
  };

  const handleProfileSubmit = (profileData) => {
    // Handle profile submission
    console.log('Profile data:', profileData);
    onClose(); // Close the signup process
  };

  const handleBackToSignup = () => {
    setShowOTP(false);
  };

  if (showProfile) {
    return <Profile onSubmit={handleProfileSubmit} onClose={onClose} />;
  }

  if (showOTP) {
    return <> <OTP onClose={onClose} isError={errorOtp} setError={setError} onOTPSubmit={handleOTPSubmit} onBack={handleBackToSignup} />;
        
          </> 
  }

  return (
    <div className="signup-auth-container">
      {popup&& <Popup msg={error} error={`${error=='Subscribed Successfully'?"green1":"red1"}`} />}
      {errorOtp&& <Popup1 msg={errorOtp} error={`${errorOtp=='Subscribed Successfully'?"green1":"red1"}`} />}

      <h1>Create Your HelpOps-Hub Account</h1>
      <h5>Join the HelpOps-Hub community by registering for a new account and unlock the world of DevOps resources.</h5>
      <button className="google-btn">
        <img src="/google.png" alt="Google" />
        Sign up with Google
      </button>
      <button className="github-btn">
        <img src="/github.png" alt="GitHub" />
        Sign up with Github
      </button>
      <p>Or</p><br/>
      <input 
        type="email" 
        placeholder="Enter your email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br/>
      <a href="#" onClick={onLoginClick}>Already have an account? Login</a><br/>
      <button className="continue-btn" onClick={handleContinue}>Continue</button>
      <button className="close-btn" onClick={onClose}>X</button>
    </div>
  );
};
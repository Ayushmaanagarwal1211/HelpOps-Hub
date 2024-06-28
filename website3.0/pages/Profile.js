"use client";
import React, { useState } from 'react';
import "@stylesheets/profile.css"
import Popup from "@components/Popup";
import {FaEye,FaEyeSlash} from 'react-icons/fa'
const Profile = ({ onClose }) => {
  // State for form fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading , setLoading ]=useState(false)
  const [showPassword,setShowPassword]=useState(false)
  const [showConfirmPassword,setConfirmShowPassword]=useState(false)
  
let [error,setError]=useState(false)
  const [confirmPassword, setConfirmPassword] = useState('');
  function validateDetails(){
   
    if(password==confirmPassword){
      if(password.length < 8 || 
        !/[0-9]/.test(password) || 
        !/[a-z]/.test(password) || 
        !/[A-Z]/.test(password) || 
        !/[@#$%^&*()\-_=+{}[\]\|\\;:'",.<>\/?~`!]/.test(password)){
        setError('password must be 8 charachters long must contains 1 lowercase 1 uppercase and 1 special charachter') 
        return false
      }else{
        if(username.length==0){
          setError("Please Enter Username")
          return false
        }else{
          
          return true
        }

      }
    }else{
      setError("Please enter same password and confirm password")
      return false
    }
  }
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Add account creation logic here
    if(validateDetails()){

      await fetch('/api/createaccount',{
        method:'POST',
        body:JSON.stringify({
          email:localStorage.getItem('email'),
          name:username,
          password:password
        })
      }) 
      onClose();
    }else{
    setLoading(true)
      setTimeout(() => {
        setError('')
        setLoading(false)
      }, 2000);
    }
   
  };
  function toggle1(){
    if(showConfirmPassword){
      setConfirmShowPassword(false)
    }else{
      setConfirmShowPassword(true)
    }
  }
  function toggle(){
    if(showPassword){
      setShowPassword(false)
    }else{
      setShowPassword(true)
    }
  }
  return (
    <div className="profile-container">
            {error&& <Popup msg={error} error={`${error=='Subscribed Successfully'?"green1":"red1"}`} />}

      <h1>Profile</h1>
      <img src="circle.png" alt="Profile-circle" />
      <form onSubmit={handleSubmit}>
        {/* Username input */}
        <div className="form-group">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        {/* Password input */}
        <div className="form-group">
          <input
            type={`${showPassword?"text":"password"}`}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
         {showPassword ? <FaEye className='eye' onClick={toggle}/>:<FaEyeSlash className='eye' onClick={toggle}/>}
        </div>
        {/* Confirm password input */}
        <div className="form-group">
          <input
            type={`${showConfirmPassword?"text":"password"}`}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
                   {showConfirmPassword ? <FaEye className='eye' onClick={toggle1}/>:<FaEyeSlash className='eye' onClick={toggle1}/>}

        </div>
        {/* Submit button */}
        <button type="submit" onClick={handleSubmit} className="create-account-btn">Create Account</button>
      </form>
    </div>
  );
};

export default Profile;
import React, { useContext, useEffect, useRef, useReducer, useState, createContext, useCallback } from "react";
import '../style/login.css'
import fire from '../firebase/fire'
import {UserContext} from '../App'


const Login = ()=> {

    const SentUserContext = useContext(UserContext);
    const {isUser, setIsUser} = SentUserContext


    const handleSignUp = useCallback(async event => {
        event.preventDefault();
        const { email, password } = event.target.elements;
        try {
          await fire
            .auth()
            //.createUserWithEmailAndPassword(email.value, password.value);
            .signInWithEmailAndPassword(email.value, password.value)
            .then((response) =>{
                setIsUser(response.user.email)
            })

        } catch (error) {
          alert(error);
        }
      });  


    return(
        <>
        <div className='loginContainer'>
            <h1>Sign In</h1>
            <form className='formContainer' onSubmit={handleSignUp}>
                <label>
                Email</label>
                    <input className='signInInput' name="email" type="email" placeholder="Email" />
                
                <label>
                Password</label>
                    <input className='signInInput' name="password" type="password" placeholder="Password" />
                
                <button className='signInBtn' type="submit">Sign In</button>
            </form>
        </div>

        </>
    )
}

export default Login
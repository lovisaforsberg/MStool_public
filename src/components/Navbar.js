import React, { useContext, useEffect, useRef, useReducer, useState, createContext, useCallback } from "react";
import '../style/Navbar.css'
import fire from '../firebase/fire'
import {UserContext} from '../App'

const Navbar = ()=>{

    const SentUserContext = useContext(UserContext);
    const {isUser, setIsUser} = SentUserContext

    const handleSignout = () =>{
        fire.auth().signOut().then(() => {
            setIsUser(null)
          }).catch((error) => {
              
            alert(error)
          });

    }
 
        return (
            <div className='navBarContainer'>
                <h1 className='navbarHeadline'>JANUARY 2021 / OWNED CHANNELS</h1>
                <button className='navbarBtn' onClick={handleSignout}>Sign Out</button>
   
            </div>
        );
    
}

export default Navbar
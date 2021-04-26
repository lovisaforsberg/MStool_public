import React, { useContext, useEffect, useRef, useReducer, useState, createContext, useCallback } from "react";
import '../style/Navbar.css'
import fire from '../firebase/fire'

const Navbar = ()=>{
 
        return (
            <div className='navBarContainer'>
                <h1 className='navbarHeadline'>JANUARY 2021 / OWNED CHANNELS</h1>
                {/*<button className='navbarBtn' onClick={handleSignout}>Sign Out</button>*/}
   
            </div>
        );
    
}

export default Navbar
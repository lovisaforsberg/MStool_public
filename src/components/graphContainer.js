import React, { useContext, useEffect, useRef, useReducer, useState, createContext, Children } from "react";
import * as d3 from 'd3'
import PieChart from './piechart'
//import LineChart from './Line_chart'
import BarChart from './barchart'
import TextInsight from './textinsight'
import NetSentiment from './netsentiment'
import LineChart from './linechart'
import '../style/graphContainer.css'
import {SentimentContext} from '../App'

export const HoverSentContext = createContext({})
export const IsPostContext = createContext({})
export const allPostsContext = createContext({})



const GraphContainer = ()=> {
    const SentSentimentContext = useContext(SentimentContext);
    const {choosenSentiment, setChoosenSentiment} = SentSentimentContext

    const [hoverSent, setHoverSent] = useState('')

    const [navText, setNavText] = useState(choosenSentiment.name)
    const [navType, setNavType] = useState()

    const [allPosts, setAllPosts] = useState([])




    const [isPost, setIsPost] = useState(false)
    const [showNet, setShowNet] = useState(false)
    const [showTime, setShowTime] = useState(false)


    const handlePost = ()=>{
        if('post_content' in choosenSentiment){
            setIsPost(true)
        }
        else{
            setIsPost(false)
        }
    }

    const handleNav = () =>{
        if ('category' in choosenSentiment){
            setNavType('Post: ')
        }
        else if(choosenSentiment.name === 'facebook' || choosenSentiment.name === 'instagram' || choosenSentiment.name === 'twitter'){
            setNavType('Channel: ')
        }
        else{
            setNavType('Category: ')
        }
    }

    function startsWithCapital(word){
        return word.charAt(0) === word.charAt(0).toUpperCase()
    }

    const handlePressNet = (e) =>{
        setShowTime(false)
        setShowNet(e=>!e)
    }
    const handlePressTime = (e) =>{
        setShowNet(false)
        setShowTime(e=>!e)
    }


    useEffect(()=>{
        handlePost()
        setNavText(choosenSentiment.name)
        handleNav()
    })

    return(
        <>
        <div className='graphTextContainer'>
            <HoverSentContext.Provider value = {{hoverSent, setHoverSent}}>
                <IsPostContext.Provider value = {{isPost, setIsPost}}>
                    <allPostsContext.Provider value = {{allPosts, setAllPosts}}>

                    <text className='NaviagationText'><strong>{navType}</strong>{navText}</text>


                        <div className='PieBarContainer'>
                            {isPost ? null : <PieChart></PieChart>}
                            
                            <BarChart></BarChart>
                        </div>
                        {isPost?null:
                        <>
                            <button id='cha_button' className={showNet?'toggleButtonActive':'toggleButtonInactive'} onClick={(e)=>handlePressNet(e)}>{showNet?'Hide details':'Get more details'}</button>
                            <button id='cha_button' className={showTime?'toggleButtonActive':'toggleButtonInactive'} onClick={(e)=>handlePressTime(e)}>{showTime?'Hide change over time':'Show change over time'}</button>
                        </>
                        }

                        <div className='textContainer'>
                            {isPost ? 
                                <TextInsight></TextInsight>:
                                showNet? 
                                <NetSentiment></NetSentiment>:
                                showTime ?
                                <LineChart></LineChart>: 
                                null} 
                        </div>

                    </allPostsContext.Provider>
                </IsPostContext.Provider>
            </HoverSentContext.Provider>
        </div>
        </>
    )
}
export default GraphContainer;
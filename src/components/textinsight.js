import React, { useContext, useEffect, useRef, useReducer, useState, createContext } from "react";
import * as d3 from 'd3'
import '../../node_modules/@ibm/plex/css/ibm-plex.css';
import {SentimentContext} from '../App'
import {HoverSentContext} from './graphContainer'
import {IsPostContext} from './graphContainer'
import '../style/textinsight.css'
//import Highlighter from "react-highlight-words";

const TextInsight = () =>{
    const SentSentimentContext = useContext(SentimentContext);
    const {choosenSentiment, setChoosenSentiment} = SentSentimentContext

    const SentHoverSentContext = useContext(HoverSentContext)
    const {hoverSent, setHoverSent} = SentHoverSentContext

    const SentIsPostContext = useContext(IsPostContext)
    const {isPost, setIsPost} = SentIsPostContext

    const [highlight, setHighlight] = useState('')

    const [img, setImg] = useState(choosenSentiment.img)
    const [textHeadline, setTextHeadline] = useState(choosenSentiment.insight_short)
    const [qoutes, setQuotes] = useState([])

    const handlePost = ()=>{
        if('post_content' in choosenSentiment){
            setIsPost(true)
            setTextHeadline(choosenSentiment.insight_short.toUpperCase())
            if(choosenSentiment.insight_quote=== '-'){
                setQuotes([])
            }
            else{
               setQuotes(choosenSentiment.insight_quote) 
            }
            
        }
        else{
            setIsPost(false)
            setTextHeadline('')
            setQuotes([])
        }
    }


    let text = choosenSentiment.insight_full
    const createHighlight = () =>{
        if(!(insight === '-')){
           for (var i = 0; i < (insight).length; i++ ){
            text = text.replace(insight[i], (match) => `<mark class="highlight_${sentiment}">${match}</mark>`)
            } 
        }
        else{
        }  
    }

    if(hoverSent === 'Positive'){
        var sentiment = 'pos'
        var insight = choosenSentiment.insight_pos
        createHighlight()
    }
    if(hoverSent === 'Negative'){
        var sentiment = 'neg'
        var insight = choosenSentiment.insight_neg
        createHighlight()
    }
    if(hoverSent === 'Neutral'){
        var sentiment = 'neu'
        var insight = choosenSentiment.insight_neu
        createHighlight()
    }
    if(hoverSent === 'eng'){
        var sentiment = 'eng'
        var insight = choosenSentiment.insight_eng
        createHighlight()
    }
    console.log(qoutes)


    //console.log(createHighlight(choosenSentiment.insight_full))

    //var replaced = choosenSentiment.insight_full.replace(/[^(\w\s]/gi, '')
    //console.log(replaced)

    //var text = choosenSentiment.insight_full.replace(/elevant neutral sentiment/g, (match) => `<mark class="highlight_${sentiment}">${match}</mark>`)
    //console.log(text)
    useEffect(()=>{
        handlePost()
    }, []) // close useeffect

    return(
        <>
        {img === '-' ? 
        <div className='textInsightContainer'>
            <div className='textContainer'>
                <div className='textDesc'><italic>No further information</italic></div>
                <a href={choosenSentiment.link} target="_blank" className='postLink'>Link to post</a>

            </div>
    </div>
        
        :
        <div className='textInsightContainer'>
            <div className='textContainer'>
                <div className='textHeadline'>{textHeadline}</div>
                <div className='textDesc' dangerouslySetInnerHTML={{__html:text}}/>
                {qoutes.map( quote=>{
                    return (<div className='textQuote'>"{quote}"</div>)
                
                })}


            </div>
            <div className='imgContainer'>
                <a href={choosenSentiment.link} target="_blank">
                    <img className='postImg' src={require(`../images/${img}.png`).default}></img>

                </a>
                <a href={choosenSentiment.link} target="_blank" className='postLink'>Link to post</a>
            </div>
        </div>
}

        </>
    )
}

export default TextInsight;
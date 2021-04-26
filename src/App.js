import React, { useContext, useEffect, useRef, useReducer, useState, createContext } from "react";
import './App.css';
import * as d3 from 'd3'
import SunBurst from './components/sunburst'
import PieChart from './components/piechart'
import GraphContainer, { HoverSentContext } from './components/graphContainer'
import '../node_modules/@ibm/plex/css/ibm-plex.css';
import NetSentiment from './components/netsentiment'
import Navbar from './components/Navbar'

/*
import data from './data/test.json'
import newdata from './data/newstructure.json'
*/
import data from './data/anonymData.json'



export const SentimentContext = createContext({})
export const HoverContext = createContext({})
export const GroupByContext = createContext({})


function App() {

  const [choosenSentiment, setChoosenSentiment] = useState(data.children[0])
  const [hover, setHover] = useState([])
  const [groupByChannel, setGroupByChannel] = useState(true)




  return (
    <div className="App">
      <header className="App-header">

      <SentimentContext.Provider value = {{choosenSentiment, setChoosenSentiment}}>
      <HoverContext.Provider value = {{hover, setHover}}>
        <GroupByContext.Provider value = {{groupByChannel, setGroupByChannel}}>
        <div className='NavBar'>
          <Navbar></Navbar>
        </div>
        <div className='Content'>
     
          <div className='sunburstContainer'>
            <SunBurst></SunBurst>
          </div>
    
          <div className='piechartContainer'>
            <GraphContainer></GraphContainer>
          </div>
          </div>
          </GroupByContext.Provider>
        </HoverContext.Provider>
        </SentimentContext.Provider>
    
      
        
      </header>
    </div>
  );
}

export default App;

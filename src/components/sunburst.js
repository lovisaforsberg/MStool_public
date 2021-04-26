import React, { useContext, useEffect, useRef, useReducer, useState, createContext } from "react";
import ReactTooltip from 'react-tooltip';
import * as d3 from 'd3'
import {SentimentContext} from '../App'
import {HoverContext} from '../App'
import {GroupByContext} from '../App'
import '../style/sunburst.css'

/*
import data from '../data/test.json'
import newdata from '../data/newstructure.json'
*/
import data from '../data/anonymData.json'
import newdata from '../data/anonymDataNewstructure.json'


const SunBurst = ()=> {

  const SentSentimentContext = useContext(SentimentContext);
  const {choosenSentiment, setChoosenSentiment} = SentSentimentContext

  const SentHoverContext = useContext(HoverContext);
  const {hover, setHover} = SentHoverContext

  const SentGroupByContext = useContext(GroupByContext);
  const {groupByChannel, setGroupByChannel} = SentGroupByContext

  const [choosenData, setChoosesData] = useState(choosenSentiment)
  const [navText, setNavText] = useState('')


  //const categories = ['around the block', 'block of the week', 'caves and cliffs', 'marketplace highlights', 'realms plus', 'taking inventory', 'engagement driver', 'pixel art', 'satisfying loops', 'community highlights', 'youtube support']
  const categories =['doctors', 'revolution', 'can be found in liverpool', 'george harrison', "ringo's singing lead", 'julia/julian', 'cry', 'animals', 'featured in mad men', 'norway', 'instrumentals']
  
  const handleFilter = (clicked) => {
    setChoosenSentiment(clicked)
    //console.log(clicked)
  }
  const handleHover = (data) => {
    if('post_content' in data){
      var ar = []
      ar.push(data.name)
      setHover(ar)
    }
    else if('children' in data){
      var ar = []
      data.children.forEach(child=>{
        ar.push(child.name)
      })
      setHover(ar)
    }
    else{
      setHover([])
    }
  }

  const handleDataSet = (click) =>{
    if(click === 'cha'){
      setChoosenSentiment(data.children[0])
      setChoosesData(data.children[0])
      setGroupByChannel(true)
      document.getElementById('cha_button').className = 'groupButtonActive'
      document.getElementById('cat_button').className = 'groupButtonInactive'


    }
    else{
      setChoosenSentiment(newdata.children[0])
      setChoosesData(newdata.children[0])
      setGroupByChannel(false)
      document.getElementById('cat_button').className = 'groupButtonActive'
      document.getElementById('cha_button').className = 'groupButtonInactive'


    }
}

  const handleData = (channel) =>{
    if (channel === 'fb'){
      setChoosesData(data.children[0])
      setChoosenSentiment(data.children[0])
      document.getElementById('fb_button').className = 'channelButtonActive'
      document.getElementById('ig_button').className = 'channelButtonInactive'
      document.getElementById('tw_button').className = 'channelButtonInactive'

    }
    if (channel === 'ig'){
      setChoosesData(data.children[1])
      setChoosenSentiment(data.children[1])
      document.getElementById('fb_button').className = 'channelButtonInactive'
      document.getElementById('ig_button').className = 'channelButtonActive'
      document.getElementById('tw_button').className = 'channelButtonInactive'
    }
    if (channel === 'tw'){
      setChoosesData(data.children[2])
      setChoosenSentiment(data.children[2])
      document.getElementById('fb_button').className = 'channelButtonInactive'
      document.getElementById('ig_button').className = 'channelButtonInactive'
      document.getElementById('tw_button').className = 'channelButtonActive'
    }
  }

  const handleOption = (event) =>{
    console.log(event.target.value)
    setChoosenSentiment(newdata.children[event.target.value])
    setChoosesData(newdata.children[event.target.value])
  }


    const d3Container = useRef(null)

    useEffect(()=>{
    
    d3.select(".root_sunburst").selectAll('*').remove()

    //setData(data)

    const width = 500
    const radius = width / 7


    const partition = choosenData => {
        const root = d3.hierarchy(choosenData)
        .sum(d => (d.eng_rate))
        //.sort((a, b) => b.value - a.value);
        .sort(function(a, b) { return d3.ascending(a.name, b.name); })

        return d3.partition()
        .size([2 * Math.PI, root.height + 1])
        (root);
      }
  
        //var color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1));
        var color = d3
              .scaleOrdinal(['#07737F','#27306E', '#62254A', '#7C2438', '#A6193C', '#FFB86E'])
        /*
        var color = d3
              .scaleOrdinal()
              .range(['#CC5BA4', '#C65649', '#EAD94C', '#68AD7C', '#59A5CC'])
              */

      const format = d3.format(",d");

      var divTooltip = d3
        .select('body')
        .append('div')
        .attr('class', 'toolTip')
        .attr('font-size', '50px')


      const arc = d3.arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(radius * 1.5)
        .innerRadius(d => d.y0 * radius)
        .outerRadius(d => (Math.max(d.y0 * radius, d.y1 * radius - 1)));

      const root = partition(choosenData);

      root.each(d => d.current = d);




const svg = d3.select(d3Container.current)
    .attr('class', 'root_sunburst')
    .append('svg')
    //.style("width", "100%")
    //.style("height", "auto")
    .style("font", "10px sans-serif");


d3.select('#sunBurst')
.data(root.descendants().slice(1))
.append('text')
.attr('class', 'NaviagationText')
.html(navText)
.attr("dy", "1em")

const g = svg.append("g")
    .attr("transform", `translate(${width/2},${width/2})`);

const path = g.append("g")
.selectAll("path")
.data(root.descendants().slice(1))
.enter().append("path")
.style("cursor", "pointer")
//.on('click', function(d){console.log(d.data)})
  //.attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
  .attr('fill', d=> groupByChannel ? d.depth === 1 ? d.data.color : d.parent.data.color :
  d.depth === 1 ? d.data.color : d.parent.data.color
  //d.depth === 2 ? d.data.color : d.depth === 3 ? d.parent.data.color : color(d.name)
  //d.depth === 2 ?  d.depth === 3 ? d.data.parent.color : 'green' : d.data.color
  
  )
  //.attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 1 : 0.8) : 0)
  .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)

  .attr("d", d => arc(d.current))

  .on('mousemove', function(d){
      divTooltip
      .style('left', d3.event.pageX+10+'px')
      .style('top', d3.event.pageY-25+'px')
      .style('display', 'inline-block')
      .html(d.depth === 2 ? 'Post: '+d.data.name : groupByChannel ? 'Category: '+d.data.name: 'Channel: '+d.data.name)
  })
  .on('mouseout', function(d){
    divTooltip.style('display', 'none')
    d3.select(this).attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
    handleHover([])
  })
  .on('click', clicked)
  
  .on('mouseover', function(d){
    d3.select(this).attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.8 : 0.6) : 0)
    handleHover(d.data)
    //console.log(d)
  })



path.filter(d => d.children)
    .style("cursor", "pointer")
    //.on("click", clicked);


    /*
path.append("title")
   // .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);
    //.text(d => `${d.data.courseName}`);
    .text('hejhej')
    */

  const label = g
  .append("g")
  .attr("pointer-events", "none")
  .attr("text-anchor", "middle")
  .style("user-select", "none")
  .selectAll("text")
  .data(root.descendants().slice(1))
  .join("text")
  .attr('class', 'pathLabel')
  .attr("dy", "0.35em")
  .attr("fill-opacity", d => +labelVisible(d.current))
  .attr("transform", d => labelTransform(d.current))
  /*
  .attr("transform", function(d) {return d.data.children !== undefined ?
     "translate(" + arc.centroid(d) + ")rotate(" + computeTextRotation(d) + ")":
     labelTransform(d.current)
    })
  */
  
  .style('font-size', '10px')
  .text(d=> d.data.name)
 /*
 // SEE ONLY THE LABELS OF THE FIRST LEVEL
    .style('visibility', function(d) {
      return isTextVisible(d, 0) ? 'visible' : 'hidden';   
  })
  */
 .style('visibility', 'visible')
  .call(wrap, 20);

  function computeTextRotation(d) {
    var angle = (d.x0 + d.x1) / Math.PI * 90;  // <-- 1

    // Avoid upside-down labels
    return (angle < 90 || angle > 270) ? angle : angle + 180;  // <--2 "labels aligned with slices"

    // Alternate label formatting
    //return (angle < 180) ? angle - 90 : angle + 90;  // <-- 3 "labels as spokes"
}


const parent = g.append("circle")
    .datum(root)
    .attr("r", radius)
    .attr("fill", "none")
    .attr("pointer-events", "all")
    .style('cursor', 'pointer')
    .on("click", clicked)
/*
  g.append("g")
  .selectAll("circle")
  .text('back')
  .text(function(d){return d.current.data.name})
  .attr('text-anchor', 'middle')
  .attr('alignment-baseline', 'middle')
  .style('font-size', '12px')
  .style("cursor", "pointer")
  .attr("pointer-events", "all")
  .on("click", function(d){console.log(d.data.name)});
*/

const textParent = g.append("text")
  .datum(root)
  .on('mouseover', function(d){console.log(d)})
  .attr('id', 'backText')
  .attr('class', 'zoomedOut')
  .attr('text-anchor', 'middle')
  .attr('alignment-baseline', 'middle')
  .attr("pointer-events", "all")
  .attr('fill', '#404040')
  .on("click", clicked)

  .style('font-size', '12px')
  .style('cursor', 'pointer')
  .html('')


function isTextVisible(d, depth){
    if (depth === 0){
      return d.depth === 0 || d.depth === 1;
    } else {
      return d.depth === depth || d.depth === depth - 1;
    }
  }



function clicked(p) {
  
  /*
  SEE ONLY LABEL ON FIRST LEVEL
 d3.selectAll(".pathLabel")
      .style('visibility', function(d2) {
        return d2.depth > p.depth+1 ? 'hidden' : 'visible'
      })
      */

  handleFilter(p.data)
  parent.datum(p.parent || root);
  textParent.datum(p.parent || root);

  if(p.depth === 0){
    document.getElementById('backText').setAttribute("class", "zoomedOut")
  }
  else{
    document.getElementById('backText').setAttribute("class", "zoomedIn")
  }
  
  
//setZoomedData(p.data)

  root.each(d => d.target = {
    x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
    x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
    y0: Math.max(0, d.y0 - p.depth),
    y1: Math.max(0, d.y1 - p.depth)
  });

  const t = g.transition().duration(1500);

  // Transition the data on all arcs, even the ones that aren’t visible,
  // so that if this transition is interrupted, entering arcs will start
  // the next transition from the desired position.
  path.transition(t)
      .tween("data", d => {
        const i = d3.interpolate(d.current, d.target);
        return t => d.current = i(t);
      })
    .filter(function(d) {
      return +this.getAttribute("fill-opacity") || arcVisible(d.target);
    })
      .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0.4)
      //.attr("fill-opacity", function(d){if(d.depth==2){return 0.8}if(d.depth==3){return 0.7}if(d.depth==4){return 0.5}} )

      .attrTween("d", d => () => arc(d.current));

  label.filter(function(d) {
      return +this.getAttribute("fill-opacity") || labelVisible(d.target);
    }).transition(t)
      .attr("fill-opacity", d => +labelVisible(d.target))      
      .attrTween("transform", d => () => labelTransform(d.current));

}

//Aquí se le aumenta el número de arcos que muestra
function arcVisible(d) {
  return d.y1 <= 4 && d.y0 >= 1 && d.x1 > d.x0;
}


function labelVisible(d) {
  return d.y1 <= 5 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
}

function labelTransform(d) {
  const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
  const y = (d.y0 + d.y1) / 2 * radius;
  return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
}

function wrap(text, width) {
  text.each(function () {
      var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1, // ems
          y = text.attr("y")-((words.length+1)*4),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
      while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(" "));
              line = [word];
              tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
          }
      }
  });
}

    }, [choosenData]) // close useEffect

    return(
      <>
      <div className='sunburstBtn'>
      <div className='btnContainer'>
          <button id='cha_button' className='groupButtonActive' onClick={()=>handleDataSet('cha')}>Group by Channel</button>
          <button id='cat_button' className='groupButtonInactive' onClick={()=>handleDataSet('cat')}>Group by Categories</button>
        </div>
        {groupByChannel ? 
          <div className='btnContainer'>
            <button id='fb_button' className='channelButtonActive' onClick={()=>handleData('fb')}>Facebook</button>
            <button id='ig_button' className='channelButtonInactive' onClick={()=>handleData('ig')}>Instagram</button>
            <button id='tw_button'className='channelButtonInactive' onClick={()=>handleData('tw')}>Twitter</button>
          </div>:
          <div className='btnContainer'>
            <select className='dropDown' onChange={e=>handleOption(e)}>
            {categories.map((cat, i)=>{
                    return (<option value={i}>{cat}</option>)             
                })}
  
            </select>
            {/*
            {categories.map( cat=>{
                    return (<button id='fb_button' className='channelButtonActive small' onClick={()=>handleData('fb')}>{cat}</button>)             
                })}
              */}
          </div>
          }
          <div className='infoContainer'>
            <i className="fas fa-info-circle" data-tip data-for='sunburstInfo'></i>
            <ReactTooltip id='sunburstInfo' type='error' className="infoTooltip" place="bottom" textColor='#4d4d4d' backgroundColor='#FFDFC3'>
              {groupByChannel ?
              <p>The graph shows all posts for <strong>each category</strong> in the choosen channel. </p>:
              <p>The graph shows all posts for <strong>each channel</strong> for the selected category </p>}
              <p>The size of each part represents the <strong>engagement rate.</strong></p>
              <p>Use the graph to zoom into specific categories or posts.</p>
              <p>Click on a post get more details and <strong>insights.</strong></p>


            </ReactTooltip>
          </div>

          <svg id='sunBurst' width={500} height={500} radius={500/2} ref={d3Container}></svg>
      </div>
      </>
    )

} // close Areachart component
export default SunBurst; 

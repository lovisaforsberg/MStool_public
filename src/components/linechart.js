import React, { useContext, useEffect, useRef, useReducer, useState, createContext } from "react";
import * as d3 from 'd3'
import ReactTooltip from 'react-tooltip';
import '../style/linechart.css'
import {SentimentContext} from '../App'


const LineChart = () =>{

  const SentSentimentContext = useContext(SentimentContext);
  const {choosenSentiment, setChoosenSentiment} = SentSentimentContext

    const d3Container = useRef(null)

    const [showSentiment, setShowSentiment] = useState(true)

    //const [data, setGraphData] = useState([])

    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }

    const handleOption = (event) =>{
      if(event.target.value ==='sent'){
        setShowSentiment(true)
      }
      else{

        setShowSentiment(false)
      }
    }

    const sent_data = [
      {name:'pos', sent_name:'Positive', values:[
          {date:'August 2020', price: getRandomInt(15, 40)},
          {date:'September 2020', price: getRandomInt(15, 40)},
          {date:'October 2020', price: getRandomInt(15, 40)},
          {date:'November 2020', price: getRandomInt(15, 40)},
          {date:'December 2020', price: getRandomInt(15, 40)},
          {date:'January 2021', price: getRandomInt(15, 40)},
      ]},
      {name:'neg', sent_name:'Negative', values:[
          {date:'August 2020', price: getRandomInt(2, 18)},
          {date:'September 2020', price: getRandomInt(2, 18)},
          {date:'October 2020', price: getRandomInt(2, 18)},
          {date:'November 2020', price: getRandomInt(2, 18)},
          {date:'December 2020', price: getRandomInt(2, 18)},
          {date:'January 2021', price: getRandomInt(2, 18)},
      ]},
      {name:'neu', sent_name:'Neutral', values:[
          {date:'August 2020', price: '54'},
          {date:'September 2020', price: '55'},
          {date:'October 2020', price: '57'},
          {date:'November 2020', price: '53'},
          {date:'December 2020', price: '52'},
          {date:'January 2021', price: '59'},
      ]},
    ]

    const eng_data = [
      {name:'pos', eng_name:'Comments', values:[
          {date:'August 2020', price: getRandomInt(1,120)/100},
          {date:'September 2020', price: getRandomInt(1,120)/100},
          {date:'October 2020', price: getRandomInt(1,120)/100},
          {date:'November 2020', price: getRandomInt(1,120)/100},
          {date:'December 2020', price: getRandomInt(1,120)/100},
          {date:'January 2021', price: getRandomInt(1,120)/100},
      ]},
      {name:'neg', eng_name:'Likes', values:[
          {date:'August 2020', price: getRandomInt(1,230)/100},
          {date:'September 2020', price: getRandomInt(1,230)/100},
          {date:'October 2020', price: getRandomInt(1,230)/100},
          {date:'November 2020', price: getRandomInt(1,230)/100},
          {date:'December 2020', price: getRandomInt(1,230)/100},
          {date:'January 2021', price: getRandomInt(1,230)/100},
      ]},
      {name:'neu', eng_name:'Shares', values:[
          {date:'August 2020', price: getRandomInt(1,90)/100},
          {date:'September 2020', price: getRandomInt(1,90)/100},
          {date:'October 2020', price: getRandomInt(1,90)/100},
          {date:'November 2020', price: getRandomInt(1,90)/100},
          {date:'December 2020', price: getRandomInt(1,90)/100},
          {date:'January 2021', price: getRandomInt(1,90)/100},
      ]},
    ]

    


    //const months = ['jan', 'feb', 'mars', 'april', 'may', 'june']

    useEffect(()=>{

    
    const data = showSentiment?sent_data:eng_data

    d3.select(".root_linechart").selectAll('*').remove()

    var width = 400;
    var height = 200;
    //var margin = 35;
    var margin = {top: 5, right: 10, bottom: 15, left: 35}

    var duration = 250;

    var lineOpacity = "0.25";
    var lineOpacityHover = "0.85";
    var otherLinesOpacityHover = "0.1";
    var lineStroke = "1.5px";
    var lineStrokeHover = "2.5px";

    var circleOpacity = '0.85';
    var circleOpacityOnLineHover = "0.25"
    var circleRadius = 3;
    var circleRadiusHover = 6;

var months = (data[0].values.map(value =>{return value.date}))


/* Scale */
var xScale = d3.scalePoint()
  .domain(months)
  .rangeRound([0, width - margin.left])


var yScale = d3.scaleLinear()
  .domain([0, showSentiment? 100: 2.3 ])
  .range([height-margin.bottom, 0]);

var color = d3.scaleOrdinal(['#63A37B','#F15645', '#7D7D7D']);

var color_eng = d3.scaleOrdinal(['#005282', '#336D90', '#6692AC']);

/* Add SVG */
var svg = d3.select(d3Container.current)
.attr('class', 'root_linechart')
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
  .append('g')
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var tooltip = d3.select('#tooltip');
  var tooltipLine = svg.append('line');

  var divTooltip = d3
        .select('body')
        .append('div')
        .attr('class', 'toolTip')
        .attr('font-size', '100px')


/* Add line into SVG */
var line = d3.line()
  .x(d => xScale(d.date))
  .y(d => yScale(d.price));

let lines = svg.append('g')
  .attr('class', 'lines');


lines.selectAll('.line-group')
  .data(data).enter()
  .append('g')
  .attr('class', 'line-group')  
  .append('path')
  .attr('class', 'line visible')  
  .attr('id', d=>d.name)
  .attr('d', d => line(d.values))
  .style('stroke', (d, i) => showSentiment?color(i):color_eng(i))
  .style('opacity', lineOpacity)
  


/*transparent lines*/
lines.selectAll('.line-group-transparent')
  .data(data).enter()
  .append('g')
  .attr('class', 'line-group-transparent')  
  .on("mouseover", function(d, i) {
      svg.append("text")
        .attr("class", "title-text")
        .style("fill", showSentiment?color(i):color_eng(i))        
        .text(showSentiment?d.sent_name:d.eng_name)
        .attr("text-anchor", "middle")
        .attr("x", (width-margin.left)/2)
        .attr("y", 15);
    })
  .on("mouseout", function(d) {
      svg.select(".title-text").remove();
    })
  .append('path')
  .attr('class', 'line')  
  .attr('d', d => line(d.values))
  .style("stroke-width", '8px')
  .style('stroke', (d, i) => showSentiment?color(i):color_eng(i))

  .style('opacity', '0')
  .on("mouseover", function(d) {
    d3.selectAll('.visible')
        .style('opacity', otherLinesOpacityHover);
    d3.selectAll('.circle')
        .style('opacity', circleOpacityOnLineHover);
    d3.select('#'+d.name)
      .style('opacity', lineOpacityHover)
      .style("stroke-width", lineStrokeHover)
      .style("cursor", "pointer");
  })
.on("mouseout", function(d) {
    d3.selectAll(".visible")
        .style('opacity', lineOpacity);
    d3.selectAll('.circle')
        .style('opacity', circleOpacity);
    d3.select('#'+d.name)
      .style("stroke-width", lineStroke)
      .style("cursor", "none");
  });
  


/* Add circles in the line */
lines.selectAll("circle-group")
  .data(data).enter()
  .append("g")
  .style("fill", (d, i) => showSentiment?color(i):color_eng(i))
  .selectAll("circle")
  .data(d => d.values).enter()
  .append("g")
  .attr("class", "circle")  
  .append("circle")
  .attr("cx", d => xScale(d.date))
  .attr("cy", d => yScale(d.price))
  .attr("r", circleRadius)
  .style('opacity', circleOpacity)
  

/* Add transoarent circles */
lines.selectAll("circle-group")
  .data(data).enter()
  .append("g")
  .selectAll("circle")
  .data(d => d.values).enter()
  .append("g")
  .attr("class", "circle")  
  .on("mouseover", function(d){drawTooltip(d.date)})
  .on("mouseout", 
    function(d){
    removeTooltip()
    divTooltip.style('display', 'none')
    })
  .append("circle")
  .attr("cx", d => xScale(d.date))
  .attr("cy", d => yScale(d.price))
  .attr("r", 6)
  .style('opacity', '0')
  .on("mouseover", function(d) {
        d3.select(this)
          .transition()
          .duration(duration)
          .attr("r", circleRadiusHover);
      })
    .on("mouseout", function(d) {
        d3.select(this) 
          .transition()
          .duration(duration)
          .attr("r", circleRadius);  
      });


/* Add Axis into SVG */
var xAxis = d3.axisBottom(xScale)
            .ticks(5);

var yAxis = d3.axisLeft(yScale)
            .ticks(5)
            .tickFormat(function(d) {return d+ "%"});

svg.append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${height-margin.bottom})`)
  .call(xAxis)
  .selectAll(".tick text")
  .call(wrap, 20)

svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .append('text')
  .attr("y", 15)
  .attr('x', 5)
  .attr("text-anchor", "start")
  .attr("transform", "rotate(-0)")
  .attr("fill", "#000")
  .text(showSentiment?'Sentiment [%]':'Engagement rate [%]');

function removeTooltip() {
    if (tooltip) tooltip.style('display', 'none');
    if (tooltipLine) tooltipLine.attr('stroke', 'none');
  }

  function drawTooltip(date) {

    var pos = 0
    var neg = 0
    var neu = 0

    var values = []
    data.forEach(element => {
        if(element.name === 'pos'){
            element.values.forEach(month=>{
                if (month.date === date){
                    pos = month.price
                    values.push({name:'pos', eng_name:'Comments', value:month.price})
                }
            })
        }
        if(element.name === 'neg'){
            element.values.forEach(month=>{
                if (month.date === date){
                    neg = month.price
                    values.push({name:'neg',eng_name:'Likes', value:month.price})

                }
            })
        }
        if(element.name === 'neu'){
            element.values.forEach(month=>{
                if (month.date === date){
                    neu = month.price
                    values.push({name:'neu', eng_name:'Shares', value:month.price})

                }
            })
        }
    });

    values.sort((a, b) => b.value - a.value);

      
    tooltipLine.attr('stroke', 'grey')
      .attr('x1', xScale(date))
      .attr('x2', xScale(date))
      .attr('y1', 0)
      .attr('y2', height-margin.bottom);
 
      divTooltip
      .style('left', d3.event.pageX+10+'px')
      .style('top', d3.event.pageY-25+'px')
      .style('display', 'inline-block')
      .html(showSentiment?
        values.map(item=>{
         return ('<span class=dot_'+(item.name)+'></span> '+(item.value) +'% </br>')
        })
        :
        values.map(item=>{
          return ('<span class=dot_'+(item.eng_name)+'></span> '+(item.eng_name)+': '+(item.value) +'% </br>')
         })
      
      )
 
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

    }, [choosenSentiment, showSentiment])

    return(
        <>
       
      <div className='lineContainer'>

        <div className='line_infoContainer'>
        <text style={{marginRight:'8px'}} className='NetFormula'> Showing change over time for: <strong>{choosenSentiment.name}</strong></text>

            <i className="fas fa-info-circle bar_info" data-tip data-for='linechartInfo'></i>
            <ReactTooltip id='linechartInfo' className="bar_infoTooltip" place="top" textColor='#4d4d4d' backgroundColor='#FFDFC3'>
             
              <p>The graph shows the engagemet rate or sentiment for <strong>all posts</strong> in the chosen category or channel per month</p>
              

            </ReactTooltip>        
          </div>

      <div className='linechartContainer'>
            <div className='lineDropdownContainer'>
              <select className='LinedropDown' onChange={e => handleOption(e)}>
                <option value='sent'>Sentiment</option>    
                <option value='eng'>Engagement</option>           
              </select>
            </div>
          

          
          
          <svg id='lineChart' width="440" height="220" ref={d3Container}></svg>
          </div>
          </div>
        </>
    )
}

export default LineChart

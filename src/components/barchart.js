import React, { useContext, useEffect, useRef, useReducer, useState, createContext } from "react";
import * as d3 from 'd3'
import ReactTooltip from 'react-tooltip';

import '../../node_modules/@ibm/plex/css/ibm-plex.css';
import '../style/barchart.css'
import {SentimentContext} from '../App'
import {HoverSentContext} from './graphContainer'
import {allPostsContext} from './graphContainer'
import {IsPostContext} from './graphContainer'
import {HoverContext} from "../App";
import {GroupByContext} from '../App'


const BarChart = () =>{

    const SentSentimentContext = useContext(SentimentContext);
    const {choosenSentiment, setChoosenSentiment} = SentSentimentContext

    const SentHoverSentContext = useContext(HoverSentContext)
    const {hoverSent, setHoverSent} = SentHoverSentContext

    const SentHoverContext = useContext(HoverContext);
    const {hover, setHover} = SentHoverContext

    const SentIsPostContext = useContext(IsPostContext)
    const {isPost, setIsPost} = SentIsPostContext

    const SentGroupByContext = useContext(GroupByContext);
    const {groupByChannel, setGroupByChannel} = SentGroupByContext

    //const [postData, setPostData] = useState([])
    //const [keys, setKeys] = useState([])
    //const [sent, setSent] = useState([])
    //const [eng, setEng] = useState([])

    const [showOnlyComments, setShowOnlyComments] = useState(false)

    const [showComments, setShowComments] = useState(true)
    const [showLikes, setShowLikes] = useState(true)
    const [showShares, setShowShares] = useState(true)


    const d3Container = useRef(null)

    var post_data = []
    var keys = []
    var sent = []
    var eng = []
  
   var stack_key_mapping={
    "Positive":"Sentiment",
    "Negative":"Sentiment",
    "Neutral":"Sentiment",
    "Comments":"Engagement",
    "Likes":"Engagement",
    "Shares":"Engagement"};

    const getPosts = (data, input) =>{
        if (!('children' in data)){
            keys.push(data.name)
            sent.push(data.pos)
            eng.push(data.comments)
            post_data.push({
                postname: data.name,
                values: [
                    //{name: 'Engagement', com:data.comments, like: data.likes, share: data.shares, post:data.name},
                    //{name: 'Sentiment', pos:data.pos, neg:data.neg, neu:data.neu, post:data.name}
                    {name:'Positive', value:data.pos, yoffset: data.pos, yscale:1, total:(data.pos+data.neg+data.neu), postName:data.name},
                    {name:'Negative', value:data.neg, yoffset:(data.neg+data.pos), yscale:1, total:(data.pos+data.neg+data.neu), postName:data.name},
                    {name:'Neutral', value:data.neu, yoffset:(data.pos+data.neg+data.neu), yscale:1, total:(data.pos+data.neg+data.neu), postName:data.name},

                    {name:'Comments', value:data.comments/(data.followers)*100, yoffset: data.comments/(data.followers)*100, yscale:0, total:(data.comments+data.likes+data.shares)/(data.followers)*100, postName:data.name, followers:data.followers},
                    {name:'Likes', value:data.likes/(data.followers)*100, yoffset:(data.comments+data.likes)/(data.followers)*100, yscale:0, total:(data.comments+data.likes+data.shares)/(data.followers)*100, postName:data.name, followers:data.followers},
                    {name:'Shares', value:data.shares/(data.followers)*100, yoffset: (data.comments+data.likes+data.shares)/(data.followers)*100, yscale:0, total:(data.comments+data.likes+data.shares)/(data.followers)*100, postName:data.name, followers:data.followers},
                ]
            })
        }
        else{
            data.children.forEach(child =>{
                getPosts(child)
            })
        }
    }


    /*
    const getPostsComment = (data) =>{
        if (!('children' in data)){
            keys.push(data.name)
            sent.push(data.pos)
            eng.push(data.comments)
            post_data.push({
                postname: data.name,
                values: [
                    //{name: 'Engagement', com:data.comments, like: data.likes, share: data.shares, post:data.name},
                    //{name: 'Sentiment', pos:data.pos, neg:data.neg, neu:data.neu, post:data.name}
                    {name:'Positive', value:data.pos, yoffset: data.pos, yscale:1, total:(data.pos+data.neg+data.neu), postName:data.name},
                    {name:'Negative', value:data.neg, yoffset:(data.neg+data.pos), yscale:1, total:(data.pos+data.neg+data.neu), postName:data.name},
                    {name:'Neutral', value:data.neu, yoffset:(data.pos+data.neg+data.neu), yscale:1, total:(data.pos+data.neg+data.neu), postName:data.name},

                    {name:'Comments', value:data.comments/(data.followers)*100, yoffset: data.comments/(data.followers)*100, yscale:0, total:data.comments/(data.followers)*100, postName:data.name, followers:data.followers},
                    
                ]
            })
        }
        else{
            data.children.forEach(child =>{
                getPostsComment(child)
            })
        }
    }
    */

    const handleHover = (type) =>{
        if(type === 'Likes' ||type === 'Comments' ||type === 'Shares'){
            setHoverSent('eng')
        }
        else{
            setHoverSent(type)
        }
    }

    const [btnText, setBtnText] = useState('Show only comments')
    const changeData = () =>{
        if(showOnlyComments === false){
            setShowOnlyComments(true)
            document.getElementById('change_button').className = 'groupButtonActive'
            setBtnText('Show all engagement')

        }
        else{
            setShowOnlyComments(false)
            document.getElementById('change_button').className = 'groupButtonInactive'
            setBtnText('Show only comments')
        }
    } 

    const [barFilter, setBarFilter] = useState('all')

    const handleFilter = (data) =>{
        if(barFilter === data){
            setBarFilter('all')
            
        }
        else{
            setBarFilter(data)
        }
    }
    
    getPosts(choosenSentiment)
    //getPostsComment(choosenSentiment)


    useEffect(()=>{
        d3.select(".root_barchart").selectAll('*').remove()
        d3.select(".legend").selectAll('*').remove()


    var margin = {top: 20, right: 40, bottom: 80, left: 60},
    width = 500 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

    var divTooltip = d3
        .select('body')
        .append('div')
        .attr('class', 'toolTip')
        .attr('font-size', '100px')

    var x0 = d3.scaleBand()
        .domain(groupByChannel? keys : keys.sort())
        .rangeRound([0, width])
        .padding(0.4);

    var x1 = d3.scaleBand()
        .domain(['Engagement','Sentiment'])
        .rangeRound([0, x0.bandwidth()])
        .padding(0.05);

        

    var y0 = d3.scaleLinear()
        .range([height, 0])
        //.domain([0,Math.max(...eng)]);
        .domain([0, d3.max(post_data, function(d){return barFilter==='Comments' ? d.values[3].value :
            barFilter==='Likes' ? d.values[4].value :
            barFilter==='Shares' ? d.values[5].value :
            d.values[3].value+d.values[4].value+d.values[5].value 
        })])
        /*
        .domain([0, d3.max(post_data, function(d) { return showOnlyComments ?d.values[3].value:
             d.values[3].value+d.values[4].value+d.values[5].value; })]);
             */
        //.domain([0, d3.max(post_data, function(d) { return d.values[3].value})]);


    var y1 = d3.scaleLinear()
        .range([height, 0])
        .domain([0,100]);
        

    var color = d3.scaleOrdinal(['#63A37B','#F15645', '#E5E5E5',
                                '#005282', '#336D90', '#6692AC']);

    var xAxis = d3.axisBottom(x0)
        //.scale(x0)
        .ticks(5);

    var yAxisLeft = d3.axisLeft(y0)
        //.scale(y0)
        .tickFormat(function(d) {return d3.format(".1%")(d/100)});

    var yAxisRight = d3.axisRight(y1)
       // .scale(y1)
        //.tickFormat(function(d) { return parseInt(d) });
        .tickFormat(function(d) {return d+ "%"});


    var svg = d3.select(d3Container.current)
        .attr('class', 'root_barchart')
   
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



    // Ticks on x-axis and y-axis
    var xAxisG = svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        
        .call(xAxis)
        //.selectAll(".tick text")
        //.call(wrap, x0.bandwidth())
        .selectAll("text")
        .style("text-anchor", "end")
        .style('font-size', '8px')
        .attr("dx", "1.2em")
        .attr("dy", "1em")
        .attr('overflow', 'visible')
        .attr("transform", "rotate(-20)")
        //.style('text-decoration', 'underline')
        .attr('fill', '#4d4d4d')

        xAxisG.select(".tick text")
        .attr('fill', '#005282');

    svg.append("g")
        .attr("class", "y0 axis")
        .call(yAxisLeft)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style("fill", "#005282")
        .text("Engagement rate");


    svg.select('.x axis')
    .selectAll('text')
    .style("fill","#07737F");

    svg.append("g")
        .attr("class", "y1 axis")
        .attr("transform", "translate(" + width + ",0)")
        .call(yAxisRight)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -16)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style("fill", "#63A37B")
        .text("Sentiment");

    svg.select('.y1.axis')
        .selectAll('.tick')
        .style("fill","#d0743c");
    // End ticks

    var graph = svg.selectAll(".date")
        .attr('class', 'graph')
        .data(post_data)
        //.enter()
        //.append("g")
        .join('g')
        .attr("class", "g")
        .attr("transform", function(d) { return "translate(" + x0(d.postname) + ",0)"; });
        
    graph.selectAll("rect")
        .data(function(d){return d.values})
        .join('rect')
        .attr("width", x1.bandwidth())
        .attr("x", function(d) { return x1(stack_key_mapping[d.name]); })
        //.attr("y", function(d) { return d.yscale==0 ?  y0(d.yoffset): y1(d.yoffset); })

        .attr("y", function(d) { return d.yscale==0 ?  
            barFilter === 'all' ? y0(d.yoffset) : y0(d.value)
            : y1(d.yoffset); })


        //.attr("height", function(d) { return height - (d.yscale==0 ? y0(d.value) : y1(d.value)); })

        /*
        .attr("height", function(d) { return showOnlyComments ? 
             height - (d.yscale==0 ? (d.name === 'Comments' ? y0(d.value) : height ): y1(d.value)):
             height - (d.yscale==0 ? y0(d.value) : y1(d.value))
             ; })
        */
       
        .attr("height", function(d) { return height - (d.yscale==0 ? 
            d.name === barFilter || 'all' === barFilter ? y0(d.value) : height
            
            : y1(d.value)); })

        .attr("fill-opacity", 
           (d)=> hover.length === 0 ? 1 : hover.includes(d.postName) ? 1 : 0.5
        )
        .style("fill", function(d) { return color(d.name); })
        //.style("cursor", "pointer")
        .on('mousemove', function(d){
            handleHover(d.name)
            divTooltip
            .style('left', d3.event.pageX+10+'px')
            .style('top', d3.event.pageY-25+'px')
            .style('display', 'inline-block')
            .html(stack_key_mapping[d.name] === 'Engagement'?
                '<strong>'+d.postName+'</strong></br>'+
                stack_key_mapping[d.name]+' rate: '+(d.total).toFixed(3)+'%'+'</br>'+d.name+': '+Math.round((d.value)*(d.followers))+' (rate: '+(d.value).toFixed(3)+'%)':
                '<strong>'+d.postName+'</strong></br>'+d.name+': '+d.value+' %')
        })
        .on('mouseout', function(d){
            setHoverSent('')
          divTooltip.style('display', 'none')
        })
        //.on('mouseover', function(d){console.log(d.postName)})

        

    // Legend
    
    var legend = svg.selectAll(".legend")
        .data(['Comments', 'Likes', 'Shares'].slice())
        //.enter()
        //.append("g")
        .join('g')
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(" + i * 60 + ", 0)"; });

    legend.append("rect")
        //.attr('x', function(d, i){return width -(20*i)})
        .attr("x", margin.right +5)
        .attr('y', -20)
        .attr("width", 14)
        .attr("height", 14)
        .attr('class', 'legendRect Active')
        .attr('cursor', 'pointer')
        .style("fill", color)
        .attr('fill-opacity', function(d){return barFilter === d ? 1:
            barFilter === 'all' ? 1: 0.3})
        .attr('id', function(d){return d})
        .on('click', function(d){handleFilter(d)})


    legend.append("text")
        .attr("x", margin.right)
        .attr("y", -14)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .attr('fill-opacity', function(d){return barFilter === d ? 1:
            barFilter === 'all' ? 1: 0.5})        
        .text(function(d) { return d; });

    var legend2 = svg.selectAll(".legend")
        .data(['Positive', 'Negative', 'Neutral'].slice())
        //.enter()
        //.append("g")
        .join('g')
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(" + i * 60 + ", 0)"; });

    legend2.append("rect")
        //.attr('x', function(d, i){return width -(20*i)})
        .attr("x", width -135)
        .attr('y', -20)
        .attr("width", 14)
        .attr("height", 14)
        .style("fill", color)

    legend2.append("text")
        .attr("x", width-140)
        .attr("y", -14)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });
        

    function wrap(text, width) {
        text.each(function() {
        var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em")
        while (word = words.pop()) {
            line.push(word)
            tspan.text(line.join(" "))
            if (tspan.node().getComputedTextLength() > width) {
                line.pop()
                tspan.text(line.join(" "))
                line = [word]
                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", `${++lineNumber * lineHeight + dy}em`).text(word)
            }
        }
        })
    }


    },[choosenSentiment, hover, barFilter]) // close useeffect

    return(
        <>
        <div className='barchartContainer'>

        <div className='bar_infoContainer'>
            <i className="fas fa-info-circle bar_info" data-tip data-for='barchartInfo'></i>
            <ReactTooltip id='barchartInfo' className="bar_infoTooltip" place="top" textColor='#4d4d4d' backgroundColor='#FFDFC3'>
             
              <p>Each group of bars represents a <strong>post</strong> in the choosen category or channel</p>
              <p>The legend on the left hand side can be used for <strong>filtering</strong> the bar chart</p>

              {isPost?
              <p>Hover over the bars to highlight the corresponding <strong>insight</strong></p>: null
            }


            </ReactTooltip>
          </div>
 
                <svg id='barChart' width="500" height="230" ref={d3Container}></svg>
                {isPost?
                <div className='infoTextBar'>
                    Hover over the bars to highlight the corresponding <strong>insight</strong>
                </div>:null}
        </div>
       

        </>
    )

}
export default BarChart
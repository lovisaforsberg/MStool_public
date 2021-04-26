import React, { useContext, useEffect, useRef, useReducer, useState, createContext } from "react";
import ReactTooltip from 'react-tooltip';
import * as d3 from 'd3'
import {SentimentContext} from '../App'
import {HoverContext} from '../App'
import '../style/netsentiment.css'
import {GroupByContext} from '../App'


const NetSentiment = () =>{

    const SentSentimentContext = useContext(SentimentContext);
    const {choosenSentiment, setChoosenSentiment} = SentSentimentContext
    //const [postData, setPostData] = useState([])

    const SentHoverContext = useContext(HoverContext);
    const {hover, setHover} = SentHoverContext

    const SentGroupByContext = useContext(GroupByContext);
    const {groupByChannel, setGroupByChannel} = SentGroupByContext

    // weights
    const [commentWeight, setCommentWeight] = useState(10)
    const [likeWeight, setLikeWeight] = useState(1)
    const [shareWeight, setShareWeight] = useState(20)

    const [useComment, setUseComment] = useState(true)
    const [useLike, setUseLike] = useState(true)
    const [useShare, setUseShare] = useState(true)

    const [includeNet, setIncludeNet] = useState(false)

    const [isSensitive, setIsSensitive] = useState(false)


    var postData = []
    const handleData = (data, variable) =>{
       
        if (!('children' in data)){
            if (variable == 'comments'){
                postData.push({
                    //value: (data.pos-data.neg)*data.comments, name:data.name
                    comment:data.comments, 
                    like: data.likes, 
                    share: data.shares, 
                    name: data.name,
                    pos:data.pos,
                    neg:data.neg,
                    followers: data.followers
                })
            }
            if (variable == 'likes'){
                postData.push({
                    value: (data.pos-data.neg)*data.likes, name:data.name
                })
            }
        }
        else{
            data.children.forEach(child =>{
                handleData(child, variable)
            })
        }
    }


    const handleCommentWeight = event => {
        setCommentWeight(event.target.value);
      };
    const handleLikeWeight = event => {
        setLikeWeight(event.target.value);
      };
    const handleShareWeight = event => {
        setShareWeight(event.target.value);
      };


    handleData(choosenSentiment, 'comments')


    const d3Container = useRef(null)

    useEffect(()=>{

        d3.select(".root_netsentiment").selectAll('*').remove()

        var margin = {top: 30, right: 10, bottom: 10, left: 60},
        width = 400 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

        const valueConstant = (d) =>{
            var constant = ((
                (useComment?(commentWeight*d.comment):1)
                +(useLike?(likeWeight*d.like):1)
                +(useShare?(shareWeight*d.share):1)
            )
                *(includeNet?(isSensitive?(d.pos-2*d.neg):(d.pos-d.neg)):1))

            var rate = ((constant/d.followers)*100).toFixed(2)

            return rate
        } 

        //var values = postData.map(function (d) {return d.value})
        var values = postData.map(function (d) {return valueConstant(d)})

        var keys = postData.map(function (d) {return d.name})
        
        //var maxHeight=d3.max(values);
        //var minHeight=d3.min(values)  

        var maxHeight=Math.max(...values);
        var minHeight=Math.min(...values) 

    
    //set y scale
	var yScale = d3.scaleLinear()
    .rangeRound([0,height])
    .domain([maxHeight,-maxHeight])
	
    //add x axis
	var xScale = d3.scaleBand()
    .rangeRound([0,width])
    .padding(0.5)
	.domain(groupByChannel? keys : keys.sort())

    var yAxisScale = d3.axisLeft(yScale)
    //.tickFormat(function(d) { return parseInt(d) });
    .tickFormat(function(d) {return d+ "%"});


    
    var xAxisScale = d3.axisBottom(xScale);/*.tickFormat("");remove tick label*/

    var divTooltip = d3
        .select('body')
        .append('div')
        .attr('class', 'toolTip')
        .attr('font-size', '100px')
	

    var svg = d3.select(d3Container.current)
                .attr('class', 'root_netsentiment')
                .append("svg")
				.attr("width",width+margin.left+margin.right)
				.attr("height",height+margin.top+margin.bottom)
				.append("g")  //add group to leave margin for axis
				.attr("transform","translate("+margin.left+","+margin.top+")");

    var bars = svg.selectAll("rect")
                .data(postData)
                .enter()
                .append("rect")
                .attr("x",function(d,i){return xScale(d.name);})
                .attr("y",function(d){if(valueConstant(d)<0){return height/2;}

                                else{return yScale(
                                    valueConstant(d)
                                    );}})//for bottom to top
                
                .attr("width", xScale.bandwidth()/*width/dataset.length-barpadding*/)
                .attr("height", function(d){return height/2 -yScale(Math.abs(
                    valueConstant(d)
                    ));})

                .attr("fill-opacity", 
                    (d)=> hover.length === 0 ? 1 : hover.includes(d.name) ? 1 : 0.5
                )
                
                .attr("fill",function(d){return valueConstant(d) > 0 ? '#63A37B' : 'rgb(241, 86, 69)'})
                //.style("cursor", "pointer")
                .on('mousemove', function(d){
                    divTooltip
                    .style('left', d3.event.pageX+10+'px')
                    .style('top', d3.event.pageY-25+'px')
                    .style('display', 'inline-block')
                    .html('<strong>'+d.name+'</strong>'+'<br/> Performance: '+
                    valueConstant(d)+' %'
                    )
                })
                .on('mouseout', function(d){
                    divTooltip.style('display', 'none')
                })
                        
	
	//add x and y axis
	var yAxis = svg.append("g")
        .attr("class", "y axis")
        .call(yAxisScale)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style("fill", "#4d4d4d")
        .text("Peformance [%]")
    

	
	svg.append("g")
        .attr("class", "x axis")
        .call(xAxisScale)
        .attr("transform", "translate(0,"+height/2+")")
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "1.2em")
        .attr("dy", "1em")
        .attr('overflow', 'visible')
        .attr("transform", "rotate(-45)")
        .style('font-size', '8px')
        //.style('text-decoration', 'underline')
        .attr('fill', '#4d4d4d')
        //.style('cursor', 'pointer')
        //.on('mouseover', function(d){d3.select(this).style('font-size', '12px')})
        //.on('mouseout', function(d){d3.select(this).style('font-size', '8px')})

        //.call(wrap, 0)
        
    
	


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
     




        /*
        var margin = {top: 30, right: 10, bottom: 50, left: 50},
        width = 150,
        height = 150;
		
        var data = [{value: 10, dataset:"barbaz"},
        {value: 40, dataset:"barbar"},
        {value: -10, dataset:"foobaz"},
        {value: 50, dataset:"foobar"},
        ];

        // Add svg to
        var svg = d3.select(d3Container.current)
        .attr('class', 'root_netsentiment')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        // set the ranges
        var y = d3.scaleBand()
            .range([height, 0])
            .padding(0.1);

        var x = d3.scaleLinear()
            //.range([0, width])
            .rangeRound([margin.left, width - margin.right])

        // Scale the range of the data in the domains
        x.domain(d3.extent(post_data, function (d) {return d.value;}));
        
        y.domain(post_data.map(function (d) {
            return d.name;
        }));

        var xAxis = d3.axisBottom(x)
        .ticks(5)

        var yAxis = d3.axisRight(y)

        // append the rectangles for the bar chart
        svg.selectAll(".bar")
            .data(post_data)
            .enter().append("rect")
            .attr("class", function (d) {
                return "bar bar--" + (d.value < 0 ? "negative" : "positive");
            })
            .attr("x", function (d) {
                return x(Math.min(0, d.value));
            })
            .attr("y", function (d) {
                return y(d.name);
            })
            .attr("width", function (d) {
                return Math.abs(x(d.value) - x(0));
            })
            .attr("height", y.bandwidth());

        // add the x Axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll(".x.axis text")
            .style("fill","#4d4d4d")

        // add the y Axis
        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + x(0) + ",0)")
            .call(yAxis)
            .selectAll(".y.axis text")
            .style("fill","#4d4d4d")

       */ 

    }, [choosenSentiment, 
        hover, 
        useComment, 
        useLike, 
        useShare, 
        commentWeight,
        likeWeight,
        shareWeight,
        includeNet,
        isSensitive]) // close useeffect

    return(
        <>
        {/*
        <div className='btnContainer'>
          <button id='cha_button' className='groupButtonActive' onClick={()=>handleChangeData(choosenSentiment,'comments')}>Comments</button>
          <button id='cat_button' className='groupButtonInactive' onClick={()=>handleChangeData(choosenSentiment,'likes')}>Likes</button>
        </div>
        */}
            <div className='NetContainer'>
                <div className="graphContainer">
                    <svg id='netSentiment' width={400} height={200} ref={d3Container}></svg> 
                </div>

                <div className='textContainerNet'>
                    <div className='NetHeadline'>Performance Score
                        <i className="fas fa-info-circle checkbox_info" data-tip data-for='scoreInfo' style={{marginLeft:'10px'}}></i>
                            <ReactTooltip id='scoreInfo' className="bar_infoTooltip" place="top" textColor='#4d4d4d' backgroundColor='#FFDFC3'>
                                <p>The score is ment to be used to <strong>compare posts</strong> with each other.</p>
                            </ReactTooltip>
                    </div>
                    
                    <div className='NetFormula'>
                        
                        <div>the Performane score is showing how well a post has performed in terms of <strong>engagement and sentiment.</strong></div>
                    </div>

                    

                    <div className="AllCheckboxContainer">
                        <div className='checkboxInfoContainer'>
                            <i className="fas fa-info-circle checkbox_info" data-tip data-for='checkBoxInfo'></i>
                                <ReactTooltip id='checkBoxInfo' className="bar_infoTooltip" place="top" textColor='#4d4d4d' backgroundColor='#FFDFC3'>
                                    <p>Use the checkboxes to determine what <strong>engagement metrices</strong> to incude in the performance score</p>
                                    <p>If, for example, you believe that a comment is worth twice as much as a like, set the comment to 2 and the like to 1</p>
                                </ReactTooltip>
                        </div>

                        <div className={useLike?'CheckboxActive':'CheckboxInactive'}>
                            <div>
                                <input type="checkbox" 
                                        name="foo" 
                                        value="com" 
                                        id="foo_com"
                                        checked={useLike}
                                        onChange={()=>setUseLike(!(useLike))}/>
                                <label className='checkLabel' for="foo_com">Likes</label>
                            </div>

                            
                            <div className='weightText'>One like is worth:</div>
                            {/*<button className='weightBtn'>-</button>*/}
                            <input className='weightInput' 
                                    type="number" 
                                    onChange={handleLikeWeight}
                                    value={likeWeight}
                                    />
                        
                        </div>

                        <div className={useComment?'CheckboxActive':'CheckboxInactive'}>
                            <div>
                                <input type="checkbox" 
                                        name="foo" 
                                        value="com" 
                                        id="foo_com"
                                        checked={useComment}
                                        onChange={()=>setUseComment(!(useComment))}/>
                                <label className='checkLabel' for="foo_com">Comment</label>
                            </div>

                            <div className='weightText'>One comment is worth:</div>
                            {/*<button className='weightBtn'>-</button>*/}
                            <input className='weightInput' 
                                    type="number" 
                                    onChange={handleCommentWeight}
                                    value={commentWeight}
                                    />
                        
                        </div>

                        <div className={useShare?'CheckboxActive':'CheckboxInactive'}>
                            <div>
                                <input type="checkbox" 
                                        name="foo" 
                                        value="com" 
                                        id="foo_com"
                                        checked={useShare}
                                        onChange={()=>setUseShare(!(useShare))}/>
                                <label className='checkLabel' for="foo_com">Shares</label>
                            </div>

                            
                            <div className='weightText'>One share is worth:</div>
                            {/*<button className='weightBtn'>-</button>*/}
                            <input className='weightInput' 
                                    type="number" 
                                    onChange={handleShareWeight}
                                    value={shareWeight}
                                    />
                        
                        </div>

                    </div>

                    <button id='cha_button' className={includeNet?'netButtonActive':'netButtonInactive'} onClick={()=>setIncludeNet(!includeNet)}>{includeNet?'Remove Net Sentiment': 'Include Net Sentiment'} </button>
                    <i className="fas fa-info-circle bar_info" data-tip data-for='NetSentInfo'></i>
                        <ReactTooltip id='NetSentInfo' className="bar_infoTooltip" place="top" textColor='#4d4d4d' backgroundColor='#FFDFC3'>
             
                            <p>By including Net Sentiment, the <strong>sentiment</strong> of the post will be considered.</p>
                            <p>A <strong>negative score </strong>indicates that the post got more negative than positive feedback.</p>

                        </ReactTooltip>
                    {includeNet?
                    <>
                    {/*
                        <div className='NetFormula'>
                            <span>Engagement *</span>(
                            <span> 1x Positive</span>  -
                            <span>{isSensitive?'2':'1'}x Negative</span>)
                        </div>
                            */}
                        
                        <div className='markBtnContainer'>
                            <button id='cha_button' className={isSensitive?'netButtonActiveRed':'netButtonInactive'} onClick={()=>setIsSensitive(!isSensitive)}>{isSensitive?'Unmark as sensitive': 'Mark as sensitive'}</button>
                            <i className="fas fa-info-circle bar_info" data-tip data-for='sensitiveInfo'></i>
                            <ReactTooltip id='sensitiveInfo' className="bar_infoTooltip" place="top" textColor='#4d4d4d' backgroundColor='#FFDFC3'>
                
                                <p>If the subject of the category or post is sensitive, each negative comment can <strong>cause more harm</strong> than for a regular post.</p>
                                <p>By marking the post/category as sensitive, you will need two positive comments to <strong>outweigh</strong> one negative comment.</p>


                            </ReactTooltip>
                        </div>

                    </>
                    :null}

                    



                </div>
            </div>
           

        </>
    )
}

export default NetSentiment
import React, { useContext, useEffect, useRef, useReducer, useState, createContext } from "react";
import * as d3 from 'd3'
import './linechart.css'
import {SentimentContext} from '../App'
import {HoverSentContext} from './graphContainer'
import '../style/piechart.css'


/*
avg value to put in csv
avg,30,4,66,27,5,68,23,9,67
*/

const PieChart = ()=> {

    const SentSentimentContext = useContext(SentimentContext);
    const {choosenSentiment, setChoosenSentiment} = SentSentimentContext

    const SentHoverSentContext = useContext(HoverSentContext)
    const {hoverSent, setHoverSent} = SentHoverSentContext

    const d3Container = useRef(null)

    useEffect(()=>{
    
        d3.select(".root_piechart").selectAll('*').remove()

        var totals = [{
            title: "Positive",
            value: 30,
        },
        {
            title: "Negative",
            value: 20,
        },
        {
            title: "Neutral",
            value: 70,
        }
    ];

        var width = 100;
        var height = 100;
        var radius = Math.min(width, height) / 2;
        var donutWidth = 20;
        var color = d3.scaleOrdinal()
            .range(['#63A37B','#F15645', '#E5E5E5']);
        
        var svg = d3.select(d3Container.current)
        .attr('class', "root_piechart")
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(' + (width / 2) +
                ',' + (height / 2) + ')');
        
        var arc = d3.arc()
            .innerRadius(radius - donutWidth)
            .outerRadius(radius);
        
        var pie = d3.pie()
            .value(function (d) {
                return d.value;
            })
            .sort(null);
        
        var legendRectSize = 13;
        var legendSpacing = 7;
        
        var donutTip = d3.select("body").append("div")
            .attr("class", "donut-tip")
            .style("opacity", 0);
        
        var path = svg.selectAll('path')
            .data(pie(choosenSentiment.sentiment))
            .enter()
            .append('path')
            //.style("cursor", "pointer")
            .attr('d', arc)
            .attr('fill', function (d, i) {
                return color(d.data.title);
            })
            .attr('transform', 'translate(0, 0)')
            .on('mouseover', function (d, i) {
                /*
                d3.select(this).transition()
                    .duration('50')
                    .attr('opacity', '.85');
                donutTip.transition()
                    .duration(50)
                    .style("opacity", 1);
                let num = (Math.round((d.value / d.data.all) * 100)).toString() + '%';
                donutTip.html(num)
                    .style("left", (d3.event.pageX + 10) + "px")
                    .style("top", (d3.event.pageY - 15) + "px");
                */
               d3.select('.value_text').remove()
               svg.append('text')
               .attr('class', 'value_text')
               .attr('x', legendRectSize + legendSpacing)
               .attr('y', legendRectSize - legendSpacing)
               .attr('font-size', '15px')
               .attr('text-anchor', 'middle')
               .attr('fill', '#4d4d4d')
               .text(d.data.title+ ': '+Math.round(d.data.value)+' %')
               .call(wrap)
                setHoverSent(d.data.title)

        
            })
            .on('mouseout', function (d, i) {
                setHoverSent('')
                d3.select(this).transition()
                    .duration('50')
                    .attr('opacity', '1');
                donutTip.transition()
                    .duration('50')
                    .style("opacity", 0);
                
            });
        
        /*
        var legend = svg.selectAll('.legend')
            .data(color.domain())
            .enter()
            .append('g')
            .attr('class', 'circle-legend')
            .attr('transform', function (d, i) {
                var height = legendRectSize + legendSpacing;
                var offset = height * color.domain().length / 2;
                var horz = -2 * legendRectSize - 13;
                var vert = i * height - offset;
                return 'translate(' + horz + ',' + vert + ')';
            });
        
        legend.append('circle')
            .style('fill', color)
            .style('stroke', color)
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', '.5rem');
        
        legend.append('text')
            .attr('x', legendRectSize + legendSpacing)
            .attr('y', legendRectSize - legendSpacing)
            .text(function (d) {
                return d;
            });
        */
        
        function change(data) {
            var pie = d3.pie()
                .value(function (d) {
                    return d.value;
                }).sort(null)(data);
        
            var width = 360;
            var height = 360;
            var radius = Math.min(width, height) / 2;
            var donutWidth = 75;
        
            path = d3.select("#donut")
                .selectAll("path")
                .data(pie); // Compute the new angles
            var arc = d3.arc()
                .innerRadius(radius - donutWidth)
                .outerRadius(radius);
            path.transition().duration(500).attr("d", arc); // redrawing the path with a smooth transition
        }

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
        
        

    }) // close useeffect

    return(
      <>
      <div className='pieContainer'>
          <div className='pieHeadline'>Total sentiment for {choosenSentiment.name}</div>
        <svg id='pieChart' width="100" height="100" ref={d3Container}></svg>

      </div>

        </>
    )
}

export default PieChart; 

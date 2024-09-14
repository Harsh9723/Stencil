import React from 'react'
import { useRef, useEffect } from 'react';

function TestSvg() {


    const svg = `svgfile <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  version="1.1" preserveAspectRatio="xMidYMid meet" viewBox="0 0 75 166" id="10000"   >
<!--For Scale and Centering, change translate X = (x*(1-scale))/2 and Y = (y*(1-scale))/2 then scale factor-->
<g ID="SVGBody" transform="translate(0 0) scale(1) " buffered-rendering="static">
<g transform="scale(0.0750) translate(-133,-133)">
<!-- Copyright NetZoom, Inc. -->
<!-- NetZoom SVG version 2021 -->
<!-- 3MTS0042 -->

<style type="text/css"><![CDATA[
text {stroke:none;}
.SVGPort{
}
.SVGPvt{
}
.SVGNext{
}
.SVGSlot{
}
.SVGLoc{
stroke-width:5; 
stroke:black;
fill:gray;
}
.LocLabel{
stroke: none;	
font-size: 60pt;
font-family: Arial, sanserif;
fill:black;
}
.SVGPart{
stroke-width:1; 
stroke: none;
opacity:0;
}
.SVGBlockedPort{
fill:  blue;
opacity:0.5;
}
.SVGConnPort{
fill:yellow;
opacity:0.5;
}
.SVGAvailPort{
fill:green;
opacity:0.5;
}
.SVGBlockedSlot{
fill:  blue;
opacity:0.75;
}
.SVGHid{
stroke-width:1; 
stroke: none;
fill:gray;
opacity:1;
}
.SVGGray{
stroke-width:1; 
stroke: none;
fill:lightgray;
opacity:0.85;
}
.SVGSel{
fill: red;
stroke: red;
stroke-dasharray: 3;
stroke-width: 4;
opacity: 0.5;
}
.SVGSel.SVGHid{
fill: red;
stroke: red;
stroke-dasharray: 3;
stroke-width: 4;
opacity: 1;
}   
.SelItem{
fill: red;
stroke: red;
stroke-dasharray: 3;
stroke-width: 4;
opacity: 0.5;
}  

]]>
</style>

<defs>

<svg id="3MTS0042-151" preserveAspectRatio="none">
<g transform="scale(0.2500,0.2500)">
<g transform="translate(-624,-192)">
<!--Part 3mts0042 -->
  <polygon points="4579, 8999 626, 8999 626, 8972 4579, 8972 4579, 8999 " style=" fill: #d6d6b1; fill-rule: evenodd; stroke: #000000;  stroke-width: 1.024000;"/>
  <polygon points="4579, 221 626, 221 626, 248 4579, 248 4579, 221 " style=" fill: #d6d6b1; fill-rule: evenodd; stroke: #000000;  stroke-width: 1.024000;"/>
  <polygon points="4601, 248 626, 248 626, 8972 4601, 8972 4601, 248 " style=" fill: #d6d6b1; fill-rule: evenodd; stroke: #000000;  stroke-width: 4.992000;"/>
  <polygon points="4601, 194 626, 194 626, 221 4601, 221 4601, 194 " style=" fill: #d6d6b1; fill-rule: evenodd; stroke: #000000;  stroke-width: 4.992000;"/>
  <polygon points="4601, 9026 626, 9026 626, 8999 4601, 8999 4601, 9026 " style=" fill: #d6d6b1; fill-rule: evenodd; stroke: #000000;  stroke-width: 4.992000;"/>
  <polygon points="653, 221 626, 221 626, 8999 653, 8999 653, 221 " style=" fill: #d6d6b1; fill-rule: evenodd; stroke: #000000;  stroke-width: 4.992000;"/>
  <path d="M 632, 4572  C 632, 4572 626, 4572 626, 4572 626, 4572 626, 4749 626, 4749 626, 4749 632, 4749 632, 4749 632, 4749 632, 4749 632, 4749 632, 4749 628, 4824 653, 4824 653, 4824 653, 4824 653, 4824 653, 4824 653, 4497 653, 4497 628, 4497 632, 4572 632, 4572 " style=" fill: #ffffff; fill-rule: evenodd; stroke: #000000;  stroke-width: 1.024000;"/>
  <polygon points="4294, 8776 4256, 8776 4256, 8562 4294, 8562 4294, 8776 " style=" fill: #ffffff; fill-rule: evenodd; stroke: #000000;  stroke-width: 1.024000;"/>
  <polygon points="4498, 8423 4460, 8423 4460, 8208 4498, 8208 4498, 8423 " style=" fill: #ffffff; fill-rule: evenodd; stroke: #000000;  stroke-width: 1.024000;"/>
  <polygon points="4294, 443 4256, 443 4256, 658 4294, 658 4294, 443 " style=" fill: #ffffff; fill-rule: evenodd; stroke: #000000;  stroke-width: 1.024000;"/>
  <polygon points="4498, 797 4460, 797 4460, 1011 4498, 1011 4498, 797 " style=" fill: #ffffff; fill-rule: evenodd; stroke: #000000;  stroke-width: 1.024000;"/>
  <line x1="3406.000000" y1="248.000000" x2="3406.000000" y2="280.000000"  style=" stroke: #000000;  stroke-width: 1.024000;"/>
  <line x1="2397.000000" y1="248.000000" x2="2397.000000" y2="280.000000"  style=" stroke: #000000;  stroke-width: 1.024000;"/>
  <line x1="3406.000000" y1="8940.000000" x2="3406.000000" y2="8972.000000"  style=" stroke: #000000;  stroke-width: 1.024000;"/>
  <line x1="2397.000000" y1="8940.000000" x2="2397.000000" y2="8972.000000"  style=" stroke: #000000;  stroke-width: 1.024000;"/>
  <polyline points="2612, 4544 2482, 4544 2482, 4643 2612, 4643 " style=" fill: none; stroke: #000000;  stroke-width: 1.024000;"/>
  <polygon points="2573, 4544 2569, 4544 2569, 4643 2573, 4643 2573, 4544 " style=" fill: #000000; fill-rule: evenodd; stroke: #000000;  stroke-width: 1.024000;"/>
  <polyline points="2612, 7842 2482, 7842 2482, 7942 2612, 7942 " style=" fill: none; stroke: #000000;  stroke-width: 1.024000;"/>
  <polygon points="2573, 7842 2569, 7842 2569, 7942 2573, 7942 2573, 7842 " style=" fill: #000000; fill-rule: evenodd; stroke: #000000;  stroke-width: 1.024000;"/>
  <polyline points="2612, 1277 2482, 1277 2482, 1378 2612, 1378 " style=" fill: none; stroke: #000000;  stroke-width: 1.024000;"/>
  <polygon points="2573, 1277 2569, 1277 2569, 1378 2573, 1378 2573, 1277 " style=" fill: #000000; fill-rule: evenodd; stroke: #000000;  stroke-width: 1.024000;"/>
  <circle cx="2476.000000" cy="340.000000" r="34.000000"  style=" fill: #ffffff; fill-rule: evenodd; stroke: #000000;  stroke-width: 1.024000;"/>
  <circle cx="2476.000000" cy="8892.000000" r="34.000000"  style=" fill: #ffffff; fill-rule: evenodd; stroke: #000000;  stroke-width: 1.024000;"/>
  <path d="M 1506, 621  C 1506, 621 1506, 569 1506, 569 1506, 557 1517, 546 1532, 546 1532, 546 1532, 546 1532, 546 1545, 546 1558, 557 1558, 569 1558, 569 1558, 621 1558, 621 1558, 621 1558, 621 1558, 621 1579, 635 1597, 662 1597, 688 1597, 722 1571, 755 1532, 755 1491, 755 1467, 722 1467, 688 1467, 662 1485, 635 1506, 621 1506, 621 1506, 621 1506, 621 " style=" fill: #ffffff; fill-rule: evenodd; stroke: #000000;  stroke-width: 1.024000;"/>
  <path d="M 3673, 621  C 3673, 621 3673, 569 3673, 569 3673, 557 3686, 546 3699, 546 3699, 546 3699, 546 3699, 546 3714, 546 3725, 557 3725, 569 3725, 569 3725, 621 3725, 621 3725, 621 3725, 621 3725, 621 3746, 635 3764, 662 3764, 688 3764, 722 3740, 755 3699, 755 3660, 755 3634, 722 3634, 688 3634, 662 3652, 635 3673, 621 3673, 621 3673, 621 3673, 621 " style=" fill: #ffffff; fill-rule: evenodd; stroke: #000000;  stroke-width: 1.024000;"/>
  <path d="M 1506, 8669  C 1506, 8669 1506, 8617 1506, 8617 1506, 8605 1517, 8594 1532, 8594 1532, 8594 1532, 8594 1532, 8594 1545, 8594 1558, 8605 1558, 8617 1558, 8617 1558, 8669 1558, 8669 1558, 8669 1558, 8669 1558, 8669 1579, 8683 1597, 8710 1597, 8736 1597, 8770 1571, 8803 1532, 8803 1491, 8803 1467, 8770 1467, 8736 1467, 8710 1485, 8683 1506, 8669 1506, 8669 1506, 8669 1506, 8669 " style=" fill: #ffffff; fill-rule: evenodd; stroke: #000000;  stroke-width: 1.024000;"/>
  <path d="M 3673, 8669  C 3673, 8669 3673, 8617 3673, 8617 3673, 8605 3686, 8594 3699, 8594 3699, 8594 3699, 8594 3699, 8594 3714, 8594 3725, 8605 3725, 8617 3725, 8617 3725, 8669 3725, 8669 3725, 8669 3725, 8669 3725, 8669 3746, 8683 3764, 8710 3764, 8736 3764, 8770 3740, 8803 3699, 8803 3660, 8803 3634, 8770 3634, 8736 3634, 8710 3652, 8683 3673, 8669 3673, 8669 3673, 8669 3673, 8669 " style=" fill: #ffffff; fill-rule: evenodd; stroke: #000000;  stroke-width: 1.024000;"/>
</g>
</g>
</svg>

</defs>

<g ID="SVGUse" >
<g>
  <use xlink:href="#3MTS0042-151" x="133" y="133" width="995" height="2209"/>
  <rect class="SVGPart" x="133" y="133" width="995" height="2209"/>
</g>
</g>
</g>
</g>

</svg> `

const svgRef = useRef(null);

useEffect(() => {
  // Initialize Office.js when it's ready
  Office.onReady(() => {
    console.log('Office is ready');
  });
}, []);

// Function to handle double-click and insert the SVG into Word
const handleDoubleClick = async () => {
  try {
    const svgHtml = `<img src="data:image/svg+xml;base64,${btoa(svg)}" alt="SVG Image" />`;
    await Office.context.document.setSelectedDataAsync(svgHtml, {
      coercionType: Office.CoercionType.Html,
    });
  } catch (error) {
    console.error('Error inserting SVG into Word:', error);
  }
};

// Function to handle drag-and-drop into Word
const handleDragStart = (e) => {
  e.dataTransfer.setData('text/html', svg);
};
  return (
    <div>
    <div
      ref={svgRef}
      onDoubleClick={handleDoubleClick}
      onDragStart={handleDragStart}
      draggable="true"
      dangerouslySetInnerHTML={{ __html: svg }}
      style={{ width: '100px', height: '100px', cursor: 'pointer' }}
    />
    <div>Double-click or drag the image into Word</div>
  </div>
  )
}

export default TestSvg
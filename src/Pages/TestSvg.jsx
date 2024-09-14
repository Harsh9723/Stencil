import React, { useRef, useEffect } from 'react';

function TestSvg() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="40" stroke="black" stroke-width="2" fill="red" />
  </svg>`;

  const svgRef = useRef(null);

  useEffect(() => {
    // Initialize Office.js when it's ready
    Office.onReady(() => {
      console.log('Office is ready');
    });
  }, []);
  const handleDoubleClick = async () => {
    try {
      await Office.context.document.setSelectedDataAsync(svg, {
        coercionType: Office.CoercionType.XmlSvg,
      });
    } catch (error) {
      console.error('Error inserting SVG into Word:', error);
    }
  };
  // Function to handle double-click and insert the SVG into Word
 // Function to handle drag-and-drop into Word
const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', ''); // Required for drag-and-drop to work in some browsers
  };
  
  // Function to handle drop into Word
  const handleDrop = async (e) => {
    e.preventDefault();
  
    try {
      await Office.context.document.setSelectedDataAsync(svg, {
        coercionType: Office.CoercionType.XmlSvg,
      });
      console.log('SVG inserted into Word');
    } catch (error) {
      console.error('Error inserting SVG into Word:', error);
    }
  };
  
  // Function to prevent default dragover behavior (necessary for drop event)
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  // Adding event listeners to handle the drag and drop events
  document.addEventListener('dragover', handleDragOver);
  document.addEventListener('drop', handleDrop);
  
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
      <div style={{color: 'greenyellow'}}>Double-click or drag the image into Word</div>
    </div>
  );
}

export default TestSvg;

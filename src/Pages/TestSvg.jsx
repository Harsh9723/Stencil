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
  );
}

export default TestSvg;

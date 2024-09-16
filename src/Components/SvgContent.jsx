import React, { useEffect, useRef } from 'react';
import { styled } from '@mui/system';
import { Card } from '@mui/material';

// Styled component for the SVG card
const StyledSvgCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#778899',
  marginTop: '20px',
  borderRadius: '8px',
  color: 'white',
  fontSize: '12px',
  fontFamily: 'Segoe UI, sans-serif',
  padding: '20px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    marginTop: '10px',
    padding: '10px',
  },
}));

const SvgWrapper = styled('div')(({ theme }) => ({
  margin: '0 auto',
  width: '100%',
  maxHeight: '325px',
  maxWidth: '80%',
  '& svg': {
    width: '100%',
    height: 'auto',
    maxHeight: '325px',
    [theme.breakpoints.down('md')]: {
      maxHeight: '250px',
    },
    [theme.breakpoints.down('sm')]: {
      maxHeight: '200px',
    },
  },
  fontSize: '12px',
  fontFamily: 'Segoe UI, sans-serif',
}));

const SvgContent = ({ svgContent }) => {
  // Handle drag start and convert SVG content to base64


  useEffect(() => {
    Office.onReady((info) => {
      if (info.host === Office.HostType.Word) {
        console.log('Office.js is ready');
      }
    });
  }, []);
  

  // Handle drop on Word
  const handleDragStart = async () => {
    // e.preventDefault(); // Prevent default behavior
   try {
    await Office.context.document.setSelectedDataAsync(svgContent,{
      coercionType : Office.CoercionType.XmlSvg
    })
    console.log('inserted via drag and drop')
   } catch (error) {
    console.log('error while drang and drop')
   }
  };

  const svg = useRef(null)

const handleDoubleClick =async () => {
  try{
await Office.context.document.setSelectedDataAsync(svgContent,{
  coercionType: Office.CoercionType.XmlSvg,
})
  }catch(error){
    console.error("error on doubleclick")
  }
}
  


  return (
    <StyledSvgCard>
      <SvgWrapper
      ref={svg}
        draggable
        // onDragStart={handleDragStart} // Handle drag start for drag-and-drop
        onDragOver={(e) => {
          e.preventDefault(); 
          console.log('Dragging over the target'); // Track dragging over
        }} // Allow drop
        onDragStart={handleDragStart} // Handle drop
        onDoubleClick={handleDoubleClick} // Handle double-click
        dangerouslySetInnerHTML={{ __html: svgContent }} // Display SVG
      />
    </StyledSvgCard>
  );
};

export default SvgContent;

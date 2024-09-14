import React, { useEffect } from 'react';
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
  const handleDragStart = (e) => {
    // Convert SVG content to a base64 string
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result.split(',')[1]; // Extract base64 string
      e.dataTransfer.setData('image/svg+xml', base64data); // Set data for drag event
      e.dataTransfer.dropEffect = 'copy';
    };
    reader.readAsDataURL(svgBlob); // Convert Blob to Data URL
  };

  const handleDropOnWord = async (e) => {
    e.preventDefault(); // Prevent default behavior
    try {
      const base64data = e.dataTransfer.getData('image/svg+xml');
      if (base64data) {
        const imageUrl = `data:image/svg+xml;base64,${base64data}`;
        await Office.context.document.setSelectedDataAsync(imageUrl, {
          coercionType: Office.CoercionType.Image,
        }, (result) => {
          if (result.status === Office.AsyncResultStatus.Succeeded) {
            console.log('SVG image inserted into Word document.');
          } else {
            console.error('Error inserting SVG into Word document:', result.error);
          }
        });
      }
    } catch (error) {
      console.error('Failed to insert SVG into Word:', error);
    }
  };

  const handleInsertText = () => {
    const textToInsert = "Hello, this text was inserted from a React app!";
    
    // Insert the text into the Word document
    Office.context.document.setSelectedDataAsync(svgContent, {
      coercionType: Office.CoercionType.Image
    }, (result) => {
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        console.log('Text inserted into Word document.');
      } else {
        console.error('Error inserting text into Word document:', result.error);
      }
    });
  };


  return (
    <StyledSvgCard>
      <SvgWrapper
        draggable
        onDragStart={handleDragStart}
        onDragOver={(e) => e.preventDefault()} // Allow drop
        onDrop={handleDropOnWord} // Handle drop
        dangerouslySetInnerHTML={{ __html: svgContent }} // Display SVG
      />
      <button onClick={handleInsertText}></button>
    </StyledSvgCard>
  );
};

export default SvgContent;

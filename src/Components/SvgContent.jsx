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
  // Handle drag start and convert SVG content to base64
  const handleDragStart = (e) => {
    console.log('Drag started'); // Track drag start event
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result.split(',')[1]; // Extract base64 string
      e.dataTransfer.setData('image/svg+xml', base64data); // Set data for drag event
      e.dataTransfer.dropEffect = 'copy';
      console.log('Base64 data set for drag event:', base64data); // Log base64 data
    };
    reader.readAsDataURL(svgBlob); // Convert Blob to Data URL
  };

  useEffect(() => {
    Office.onReady((info) => {
      if (info.host === Office.HostType.Word) {
        console.log('Office.js is ready');
      }
    });
  }, []);
  

  // Handle drop on Word
  const handleDropOnWord = async (e) => {
    e.preventDefault(); // Prevent default behavior
    console.log('Drop event triggered'); // Track drop event
    try {
      const base64data = e.dataTransfer.getData(svgContent);
      if (base64data) {
        const imageUrl = `data:image/svg+xml;base64,${base64data}`;
        console.log('Base64 data retrieved from drop event:', base64data); // Log base64 data
        await Office.context.document.setSelectedDataAsync(imageUrl, {
          coercionType: Office.CoercionType.Image,
        }, (result) => {
          if (result.status === Office.AsyncResultStatus.Succeeded) {
            console.log('SVG image inserted into Word document.');
          } else {
            console.error('Error inserting SVG into Word document:', result.error);
          }
        });
      } else {
        console.log('No data found during drop event.');
      }
    } catch (error) {
      console.error('Failed to insert SVG into Word:', error);
    }
  };

  // Handle double-click to insert the image into Word
  const handleDoubleClick = async () => {
    console.log('Double-click event triggered');
    if (!Office.context || !Office.context.document) {
      console.error('Office context or document is not available.');
      return;
    }
  
    try {
      const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64data = reader.result.split(',')[1];
        const imageUrl = `data:image/svg+xml;base64,${base64data}`;
        console.log('Base64 data prepared for double-click insertion:', base64data);
  
        await Office.context.document.setSelectedDataAsync(imageUrl, {
          coercionType: Office.CoercionType.Image,
        }, (result) => {
          if (result.status === Office.AsyncResultStatus.Succeeded) {
            console.log('SVG image inserted into Word document via double-click.');
          } else {
            console.error('Error inserting SVG into Word document:', result.error);
          }
        });
      };
      reader.readAsDataURL(svgBlob);
    } catch (error) {
      console.error('Failed to insert SVG into Word via double-click:', error);
    }
  };
  

  // const handleDoubleClick = async () => {
  //   console.log('Double-click event triggered'); // Track double-click event
  //   try {
  //     // Directly insert the raw SVG content as HTML into Word
  //     await Office.context.document.setSelectedDataAsync(svgContent, {
  //       coercionType: Office.CoercionType.Image, // Insert as HTML content
  //     }, (result) => {
  //       if (result.status === Office.AsyncResultStatus.Succeeded) {
  //         console.log('SVG content inserted into Word document.');
  //       } else {
  //         console.error('Error inserting SVG into Word document:', result.error);
  //       }
  //     });
  //   } catch (error) {
  //     console.error('Failed to insert SVG into Word:', error);
  //   }
  // };


  return (
    <StyledSvgCard>
      <SvgWrapper
        draggable
        onDragStart={handleDragStart} // Handle drag start for drag-and-drop
        onDragOver={(e) => {
          e.preventDefault(); 
          console.log('Dragging over the target'); // Track dragging over
        }} // Allow drop
        onDrop={handleDropOnWord} // Handle drop
        onDoubleClick={handleDoubleClick} // Handle double-click
        dangerouslySetInnerHTML={{ __html: svgContent }} // Display SVG
      />
    </StyledSvgCard>
  );
};

export default SvgContent;

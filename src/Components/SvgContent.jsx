import React, { useEffect, useRef } from 'react';
import { styled } from '@mui/system';
import { Card, } from '@mui/material';
import {insertSvgContentIntoOffice} from '../Common/CommonFunction'

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
  useEffect(() => {
    Office.onReady((info) => {
      if (info.host === Office.HostType.Word) {
        console.log('Office.js is ready');
      }
    });
  }, []);
  const [shapeCounter, setShapeCounter] = useState(0);

  const handleDragStart = async (e) => {
    e.dataTransfer.setData('text/plain', '');
    await insertSvgContentIntoOffice(svgContent, 'drag', shapeCounter);
    console.log(`Shape counter after drag: ${shapeCounter}`);
    console.log(`Shape counter after double-click: ${shapeCounter}`);
    setShapeCounter(shapeCounter + 1);
  };

  const svg = useRef(null);

  const handleDoubleClick = async () => {
    await insertSvgContentIntoOffice(svgContent, 'double-click', shapeCounter);
    setShapeCounter(shapeCounter + 1);
  };

  return (
    <StyledSvgCard>
      <SvgWrapper
        ref={svg}
        draggable
        onDragOver={(e) => {
          e.preventDefault();
          console.log('Dragging over the target');
        }}
        onDragStart={handleDragStart}
        onDoubleClick={handleDoubleClick}
        dangerouslySetInnerHTML={{ __html: svgContent }}
        title='Drag and Drop Or Double click To Insert '
      />
  </StyledSvgCard>
  );
};

export default SvgContent;

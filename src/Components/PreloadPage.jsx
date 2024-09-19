import React, { useState, useEffect } from 'react';
import { CircularProgress, Box } from '@mui/material';
import useTheme from './Theme';
import data from '../Links.json';

function PreloadPage() {
  const [isLoading, setIsLoading] = useState(true);

  const Color = `${data.colortheme.split(',')[0]}80`;

  const getThemeClass = (color) => {
    switch (color) {
      case '#1F85DE':
        return 'theme-1';
      case '#491313':
        return 'theme-2';
      case '#222222':
        return 'theme-3';
      case '#892C0F':
        return 'theme-4';
      case '#10431d':
        return 'theme-5';
      case '#102857':
        return 'theme-6';
      default:
        return '';
    }
  };

  const themeClass = getThemeClass(Color);

  const handleclick = () => {
    window.open(data.logourl, '_blank');
  }

  useTheme(data.colortheme);
  
  if (!isLoading) {
    return null;
  }

  return (
    <div
      className="relative flex items-center justify-center h-screen w-screen"
      style={{
        backgroundImage: `url(${data.backdrop})`,
        backgroundSize: 'contain', // Change this to 'contain' for responsiveness
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: Color,
        }}
      ></div>

      <div 
        className="absolute top-4 left-12 cursor-pointer"
        onClick={handleclick}
      >
        <img src={data.logoicon} alt={data.logoalt} className="h-14"/>
      </div>

      <div className="relative text-center text-white">
        <h1 className="text-2xl md:text-3xl lg:text-4xl" style={{ color: 'white', marginTop: '10px', fontWeight:'bold', fontSize:'25px', fontFamily:'Segoe UI, sans-serif' }}>
          Add-In for Stencils
        </h1>
      </div>
    </div>
  );
}

export default PreloadPage;

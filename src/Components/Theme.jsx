// ColorConverter.jsx
import React, { useEffect } from 'react';
import data from '../Links.json'

// const hexColor = data.colortheme(',').split[0]
function Theme ()  {   
    useEffect(() => {


        const hexColor = data.colortheme.split(',')[1];
      
          // Function to convert hex to RGB
          const hex2rgb = (hex) => {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            
            return { r, g, b };
          };
      
          // Convert the hex color to RGB
          const rgbColor = hex2rgb(hexColor);
      
          // Determine the font color based on the RGB values
          const fontColor = (rgbColor.r + rgbColor.g + rgbColor.b) > (255 * 3) / 2
            ? 'rgb(0, 0, 0)'  // Use black font for light backgrounds
            : 'rgb(255, 255, 255)';  // Use white font for dark backgrounds
      
          // Store the font color as a CSS variable
          document.documentElement.style.setProperty('--font-color', fontColor);
          document.documentElement.style.setProperty('--bg-color', hexColor)
      
          console.log(`Font color set to ${fontColor} based on hex: ${hexColor} and RGB: (${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`);
        }, [data])
    };

export default Theme;

import { useEffect } from 'react';

const useTheme = (colortheme) => {
  useEffect(() => {
    const hexColor = colortheme.split(',')[0];

    const hex2rgb = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    };

    const rgb = hex2rgb(hexColor);
    const fontColor = (rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114) > 150 ? "#222" : "#fff"; // Correct calculation

    document.documentElement.style.setProperty('--font-color', fontColor);
    document.documentElement.style.setProperty('--bg-color', hexColor);
    document.documentElement.style.setProperty('--black-font', fontColor === "#222" ? "true" : "false"); // Use a valid string value for boolean-like property

    console.log(`Font color set to ${fontColor} based on hex: ${hexColor} and RGB: (${rgb.r}, ${rgb.g}, ${rgb.b})`); // Correct variable reference
  }, [colortheme]);
};

export default useTheme;

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

    const rgbColor = hex2rgb(hexColor);
    const fontColor = (rgbColor.r + rgbColor.g + rgbColor.b) > (255 * 4) / 2
      ? 'rgb(0, 0, 0)'
      : 'rgb(255, 255, 255)';

    document.documentElement.style.setProperty('--font-color', fontColor);
    document.documentElement.style.setProperty('--bg-color', hexColor);
    document.documentElement.style.setProperty('--black-font', !fontColor);

    console.log(`Font color set to ${fontColor} based on hex: ${hexColor} and RGB: (${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`);
  }, [colortheme]);
};

export default useTheme;

import React, { useEffect, useState } from 'react';
import PreloadPage from './Components/PreloadPage';
import MainPage from './Pages/MainPage';
import './App.css';

function App() {
  const [showMainPage, setShowMainPage] = useState(false);

  useEffect(() => {
    
    const timer = setTimeout(() => {
      setShowMainPage(true);
    }, 3000);

    return () => clearTimeout(timer); 
  }, []);

  useEffect(() => {
    Office.initialize = function () {
      console.log('Office is ready.');
    };
  }, []);

  useEffect(() => {
    // Check if Office is ready for Word
    Office.onReady((info) => {
      if (info.host === Office.HostType.Word) {
        console.log('Word is ready');
      }
    });
  }, []);

  return (
    <div className="App">
      {showMainPage ? <MainPage /> : <PreloadPage />} {/* Show MainPage or PreloadPage */}
    </div>
  );
}

export default App;

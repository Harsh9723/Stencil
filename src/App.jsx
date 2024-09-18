import React, { useEffect, useState } from 'react';
import PreloadPage from './Components/PreloadPage';
import MainPage from './Pages/MainPage';
import './App.css';

function App() {
  const [showMainPage, setShowMainPage] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');

    if (!hasVisited) {
      const timer = setTimeout(() => {
        setShowMainPage(true); // Show MainPage after the timeout
        localStorage.setItem('hasVisited', 'true');
      }, 2000); // Delay of 1 second

      return () => clearTimeout(timer); // Cleanup timeout
    } else {
      setShowMainPage(true); // If visited, directly show MainPage
    }
  }, []);

  useEffect(() => {
    // Initialize Office
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

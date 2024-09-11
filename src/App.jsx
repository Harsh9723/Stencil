import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PreloadPage from './Components/PreloadPage';
import MainPage from './Pages/MainPage';
import Setting from './Pages/Setting';
import './App.css';
import Treedata from './Pages/TreeData';


function App() {
  const [showMainPage, setShowMainPage] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');

    if (!hasVisited) {
      const timer = setTimeout(() => {
        setShowMainPage(true);
        localStorage.setItem('hasVisited', 'true');
      }, 1000);

      return () => clearTimeout(timer); // Clean up the timer on unmount
    } else {
      setShowMainPage(true);
    }
  }, []);


    Office.initialize = function () {
      console.log("Office is ready.");
      $(document).ready(function () {
        console.log("Document is ready.");
        // You can add more initialization logic here if needed.
      });
    };


  return (
    <div className="App">
      <Routes>
        <Route path="/" element={showMainPage ? <MainPage /> : <PreloadPage />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/mainpage" element={<MainPage />} />
        <Route path="/tree" element={<Treedata />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;


// export function run<T>(batch:(Context: Word.RequestContext) =>)
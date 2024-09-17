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

useEffect(() => {

  Office.initialize = function () {
    console.log("Office is ready.");
  };
})
useEffect(() => {
  Office.onReady((info) =>{
    if(info.host === Office.HostType.Word){
  console.log('word is ready')
    }
  })
})



  return (
    <div className="App">
      <Routes>
        <Route path="/" element={showMainPage ? <MainPage /> : <PreloadPage />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/mainpage" element={<MainPage />} />
        <Route path="/tree" element={<Treedata />} />
      </Routes>
    
    </div>
  );
}

export default App;



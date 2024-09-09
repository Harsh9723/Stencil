import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PreloadPage from './Components/PreloadPage';
import MainPage from './Pages/MainPage';
import Setting from './Pages/Setting';
import './App.css'
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

  
     Office.onReady(info => {
       if (info.host === Office.HostType.Word) {
         console.log("Office.js is running in Word");
         // Your Office.js code here
        } else {
          console.warn("Office.js is not running in an Office application");
        }
      });
 
      
  })
    


  // useEffect(() => {
  //   Office.onReady(info => {
  //     if (info.host === Office.HostType.Word) {
  //       // Add event handler for button click
  //       document.getElementById("insertText").onclick = insertText;
  //     }
  //   });
  // }, []);

  // const insertText = () => {
  //   Word.run(async context => {
  //     const docBody = context.document.body;
  //     docBody.insertText("Hello, World!", Word.InsertLocation.end);
  //     await context.sync();
  //   });
  // };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={showMainPage ? <MainPage /> : <PreloadPage />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/mainpage" element={<MainPage />} />
        <Route path='/tree' element={<Treedata />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
     
    </div>
  );
}

export default App;




// handleSearch remains unchanged

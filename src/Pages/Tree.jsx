// CustomTree.js
import React, { useContext } from 'react';
import Tree  from 'rc-tree';
import 'rc-tree/assets/index.css'; 
import data from '../Links.json'
import { useLocation } from 'react-router';
import { Box,Tooltip, IconButton,Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';






const Treedata = () => {
    
    const navigate = useNavigate()
    const location = useLocation()

    const handleClick = () => {
      window.open(data.logourl, '_blank');
    };
  
    const handleBackClick = () => { 
      navigate('/mainpage');
    };

    const {treeData} = location.state || {}
    if(!treeData){
        return <div>no tree data available</div>
    }
  return (
    <div style={{backgroundColor: 'var(--bg-color)',
      height:'100vh',
      width: { xs: '100%', sm: '90%', md: '100%', lg: '100%' },
      padding:'9px',
      boxSizing: 'border-box',
      overflowX: 'hidden',
      overflowY:'auto',
      justifyContent: 'flex-start',
      display: 'flex',
      color: 'var(--font-color)',  
      flexDirection: 'column',
      fontFamily: ['Segoe UI', 'sans-serif'],
      
    }}>
       <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <Tooltip title="Back" placement="bottom-end">
          <IconButton sx={{ color: 'var(--font-color)' }} onClick={handleBackClick}>
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <Typography sx={{ marginLeft: '8px', fontSize:'12px' }}>
          Visit
        </Typography>
        <Tooltip title="Visit VisioStencils website" placement="bottom-end">
          <Typography
            sx={{ marginLeft: '8px', cursor: 'pointer', textDecoration: 'underline', fontSize:'12px' }}
            onClick={handleClick}
          >
            VisioStencils.com
          </Typography>
        </Tooltip>
      </Box>


    <Tree
      treeData={treeData}
      defaultExpandAll
      style={{ marginTop: 10 }}
      
      />
  
      </div>
  );
};

export default Treedata;

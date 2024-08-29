import React from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import data from '../Links.json';
import { IconButton, Tooltip, Typography, Box, Link, TextField, Button } from '@mui/material';
import useTheme from '../Components/Theme';

const Setting = () => {
  const navigate = useNavigate();

  useTheme(data.colortheme);

  const handleClick = () => {
    window.open(data.logourl, '_blank');
  };

  const handleBackClick = () => { 
    navigate('/mainpage');
  };

  const CustomTypography = ({ children, ...props }) => (
    <Typography variant="body2" sx={{ fontSize: '12px', fontFamily:['Segoe UI', 'sans-serif'] }} {...props}>
      {children}
    </Typography>
  );

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-color)',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        color: 'var(--font-color)',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
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

      <Box 
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <Typography sx={{fontSize:'12px'}}>
          The NetZoom device library contains the latest devices from over 5000 manufacturers. 
          To access the full library, you must purchase a subscription at 
          <Link href="https://www.VisioStencils.com" color="inherit"> www.VisioStencils.com </Link> 
          and register it at the Service portal  
          <Link href="https://Service.NetZoom.com" color="inherit" sx={{fontSize:'12px'}}> https://Service.NetZoom.com </Link>.
        </Typography>
        <TextField 
          label={<CustomTypography>Portal Login Email</CustomTypography>} 
          variant='outlined' 
          placeholder='Email address registered at service portal'
          InputLabelProps={{ style: { color: 'var(--font-color)' } }}
          InputProps={{
            style: { color: 'var(--font-color)', borderColor: 'var(--font-color)', fontSize:'12px' },
          }}
          sx={{
            '.MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'var(--font-color)',
              },
              '&:hover fieldset': {
                borderColor: 'var(--font-color)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'var(--font-color)',
              },
            },
          }}
          fullWidth
        />
        <TextField 
          label={<CustomTypography>Subscription Number</CustomTypography>} 
          variant='outlined' 
          placeholder='Enter Purchased Subscription number'
          InputLabelProps={{ style: { color: 'var(--font-color)' } }}
          InputProps={{
            style: { color: 'var(--font-color)', borderColor: 'var(--font-color)', fontSize: '12px' },
          }}
          sx={{
            '.MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'var(--font-color)',
              },
              '&:hover fieldset': {
                borderColor: 'var(--font-color)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'var(--font-color)',
              },
            },
          }}
          fullWidth
        />
      </Box>
      
      <Button 
        variant='contained' 
        size='small'
        sx={{ 
          padding: '10px 20px', 
          alignSelf: 'flex-center',
          backgroundColor: 'var(--font-color)',
          color: 'var(--bg-color)',
          '&:hover': {
            backgroundColor: 'var(--font-color)',
          },
        }}
      >
        SAVE
      </Button>
    </div>
  );
}

export default Setting;

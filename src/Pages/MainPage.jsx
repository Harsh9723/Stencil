import React, { useEffect, useState } from 'react';
import { Box, TextField, Typography, IconButton, Grid, Tooltip, CircularProgress, Snackbar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Backdrop from '@mui/material/Backdrop';
import data from '../Links.json';
import SettingsIcon from '@mui/icons-material/Settings';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { useNavigate } from 'react-router';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import useTheme from '../Components/Theme';
import axios from 'axios';
import { Alert, Dialog, DialogActions, DialogContent, DialogTitle, ListItem, FormGroup, Checkbox, Button } from '@mui/material';


export default function MainPage() {

  const [loading, setLoading] = useState(false);
  const [manufacturers, setManufacturers] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState('');
  const [eqtypes, setEqTypes] = useState([]);
  const [selectedEqType, setSelectedEqType] = useState('');
  const [productline, setProductLine] = useState([])
  const [selectedProductline, setSelectProductLine] = useState('')
  const [productnumber, setProductNumber] = useState([])
  const [selectedproductnumber, setSelectedProductNumber] = useState('')
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [keyword, setKeyword] = useState('');
  const [dtmanufacturers, setDtManufacturers] = useState([]);
  const [selecteddtManufacturers, setSelectedDtManufacturers] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchManufacturers = async () => {
      setLoading(true);
      try {
        const response = await axios.post('http://localhost:8000/library/GetLibraryAvailableManufacturersNew', {
          Email: "",
          SubNo: "000000000000000000001234",
          FullLibrary: false,
          Models: null,
        });
        const manufacturersData = response.data.Data;
        setManufacturers(manufacturersData);

        // Automatically select if only one manufacturer is available
        if (manufacturersData.length === 1) {
          setSelectedManufacturer(manufacturersData[0].MfgAcronym);
        }
      } catch (error) {
        console.error('Error fetching manufacturers:', error);
      }
      setLoading(false);
    };
    fetchManufacturers();
  }, []);

  useEffect(() => {
    if (selectedManufacturer) {
      const fetchEqTypes = async () => {
        setLoading(true);
        try {
          const response = await axios.post('http://localhost:8000/library/GetLibraryAvailableEqTypesNew', {
            Email: "",
            Subno: "000000000000000000001234",
            ActualMfgAcronym: selectedManufacturer,
            FullLibrary: false,
            Models: null,
          });
          const eqTypesData = response.data.Data;
          setEqTypes(eqTypesData);

          // Automatically select if only one equipment type is available
          if (eqTypesData.length === 1) {
            setSelectedEqType(eqTypesData[0]);
          }
        } catch (error) {
          console.error('Error fetching equipment types:', error);
        }
        setLoading(false);
      };
      fetchEqTypes();
    }
  }, [selectedManufacturer]);


  useEffect(() => {
    if (selectedManufacturer && selectedEqType) {
      const fetchProductLine = async () => {
        setLoading(true);
        try {
          const response = await axios.post('http://localhost:8000/library/GetLibraryAvailableProdLinesNew', {
            Email: "",
            SubNo: "000000000000000000001234",
            ActualMfgAcronym: selectedManufacturer,
            EqTypeToGetFor: selectedEqType,
            FullLibrary: false,
          });
          const productLineData = response.data.Data;
          setProductLine(productLineData);

          // Automatically select if only one product line is available
          if (productLineData.length === 1) {
            setSelectProductLine(productLineData[0]);
          }
        } catch (error) {
          console.error('Error fetching product line:', error);
        }
        setLoading(false);
      };
      fetchProductLine();
    }
  }, [selectedManufacturer, selectedEqType]);


  useEffect(() => {
    if (selectedManufacturer && selectedEqType && selectedProductline) {
      const fetchProductNumber = async () => {
        setLoading(true);
        try {
          const response = await axios.post('http://localhost:8000/library/GetLibraryAvailableProdNumbersNew', {
            Email: "",
            SubNo: "000000000000000000001234",
            ActualMfgAcronym: selectedManufacturer,
            EqTypeToGetFor: selectedEqType,
            ProdLineToGetFor: selectedProductline,
            FullLibrary: false,
          });
          const productNumberData = response.data.Data;
          setProductNumber(productNumberData);

          // Automatically select if only one product number is available
          if (productNumberData.length === 1) {
            setSelectedProductNumber(productNumberData[0]);
          }
        } catch (error) {
          console.error('Error fetching product number:', error);
        }
        setLoading(false);
      };
      fetchProductNumber();
    }
  }, [selectedManufacturer, selectedEqType, selectedProductline]);

  const handleManufacturerChange = (event) => {
    setSelectedManufacturer(event.target.value);
    setSelectedEqType(''); // Reset selected equipment type when manufacturer changes
  };

  const handleEqTypeChange = (event) => {
    setSelectedEqType(event.target.value);
    setSelectProductLine('')
  }
  const handleproductlinechange = (event) => {
    setSelectProductLine(event.target.value)
    setSelectedProductNumber('')
  }
  const handleproductnumber = (event) => {
    setSelectedProductNumber(event.target.value)
  }
  const handleSettingClick = () => {
    navigate('/setting');
  };

  const handleClick = () => {
    window.open(data.logourl, '_blank');
  };

  const searchSolution = () => {
    const search = async () => {
      try {
        const response = await axios.post("http://localhost:8000/library/SearchLibraryNew", {
          Email: "",
          SubNo: "000000000000000000001234",
          FullLib: false,
          ParamXML: `<Search><NotificationCount/><SearchType>Solution</SearchType><SelectedMfg>${selectedManufacturer || ''}</SelectedMfg><SelectedEqType>${selectedEqType || ''}</SelectedEqType><SelectedMfgProdLine>${selectedProductline || ''}</SelectedMfgProdLine><SelectedMfgProdNo>${selectedproductnumber || ''}</SelectedMfgProdNo><IncludeRelatedMfg>true</IncludeRelatedMfg><CardModuleFlag>false</CardModuleFlag><RackFlag>false</RackFlag><RMFlag>false</RMFlag><ChassisFlag>false</ChassisFlag><ToSearchOnlyWithShape>true</ToSearchOnlyWithShape><OrderByClause /></Search>`,
          Settings: {
            RememberLastSearchCount: 16,
            IncludeRelatedManufacturers: true,
            NotifyResultsExceedCount: 500,
            NotifyResultsExceedCountCheck: true,
            RememberLastSearchCountCheck: true,
            IsGroupOrderAsc1: true,
            IsGroupOrderAsc2: true,
            IsGroupOrderAsc3: true,
            IsGroupOrderAsc4: true,
            TreeGroupBy1: "Manufacturer",
            TreeGroupBy2: "Equipment Type",
            TreeGroupBy3: "Product Line",
            TreeGroupBy4: "Product/Model Number"
          }
        });
        const searchresponse = response.data;
        console.log('123', searchresponse);
      } catch (error) {
        console.error(error);
      }
    };

    search();
  };
  useEffect(() => {
    if (selectedManufacturer && selectedEqType && selectedProductline && selectedproductnumber) {
      searchSolution()
    }
  }, [selectedManufacturer && selectedEqType && selectedProductline && selectedproductnumber])

  useEffect(() => {
    if (keyword) {
      const matchedManufacturers = manufacturers.filter((manufacturer) =>
        manufacturer.MfgAcronym.toLowerCase().includes(keyword.toLowerCase())
      );

      if (matchedManufacturers.length > 0) {
        console.log('Matched Manufacturers:', matchedManufacturers);
      } else {
        console.log('No matching manufacturers found');
      }
    }
    //  else{
    //    setSnackbarMessage(`No Results were found for "${keyword}" in Manufacturer "${selectedManufacturer}"`);
    //     setSnackbarOpen(true);
    // }
  }, [keyword, manufacturers]);

  // const searchByKeyword = async () => {
  //     try {
  //       const response = await axios.post("http://localhost:8000/library/SearchLibraryNew", {
  //         Email: "",
  //         SubNo: "000000000000000000001234",
  //         FullLib: false,
  //         ParamXML: `<Search><NotificationCount>500 </NotificationCount><SearchType>Kwd</SearchType><KwdSearchType>0</KwdSearchType><TextSearched>${keyword}</TextSearched><MfgFilterList>${selectedManufacturer}</MfgFilterList><LikeOpeartor /><LikeType /><IncludeRelatedMfg>true</IncludeRelatedMfg><CardModuleFlag>false</CardModuleFlag><RackFlag>false</RackFlag><RMFlag>false</RMFlag><ChassisFlag>false</ChassisFlag><ToSearchOnlyWithShape>true</ToSearchOnlyWithShape><OrderByClause /></Search>`,
  //         Settings: {
  //           RememberLastSearchCount: 16,
  //           IncludeRelatedManufacturers: true,
  //           NotifyResultsExceedCount: 600,
  //           NotifyResultsExceedCountCheck: true,
  //           RememberLastSearchCountCheck: true,
  //           IsGroupOrderAsc1: true,
  //           IsGroupOrderAsc2: true,
  //           IsGroupOrderAsc3: true,
  //           IsGroupOrderAsc4: true,
  //           TreeGroupBy1: "Manufacturer",
  //           TreeGroupBy2: "Equipment Type",
  //           TreeGroupBy3: "Product Line",
  //           TreeGroupBy4: "Product/Model Number"
  //         }
  //       });
  //       const keywordResponse = response.data;
  //       console.log('kwd', keywordResponse);
  //     } catch (error) {
  //       console.error(error);
  //     }

  // }

  const search = async () => {
    let searchType = 'Solution';
    let paramXml = '';

    if (keyword) {
      searchType = 'Kwd';
      paramXml = `<Search><NotificationCount>10 </NotificationCount><SearchType>${searchType}</SearchType><KwdSearchType>0</KwdSearchType><TextSearched>${keyword}</TextSearched><MfgFilterList>${selectedManufacturer}</MfgFilterList><LikeOpeartor /><LikeType /><IncludeRelatedMfg>true</IncludeRelatedMfg><CardModuleFlag>false</CardModuleFlag><RackFlag>false</RackFlag><RMFlag>false</RMFlag><ChassisFlag>false</ChassisFlag><ToSearchOnlyWithShape>true</ToSearchOnlyWithShape><OrderByClause /></Search>`;

    } else if (selectedManufacturer || selectedEqType || selectedProductline || selectedproductnumber) {
      paramXml = `<Search><NotificationCount/><SearchType>Solution</SearchType><SelectedMfg>${selectedManufacturer || ''}</SelectedMfg><SelectedEqType>${selectedEqType || ''}</SelectedEqType><SelectedMfgProdLine>${selectedProductline || ''}</SelectedMfgProdLine><SelectedMfgProdNo>${selectedproductnumber || ''}</SelectedMfgProdNo><IncludeRelatedMfg>true</IncludeRelatedMfg><CardModuleFlag>false</CardModuleFlag><RackFlag>false</RackFlag><RMFlag>false</RMFlag><ChassisFlag>false</ChassisFlag><ToSearchOnlyWithShape>true</ToSearchOnlyWithShape><OrderByClause /></Search>`;

    }

    try {
      const response = await axios.post('http://localhost:8000/library/SearchLibraryNew', {
        Email: "",
        SubNo: "000000000000000000001234",
        FullLib: false,
        ParamXML: paramXml,
        Settings: {
          RememberLastSearchCount: 16,
          IncludeRelatedManufacturers: true,
          NotifyResultsExceedCount: 10,
          NotifyResultsExceedCountCheck: true,
          RememberLastSearchCountCheck: true,
          IsGroupOrderAsc1: true,
          IsGroupOrderAsc2: true,
          IsGroupOrderAsc3: true,
          IsGroupOrderAsc4: true,
          TreeGroupBy1: "Manufacturer",
          TreeGroupBy2: "Equipment Type",
          TreeGroupBy3: "Product Line",
          TreeGroupBy4: "Product/Model Number"
        }
      });

      const responsedtsearchresult = response.data.Data.SearchData.dtSearchResults
      const responsedtmanufacturer = response.data.Data.SearchData.dtManufacturers
      console.log('Search Response dtmanufacturer:', responsedtmanufacturer);
      console.log('Search Response dtsearchresult:', responsedtsearchresult);



      if (responsedtmanufacturer === null && responsedtsearchresult === null) {
        setSnackbarMessage(`No Results were found for "${keyword}" in Manufacturer "${selectedManufacturer}"`);
        setSnackbarOpen(true);

      } else if (responsedtmanufacturer) {
        setDtManufacturers(responsedtmanufacturer)
        setIsDialogOpen(true)
      }
      else {
        console.log('search result', keyword)
      }
    } catch (error) {
      console.error('Search Error:', error);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  const handleManufacturerSelection = (manufacturer) => {
    setSelectedDtManufacturers((prevSelected) =>
      prevSelected.includes(manufacturer)
        ? prevSelected.filter((item) => item !== manufacturer)
        : [...prevSelected, manufacturer]
    );
  };

  const handleDialogSubmit = () => {
    console.log('Selected Manufacturers:', selecteddtManufacturers);
    setIsDialogOpen(false);
    // Continue with your logic, e.g., performing a search based on the selected manufacturers
  };
const handlebuttonclick = () => {
  setSnackbarOpen(false)
}

  const CustomTypography = ({ children, ...props }) => (
    <Typography variant="body2" sx={{ fontSize: '12px', fontFamily: ['Segoe UI', 'sans-serif'] }} {...props}>
      {children}
    </Typography>
  );
  useTheme(data.colortheme)
  return (

    <div
      style={{
        backgroundColor: 'var(--bg-color)',
        height: '100vh',
        display: 'flex',
        overflow: 'hidden',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        fontFamily: ['Segoe UI', 'sans-serif'],
        alignItems: 'center',
        color: 'var(--font-color)',
        boxSizing: 'border-box',
        padding: '9px',
        width: { xs: '100%', sm: '90%', md: '100%', lg: '100%' },

      }}
    >
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} sx={{fontSize:'12px'}}  >
        <DialogTitle sx={{fontSize:'12px'}}>Select Manufacturers</DialogTitle>
        <DialogContent sx={{fontSize:'12px'}} >
          <FormControl component="fieldset"sx={{fontSize:'12px'}} >
            <FormGroup  sx={{fontSize:'12px'}} >
              {dtmanufacturers.map((manufacturer, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={selecteddtManufacturers.includes(manufacturer.MfgAcronym)}
                      onChange={() => handleManufacturerSelection(manufacturer.MfgAcronym)}
                      sx={{fontSize:'12px'}}
                     
                    />
                  }
                  label={manufacturer.Manufacturer}
                  sx={{fontSize:'12px'}} // Ensure you use the property that you want to display
                />
              ))}
            </FormGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} sx={{fontSize:'12px'}}>Cancel</Button>
          <Button onClick={() => handleDialogSubmit()} sx={{fontSize:'12px'}}>OK</Button>
        </DialogActions>
      </Dialog>



      <>

        <Box
          sx={{
            position: 'relative',
            top: '0px',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            width: '100%',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', }}>
            <Tooltip title="setting" placement="bottom-end">
              <IconButton sx={{ color: 'var(--font-color)', padding: 0 }} onClick={handleSettingClick}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            <Typography sx={{ marginLeft: '8px', whiteSpace: 'nowrap', fontSize: '12px' }}>Visit</Typography>
            <Tooltip title="visit visiostencil website" placement="bottom-end">
              <Typography
                sx={{
                  marginLeft: '8px',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  whiteSpace: 'nowrap',
                  fontSize: '12px'
                }}
                onClick={handleClick}
              >
                VisioStencils.com
              </Typography>
            </Tooltip>
          </Box>
        </Box>
        <Box
          component="form"
          sx={{
            width: '101%',
            display: 'flex',
            flexDirection: 'column',
            gap: '0px',
            overflow: 'hidden',
            padding: '12px'
          }}
          noValidate
          autoComplete="off"
        >
          <Grid container alignItems="center" direction='row'>
            <Grid item xs={11} sx={{ px: '1px', fontSize: '12px' }} >
              <TextField
                id="outlined-basic"
                label={<CustomTypography>Search</CustomTypography>}
                variant="outlined"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder='By keyword'
                InputLabelProps={{ style: { color: 'var(--font-color)', } }}
                InputProps={{
                  style: {
                    color: 'var(--font-color)', borderColor: 'var(--font-color)', // Adjust padding to reduce height
                    fontSize: '12px'
                  },
                }}
                fullWidth
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
                  }, fontSize: '12px', color: 'var(--font-color)'
                }}

              />
              <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              >
                <Alert onClose={handleSnackbarClose} severity="info" sx={{ width: '100%' }}
                action={
                  <Button color='inherit' size='small' onClick={handlebuttonclick}>OK</Button>
                }
                >
                  {snackbarMessage}
                </Alert>
              </Snackbar>
            </Grid>
            <Grid xs={1} >
              <IconButton sx={{ color: 'var(--font-color)', padding: '10px', position: 'relative' }} size='large' onClick={search}>
                <SearchIcon />
              </IconButton>
            </Grid>
          </Grid>

          <FormControl component="fieldset" sx={{ width: '100%', }}>
            <RadioGroup
              row
              sx={{
                justifyContent: 'flex-start',
                color: 'var(--font-color)',
                fontSize: '12px'
              }}
            >
              <FormControlLabel
                sx={{ fontSize: '12px' }}
                value="anyWord"
                control={<Radio sx={{ color: 'var(--font-color)', fontSize: '12px' }} color='default' />}
                label={<CustomTypography>Any Word</CustomTypography>}
              />
              <FormControlLabel
                value="allWords"
                control={<Radio sx={{ color: 'var(--font-color)' }} color='default' />}
                label={<CustomTypography>All Words</CustomTypography>}
              />
            </RadioGroup>
          </FormControl>

          <FormControl fullWidth variant="outlined" sx={{ mt: 3, }}>
            <InputLabel sx={{ color: 'var(--font-color)', fontSize: '12px' }} shrink>
              Manufacturers [{manufacturers.length}]
            </InputLabel>
            <Select
              displayEmpty
              value={selectedManufacturer}
              onChange={handleManufacturerChange}
              input={
                <OutlinedInput
                  notched
                  label={`Manufacturers [${manufacturers.length}]`}
                  sx={{
                    color: 'var(--font-color)',
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--font-color)',
                    },
                  }}
                />
              }
              renderValue={(selected) => {
                if (!selected) {
                  return <h1>All</h1>;
                }
                const selectedManufacturer = manufacturers.find(manufacturer => manufacturer.MfgAcronym === selected);
                return selectedManufacturer ? selectedManufacturer.Manufacturer : '';
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
                '.MuiSelect-select': {
                  color: 'var(--font-color) !important',
                },
                '.MuiSvgIcon-root': {
                  color: 'var(--font-color) !important',
                }, fontSize: '12px',
              }}

            >
              {manufacturers.length > 1 && (

                <MenuItem value="all" sx={{ fontSize: '12px' }}>
                  <h1>All</h1>
                </MenuItem>
              )}
              {manufacturers.length > 0 ? (
                manufacturers.map((manufacturer) => (
                  <MenuItem
                    key={manufacturer.MfgAcronym}
                    value={manufacturer.MfgAcronym}
                    sx={{ fontSize: '12px', fontFamily: 'Segoe UI, sans-serif', color: 'var(--black-font)' }}
                  >
                    {manufacturer.Manufacturer}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No Manufacturers Available</MenuItem>
              )}
            </Select>
          </FormControl>

          <FormControl fullWidth variant="outlined" sx={{ mt: 3 }}>
            <InputLabel sx={{ color: 'var(--font-color)', fontSize: '12px' }} shrink>
              Equipment Types [{eqtypes.length}]
            </InputLabel>
            <Select
              displayEmpty
              value={selectedEqType}
              onChange={handleEqTypeChange}
              input={<OutlinedInput notched label={`Equipment Types [${eqtypes.length}]`}
                sx={{
                  color: 'var(--font-color)',
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--font-color)',
                  },
                }}
              />}


              renderValue={(selected) => {
                if (!selected) {
                  return <h1>All</h1>;
                }
                console.log('abc', selected)
                return selected;
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
                '.MuiSelect-select': {
                  color: 'var(--font-color) !important',
                },
                '.MuiSvgIcon-root': {
                  color: 'var(--font-color) !important',
                }, fontSize: '12px'
              }}
            >
              {eqtypes.length > 1 && (
                <MenuItem value="all">
                  <h1>All</h1>
                </MenuItem>
              )}
              {eqtypes.length > 0 ? (
                eqtypes.map((eqtype) => (
                  <MenuItem key={eqtype} value={eqtype} sx={{ fontSize: '12px', fontFamily: 'Segoe UI, sans-serif', color: 'var(--black-font)' }}>
                    {eqtype}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No Equipment Types Available</MenuItem>
              )}
            </Select>
          </FormControl>



          <FormControl fullWidth variant="outlined" sx={{ mt: 3 }}>
            <InputLabel
              sx={{ color: 'var(--font-color)', fontSize: '12px' }}
              shrink
            >
              Product Lines [{productline.length}]
            </InputLabel>
            <Select
              displayEmpty
              value={selectedProductline}
              onChange={handleproductlinechange}
              input={<OutlinedInput notched label=" Product Lines [0]"
                sx={{
                  color: 'var(--font-color)',
                  '.MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'var(--font-color)' },
                    '&:hover fieldset': { borderColor: 'var(--font-color)' },
                    '&.Mui-focused fieldset': { borderColor: 'var(--font-color)' },
                  },
                  '.MuiSelect-select': { color: 'var(--font-color) !important' },
                  '.MuiSvgIcon-root': { color: 'var(--font-color) !important' }, fontSize: '12px'
                }}

              />}

              renderValue={(selected) => {
                if (!selected) {
                  return <h1>All</h1>
                }
                console.log('productline', selected)
                return selected
              }}
            >
              {productline.length > 1 && (

                <MenuItem value="" sx={{ fontSize: '12px' }}>
                  <h1>All</h1>
                </MenuItem>
              )}
              {productline.length > 0 ? (
                productline.map((productLine) => (
                  <MenuItem key={productLine} value={productLine} sx={{ fontSize: '12px', fontFamily: 'Segoe UI, sans-serif', color: 'var(--black-font)' }}>
                    {productLine}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No product line available</MenuItem>
              )}
            </Select>
          </FormControl>

          <FormControl fullWidth variant="outlined" sx={{ mt: 3 }}>
            <InputLabel
              sx={{ color: 'var(--font-color)', fontSize: '12px' }}
              shrink
            >
              Product Numbers [{productnumber.length}]
            </InputLabel>
            <Select
              displayEmpty
              value={selectedproductnumber}
              onChange={handleproductnumber}
              input={<OutlinedInput notched label="Product Numbers [0]"
                sx={{
                  color: 'var(--font-color)',
                  '.MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'var(--font-color)' },
                    '&:hover fieldset': { borderColor: 'var(--font-color)' },
                    '&.Mui-focused fieldset': { borderColor: 'var(--font-color)' },
                  },
                  '.MuiSelect-select': { color: 'var(--font-color) !important' },
                  '.MuiSvgIcon-root': { color: 'var(--font-color) !important' }, fontSize: '12px'
                }}
              />}
              renderValue={(Pnumberselected) => {
                if (!Pnumberselected) {
                  return <h1>All</h1>
                }
                console.log('pnumberselected', Pnumberselected)
                return Pnumberselected
              }}
            >
              {productnumber.length > 1 && (

                <MenuItem value="" sx={{ fontSize: '12px' }}>
                  <h1>All</h1>
                </MenuItem>
              )}
              {productnumber.length > 0 ? (
                productnumber.map((pnumber) => (
                  <MenuItem key={pnumber} value={pnumber} sx={{ fontSize: '12px', fontFamily: 'Segoe UI, sans-serif', color: 'var(--black-font)' }}>
                    {pnumber}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled sx={{ fontSize: '12px' }}>No Product number Available</MenuItem>
              )}
            </Select>
          </FormControl>
        </Box>

        <Typography
          sx={{
            marginTop: '20px',
            fontSize: { xs: '12px', sm: '14px' },
            textAlign: 'center',
            padding: '0 12px',
          }}
        >
          Now you can create professional quality Visio Diagrams and PowerPoint Presentations using High Quality Shapes and Stencils.
        </Typography>
      </>
    </div>


  );
}

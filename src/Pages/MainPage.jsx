import React, { useContext, useEffect, useState } from 'react';
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
// import { handleSearch, transformToTreeData } from '../Components/utils.jsx';
import Treedata from './TreeData';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTreeData } from '../Context/TreedataContext';

// const API_URL = 'http://localhost:5000/api/library/';

// /**
//  * Handles searching by making an API request based on provided parameters and processes the response data.
//  * 
//  * @param {Object} searchParams -  for the search API call.
//  * @param {Function} onSuccess - Callback to handle successful search response.
//  * @param {Function} onError - Callback to handle errors.
//  */

// export const handleSearch = async (searchParams, onSuccess, onError) => {
//   const { keyword, related,Eqid ,selectedManufacturer, setSnackbarMessage, setSnackbarOpen, selectedEqType, selectedProductLine, selectedProductNumber, selectedDtManufacturers, } = searchParams;
//   let searchType = 'Solution';
//     let paramXml = '';


//   if (keyword) {
//           searchType = 'Kwd';
//           paramXml = `<Search><NotificationCount>10</NotificationCount><SearchType>${searchType}</SearchType><KwdSearchType>0</KwdSearchType><TextSearched>${keyword}</TextSearched><MfgFilterList>${selectedManufacturer ? selectedManufacturer : selectedDtManufacturers.length > 0 ? selectedDtManufacturers.join(',') : ""}</MfgFilterList><LikeOpeartor /><LikeType /><IncludeRelatedMfg>true</IncludeRelatedMfg><CardModuleFlag>false</CardModuleFlag><RackFlag>false</RackFlag><RMFlag>false</RMFlag><ChassisFlag>false</ChassisFlag><ToSearchOnlyWithShape>true</ToSearchOnlyWithShape><OrderByClause /></Search>`;

//         }
//         else if (selectedManufacturer || selectedEqType || selectedProductLine || selectedProductNumber) {
//           paramXml = `<Search><NotificationCount/><SearchType>Solution</SearchType><SelectedMfg>${selectedManufacturer || ''}</SelectedMfg><SelectedEqType>${selectedEqType || ''}</SelectedEqType><SelectedMfgProdLine>${selectedProductLine || ''}</SelectedMfgProdLine><SelectedMfgProdNo>${selectedProductNumber || ''}</SelectedMfgProdNo><IncludeRelatedMfg>true</IncludeRelatedMfg><CardModuleFlag>false</CardModuleFlag><RackFlag>false</RackFlag><RMFlag>false</RMFlag><ChassisFlag>false</ChassisFlag><ToSearchOnlyWithShape>true</ToSearchOnlyWithShape><OrderByClause /></Search>`;

//         }else if (related || '') {
//           paramXml=` <Search><NotificationCount>500</NotificationCount><SearchType>Related</SearchType><EQID>${Eqid}</EQID><MfgFilterList></MfgFilterList><IncludeRelatedMfg>true</IncludeRelatedMfg><ToSearchOnlyWithShape>true</ToSearchOnlyWithShape><OrderByClause /></Search>`
//         }
//         try {
//           const response = await axios.post(`${API_URL}SearchLibraryNew`, {
//             Email: "",
//             SubNo: "000000000000000000001234",
//             FullLib: false,
//             ParamXML: paramXml,
//             Settings: {
//               RememberLastSearchCount: 16,
//               IncludeRelatedManufacturers: true,
//               NotifyResultsExceedCount: 10,
//               NotifyResultsExceedCountCheck: true,
//               RememberLastSearchCountCheck: true,
//               IsGroupOrderAsc1: true,
//               TreeGroupBy1: "Manufacturer",
//               TreeGroupBy2: "Equipment Type",
//               TreeGroupBy3: "Product Line",
//               TreeGroupBy4: "Product/Model Number",
//             },
//           });

//           const searchData = response.data.Data.SearchData;
//           const resultData = searchData?.dtSearchResults || []; // Safely handle if data is missing
//           const dtResultdata = searchData?.dtManufacturers || []; // Safely handle if data is missing

//           console.log('Result Data:', resultData);
//           console.log('dtResult Data:', dtResultdata);

//           if (resultData.length > 0) {
//             // If there are search results, call onSuccess with resultData
//             onSuccess(resultData);
//           } else if (dtResultdata.length > 0) {
//             onSuccess(dtResultdata);
//           } else {
//             console.log('No relevant data found');
//             // Handle cases where no data is available
//             onFailure('No results found');
//           }
//         } catch (error) {
//           console.error('Related not shown:', error.message);
//           onFailure('An error occurred while fetching data');
//         }

// };

// /**

//  * 
//  * @param {Array} result - The search results to transform.
//  * @returns {Array} - The transformed tree data.
//  */

// export const transformToTreeData = (result,) => {
//   const tree = [
//     {
//       title: `Search Results [${result.length}]`,
//       key: `search-results-${Date.now()}`, 
//       icon: <img src="./assets/main_node.png" alt="Search Results Icon" style={{ width: 16, height: 16 }} />,
//       children: [],
//     },
//   ];


//   const searchResultsNode = tree[0];

//   result.forEach((item) => {
//     const {
//       MfgAcronym = '',
//       Manufacturer = '',
//       EQTYPE = '',
//       MFGPRODLINE = '',
//       MFGPRODNO = '',
//       EQID = '',
//     } = item;

//     let manufacturerNode = searchResultsNode.children.find(
//       (child) => child.key === MfgAcronym
//     );

//     if (!manufacturerNode) {
//       manufacturerNode = {
//         title: Manufacturer,
//         key: MfgAcronym,
//         icon: <img src="./assets/manufacturer.png" alt="manufacturer" style={{ width: 16, height: 16 }} />,
//         children: [],
//       };
//       searchResultsNode.children.push(manufacturerNode);
//     }

//     const eqTypeKey = `${MfgAcronym}-${EQTYPE}`;
//     let eqTypeNode = manufacturerNode.children.find(
//       (child) => child.key === eqTypeKey
//     );

//     if (!eqTypeNode) {
//       eqTypeNode = {
//         title: EQTYPE,
//         key: eqTypeKey,
//         icon: <img src={`./assets/EqType/${EQTYPE}.png`} alt="EQTYPE" style={{ width: 16, height: 16 }} />,
//         children: [],
//       };
//       manufacturerNode.children.push(eqTypeNode);
//     }

//     const prodLineKey = `${MfgAcronym}-${EQTYPE}-${MFGPRODLINE}`;
//     let prodLineNode = eqTypeNode.children.find(
//       (child) => child.key === prodLineKey
//     );

//     if (!prodLineNode) {
//       prodLineNode = {
//         title: MFGPRODLINE,
//         key: prodLineKey,
//         icon: <img src="./assets/product_line.png" alt="product line" style={{ width: 16, height: 16 }} />,
//         children: [],

//       };
//       eqTypeNode.children.push(prodLineNode);
//     }

//     const productNumberKey = EQID;
//     let productnoNode = prodLineNode.children.find(
//       (child) => child.key === productNumberKey
//     );

//     if (!productnoNode) {
//       productnoNode = {
//         title: MFGPRODNO,
//         key: productNumberKey,
//         tooltip:'hello',
//         icon: <img src="./assets/product_no.gif" alt="product no" style={{ width: 16, height: 16 }} />,
//         children: [],
//         EQID: productNumberKey,
//         Type:'ProductNumber',
//         isLeaf:false
//       };
//       prodLineNode.children.push(productnoNode);
//     }
//   });

//   return tree;
// };


const SearchComponent = () => {
  const [loading, setLoading] = useState(false);
  const [manufacturers, setManufacturers] = useState('')
  const [selectedManufacturer, setSelectedManufacturer] = useState('');
  const [eqTypes, setEqTypes,] = useState([]);
  const [selectedEqType, setSelectedEqType] = useState('');
  const [productLine, setProductLine] = useState([]);
  const [selectedProductLine, setSelectedProductLine] = useState('');
  const [productNumber, setProductNumber] = useState([]);
  const [selectedProductNumber, setSelectedProductNumber] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [keyword, setKeyword] = useState('');
  const [dtManufacturers, setDtManufacturers] = useState([]);
  const [selectedDtManufacturers, setSelectedDtManufacturers] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [treeData, setTreeData] = useState([]);
  const [resultData, setResultData] = useState([])
  const [dtresultdata, SetDtresultData] = useState([])
  const [showTreeComponent, setShowTreeComponent] = useState(false)
  const [property, SetProperty] = useState([])
  const navigate = useNavigate()
const { SetPropertydata, PropertyData, SetTooltip, tooltip} = useTreeData() 
console.log('prop', PropertyData)
console.log('tooltip', tooltip)
  const API_URL = 'http://localhost:5000/api/library/';

  /**
   * Handles searching by making an API request based on provided parameters and processes the response data.
   * 
   * @param {Object} searchParams -
   * @param {Function} onSuccess -
   * @param {Function} onError 
   */

  const handleSearch = async (searchParams, onSuccess, onError) => {
    const { keyword, related, Eqid, selectedManufacturer, setSnackbarMessage, setSnackbarOpen, selectedEqType, selectedProductLine, selectedProductNumber, selectedDtManufacturers, } = searchParams;
    let searchType = 'Solution';
    let paramXml = '';


    if (keyword) {
      searchType = 'Kwd';
      paramXml = `<Search><NotificationCount>10</NotificationCount><SearchType>${searchType}</SearchType><KwdSearchType>0</KwdSearchType><TextSearched>${keyword}</TextSearched><MfgFilterList>${selectedManufacturer ? selectedManufacturer : selectedDtManufacturers.length > 0 ? selectedDtManufacturers.join(',') : ""}</MfgFilterList><LikeOpeartor /><LikeType /><IncludeRelatedMfg>true</IncludeRelatedMfg><CardModuleFlag>false</CardModuleFlag><RackFlag>false</RackFlag><RMFlag>false</RMFlag><ChassisFlag>false</ChassisFlag><ToSearchOnlyWithShape>true</ToSearchOnlyWithShape><OrderByClause /></Search>`;

    }
    else if (selectedManufacturer || selectedEqType || selectedProductLine || selectedProductNumber) {
      paramXml = `<Search><NotificationCount/><SearchType>Solution</SearchType><SelectedMfg>${selectedManufacturer || ''}</SelectedMfg><SelectedEqType>${selectedEqType || ''}</SelectedEqType><SelectedMfgProdLine>${selectedProductLine || ''}</SelectedMfgProdLine><SelectedMfgProdNo>${selectedProductNumber || ''}</SelectedMfgProdNo><IncludeRelatedMfg>true</IncludeRelatedMfg><CardModuleFlag>false</CardModuleFlag><RackFlag>false</RackFlag><RMFlag>false</RMFlag><ChassisFlag>false</ChassisFlag><ToSearchOnlyWithShape>true</ToSearchOnlyWithShape><OrderByClause /></Search>`;

    } else if (related || '') {
      paramXml = ` <Search><NotificationCount>500</NotificationCount><SearchType>Related</SearchType><EQID>${Eqid}</EQID><MfgFilterList></MfgFilterList><IncludeRelatedMfg>true</IncludeRelatedMfg><ToSearchOnlyWithShape>true</ToSearchOnlyWithShape><OrderByClause /></Search>`
    }
    try {
      const response = await axios.post(`${API_URL}SearchLibraryNew`, {
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
          TreeGroupBy1: "Manufacturer",
          TreeGroupBy2: "Equipment Type",
          TreeGroupBy3: "Product Line",
          TreeGroupBy4: "Product/Model Number",
        },
      });

      const searchData = response.data.Data.SearchData;
      const resultData = searchData?.dtSearchResults || []; // Safely handle if data is missing
      const dtResultdata = searchData?.dtManufacturers || []; // Safely handle if data is missing

      console.log('Result Data:', resultData);
      console.log('dtResult Data:', dtResultdata);

      if (resultData.length > 0) {
        // If there are search results, call onSuccess with resultData
        onSuccess(resultData);
      } else if (dtResultdata.length > 0) {
        onSuccess(dtResultdata);
      } else {
        console.log('No relevant data found');
        // Handle cases where no data is available
        onFailure('No results found');
      }
    } catch (error) {
      console.error('Related not shown:', error.message);
      onFailure('An error occurred while fetching data');
    }

  };

  /**
   * 
   * @param {Array} result
   * @returns {Array}
   */

  const transformToTreeData = (result,) => {
    const tree = [
      {
        title: `Search Results [${result.length}]`,
        key: `search-results-${Date.now()}`,
        icon: <img src="./assets/main_node.png" alt="Search Results Icon" style={{ width: 16, height: 16 }} />,
        children: [],
      },
    ];


    const searchResultsNode = tree[0];

    result.forEach((item) => {
      const {
        MfgAcronym = '',
        Manufacturer = '',
        EQTYPE = '',
        MFGPRODLINE = '',
        MFGPRODNO = '',
        EQID = '',
      } = item;

      let manufacturerNode = searchResultsNode.children.find(
        (child) => child.key === MfgAcronym
      );

      if (!manufacturerNode) {
        manufacturerNode = {
          title: Manufacturer,
          key: MfgAcronym,
          icon: <img src="./assets/manufacturer.png" alt="manufacturer" style={{ width: 16, height: 16 }} />,
          children: [],
        };
        searchResultsNode.children.push(manufacturerNode);
      }

      const eqTypeKey = `${MfgAcronym}-${EQTYPE}`;
      let eqTypeNode = manufacturerNode.children.find(
        (child) => child.key === eqTypeKey
      );

      if (!eqTypeNode) {
        eqTypeNode = {
          title: EQTYPE,
          key: eqTypeKey,
          icon: <img src={`./assets/EqType/${EQTYPE}.png`} alt="EQTYPE" style={{ width: 16, height: 16 }} />,
          children: [],
        };
        manufacturerNode.children.push(eqTypeNode);
      }

      const prodLineKey = `${MfgAcronym}-${EQTYPE}-${MFGPRODLINE}`;
      let prodLineNode = eqTypeNode.children.find(
        (child) => child.key === prodLineKey
      );

      if (!prodLineNode) {
        prodLineNode = {
          title: MFGPRODLINE,
          key: prodLineKey,
          icon: <img src="./assets/product_line.png" alt="product line" style={{ width: 16, height: 16 }} />,
          children: [],

        };
        eqTypeNode.children.push(prodLineNode);
      }

      const productNumberKey = EQID;
      let productnoNode = prodLineNode.children.find(
        (child) => child.key === productNumberKey
      );
     
      if (!productnoNode)  {
        // Filter propertyData for items with GroupName 'Basic' and find the item with pName 'MfgDesc'
        // Create the product node and set the tooltip
        productnoNode = {
        //  title: (
        //     <Tooltip title= {tooltip || 'not passed correctly'}>
        //       <span>{MFGPRODNO}</span>
        //     </Tooltip>
        //   ),
          title: MFGPRODNO,
          key: productNumberKey,
          icon: <img src="./assets/product_no.gif" alt="product no" style={{ width: 16, height: 16 }} />,
          children: [],
          EQID: productNumberKey,
          Type: 'ProductNumber',
          isLeaf: false,
          tooltip: ''
        };
      
        // Add the new product node to the children of prodLineNode
        prodLineNode.children.push(productnoNode);
      
        // Optional: Log the tooltip value for debugging
      }
      
    });

    return tree;
  };
const handleProperty= (value) => {
  SetProperty(value)
}


  const searchParams = {
    keyword,
    selectedManufacturer,
    selectedEqType,
    selectedProductLine,
    selectedProductNumber,
    selectedDtManufacturers,
    setSnackbarMessage,
    setSnackbarOpen,
  };

  const onSuccess = (resultData, dtResultdata) => {
    const treeHierarchy = transformToTreeData(resultData);
    setResultData(resultData);
    SetDtresultData(dtResultdata)


    if (dtResultdata && dtResultdata.length > 0) {
      setDtManufacturers(dtResultdata);
      setIsDialogOpen(true);
    }

    console.log('treeHierarchy', treeHierarchy);
    setTreeData(treeHierarchy);

    if (!resultData && !dtResultdata) {
      setSnackbarMessage(`No results were found for ${keyword}`);
      setSnackbarOpen(true);
    } else if (treeHierarchy && treeHierarchy.length > 0) {
      setShowTreeComponent(true);
    } else {
      console.error('treeHierarchy is undefined or empty');
      setLoading(false);
      setShowTreeComponent(false);
    }
  };

  const onError = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };


  useEffect(() => {
    const fetchManufacturers = async () => {
      setLoading(true);
      try {
        const response = await axios.post('http://localhost:5000/api/library/GetLibraryAvailableManufacturersNew', {
          Email: "",
          SubNo: "000000000000000000001234",
          FullLibrary: false,
          Models: null,
        });
        const manufacturersData = response.data.Data;
        console.log('main', manufacturersData)
        setManufacturers(manufacturersData);

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
          const response = await axios.post('http://localhost:5000/api/library/GetLibraryAvailableEqTypesNew', {
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
          const response = await axios.post('http://localhost:5000/api/library/GetLibraryAvailableProdLinesNew', {
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
            setSelectedProductLine(productLineData[0]);
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
    if (selectedManufacturer && selectedEqType && selectedProductLine) {
      const fetchProductNumber = async () => {
        setLoading(true);
        try {
          const response = await axios.post('http://localhost:5000/api/library/GetLibraryAvailableProdNumbersNew', {
            Email: "",
            SubNo: "000000000000000000001234",
            ActualMfgAcronym: selectedManufacturer,
            EqTypeToGetFor: selectedEqType,
            ProdLineToGetFor: selectedProductLine,
            FullLibrary: false,
          });
          const productNumberData = response.data.Data;
          console.log('pronumber', productNumberData)
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
  }, [selectedManufacturer, selectedEqType, selectedProductLine]);

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

  }, [keyword, manufacturers]);

  useEffect(() => {
    if (selectedManufacturer && selectedEqType && selectedProductLine && selectedProductNumber) {
      handlesearch(searchParams, onSuccess, onError)
    }
  }, [selectedManufacturer && selectedEqType && selectedProductLine && selectedProductNumber])


  const handleManufacturerChange = (event) => {
    setSelectedManufacturer(event.target.value);

    setSelectedEqType('');
    setSelectedProductLine('')
    setSelectedProductNumber('')
    setEqTypes([]);
    setProductLine([]);
    setProductNumber([]);

  };

  const handleEqTypeChange = (event) => {
    setSelectedEqType(event.target.value);
    setSelectedProductLine('')
    setSelectedProductNumber('')
    setProductLine([])
    setProductNumber([])

  }
  const handleproductlinechange = (event) => {
    setSelectedProductLine(event.target.value)
    setSelectedProductNumber('')
    setProductNumber([])

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
  const handleManufacturerSelection = (manufacturer) => {
    setSelectedDtManufacturers((prevSelected) =>
      prevSelected.includes(manufacturer)
        ? prevSelected.filter((item) => item !== manufacturer)
        : [...prevSelected, manufacturer]
    );
  };
  const handleDialogSubmit = () => {
    console.log('Selected Manufacturers:', selectedDtManufacturers);
    setIsDialogOpen(false);
    handlesearch()
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

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  }
  const handlesearch = () => {
    // if (searchParams.keyword && searchParams.keyword.trim() !== "") {
      handleSearch(searchParams, onSuccess, onError);
    // }
  };
  // const handleKeyPress = (event) => {
  //   if (event.key === 'Enter') {
  //     handleSearch();
  //   }
  // };

  const handleBackClick = () => {
    setShowTreeComponent(false);
  };
  return (


    <div
      style={{
        backgroundColor: 'var(--bg-color)',
        height: '100vh',
        display: 'flex',
        overflow: 'hidden',
        flexDirection: 'column',
        overflowY: 'auto',
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

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} sx={{ fontSize: '12px' }}  >
        <DialogTitle sx={{ fontSize: '12px' }}>Select Manufacturers</DialogTitle>
        <DialogContent sx={{ fontSize: '12px' }} >
          <FormControl component="fieldset" sx={{ fontSize: '12px' }} >
            <FormGroup sx={{ fontSize: '12px' }} >
              {dtManufacturers.map((manufacturer, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={selectedDtManufacturers.includes(manufacturer.MfgAcronym)}
                      onChange={() => handleManufacturerSelection(manufacturer.MfgAcronym)}
                      sx={{ fontSize: '12px' }}
                    />
                  }
                  label={manufacturer.Manufacturer}
                  sx={{ fontSize: '12px' }}
                />
              ))}
            </FormGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} sx={{ fontSize: '12px' }}>Cancel</Button>
          <Button onClick={() => handleDialogSubmit()} sx={{ fontSize: '12px' }}>OK</Button>
        </DialogActions>
      </Dialog>


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
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <>
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
          </>

        </Box>
      </Box>

      {!showTreeComponent ? (

        <>

          <Box
            component="form"
            sx={{
              width: '101%',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
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
                  placeholder="By keyword"
                  InputLabelProps={{ style: { color: 'var(--font-color)' } }}
                  InputProps={{
                    style: {
                      color: 'var(--font-color)',
                      borderColor: 'var(--font-color)',
                      fontSize: '12px'
                    },
                  }}
                  onKeyPress={(event) => {
                    if (event.key === 'Enter' && keyword.trim() !== '') {
                      handlesearch();
                      // setLoading(false) // Trigger search when Enter is pressed and keyword is not empty
                    }
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
                    },
                    fontSize: '12px',
                    color: 'var(--font-color)'
                  }}
                />

                {keyword ? (
                  <Snackbar
                    open={snackbarOpen}
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

                ) : (
                  <Snackbar
                    open={snackbarOpen}
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                    <Alert
                      onClose={handleSnackbarClose} severity='error' sx={{ width: '100%' }}
                    >
                      {snackbarMessage}
                    </Alert>
                  </Snackbar>
                )}

              </Grid>

              <Grid item xs={1} >
                <IconButton sx={{ color: 'var(--font-color)', }} size='small' onClick={handlesearch}>
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
                className='nz-searchcombo'
                input={
                  <OutlinedInput
                    notched
                    label={`Manufacturers [${manufacturers.length}]`}
                    sx={{
                      color: 'var(--font-color)',
                      fontSize: '12px',
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'var(--font-color)',
                      },
                      '& .MuiInputBase-input': {
                        fontSize: '12px',
                      },
                    }}
                  />

                }
                renderValue={(selected) => {
                  if (!selected) {
                    return <h1>All</h1>;
                  }
                  const selectedManufacturer = manufacturers.find(manufacturer => manufacturer.MfgAcronym === selected);
                  return selectedManufacturer ? selectedManufacturer.Manufacturer : 'All';
                }}

              >
                {manufacturers.length > 0 && (

                  <MenuItem value="" sx={{ fontSize: '12px' }} >
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
                Equipment Types [{eqTypes.length}]
              </InputLabel>
              <Select
                displayEmpty
                value={selectedEqType}
                className='nz-searchcombo'
                onChange={handleEqTypeChange}
                input={<OutlinedInput notched label={`Equipment Types [${eqTypes.length}]`}
                  sx={{
                    color: 'var(--font-color)',
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--font-color)',
                      fontSize: '12px'
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
                {eqTypes.length > 0 && (
                  <MenuItem value="" sx={{ fontSize: '12px' }}>
                    <h1>All</h1>
                  </MenuItem>
                )}
                {eqTypes.length > 0 ? (
                  eqTypes.map((eqtype) => (
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
                Product Lines [{productLine.length}]
              </InputLabel>
              <Select
                displayEmpty
                value={selectedProductLine}
                className='nz-searchcombo'
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
                {productLine.length > 0 && (

                  <MenuItem value="" sx={{ fontSize: '12px' }}>
                    <h1>All</h1>
                  </MenuItem>
                )}
                {productLine.length > 0 ? (
                  productLine.map((productLine) => (
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
                Product Numbers [{productNumber.length}]
              </InputLabel>
              <Select
                displayEmpty
                value={selectedProductNumber}
                onChange={handleproductnumber}
                className='nz-searchcombo'
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
                {productNumber.length > 0 && (

                  <MenuItem value="" sx={{ fontSize: '12px' }}>
                    <h1>All</h1>
                  </MenuItem>
                )}
                {productNumber.length > 0 ? (
                  productNumber.map((pnumber) => (
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
              fontSize: { xs: '12px', sm: '15px' },
              fontWeight: 'bold',
              textAlign: 'center',
              fontFamily: 'Segoe UI, sans-serif',
              padding: '0 12px',
            }}
          >
            Now you can create professional quality Visio Diagrams and PowerPoint Presentations using High Quality Shapes and Stencils.
          </Typography>
        </>


      ) : (


        <Box
          sx={{
            display: showTreeComponent ? 'block' : 'none',
            width: '100%',
            height: '100vh',
            marginTop: '0px',
            padding: '0px',
            // overflowY:'auto'
          }}
        >
          {showTreeComponent && treeData.length > 0 ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', }}>


                <Tooltip title="Back" placement="bottom-end">
                  <IconButton sx={{ color: 'var(--font-color)', padding: 0 }} onClick={handleBackClick}>
                    <ArrowBackIcon />
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
              <Treedata treeData={treeData} searchResult={resultData} handleprop={handleProperty} />
            </>
          ) : (
            <div>No data available for the tree.</div>
          )}
        </Box>
      )}
    </div>
  );
}
export default SearchComponent

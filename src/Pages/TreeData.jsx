import React, { useContext, useEffect, useState } from 'react';
import Tree from 'rc-tree';
import '../App.css';
import 'rc-tree/assets/index.css';
import data from '../Links.json';
import { useLocation, useNavigate } from 'react-router';
import { Box, Tooltip, IconButton, Typography, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import { useTreeData } from '../Context/TreedataContext';
import RelatedDevice from '../Components/RelatedDevice';
import PropertyTable from '../Components/PropertyTable';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
// import * as Office from "@microsoft/office-js";




const Treedata = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { treeData, setTreeData, addLeafNode, setRelatedDevice, setEqId } = useTreeData();
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [searchData, SetSearchData] = useState();
  const [expandedEQIDs, setExpandedEQIDs] = useState(new Set());
  const [tabValue, setTabValue] = useState(0);
  const [relatedDevicesVisible, setRelatedDevicesVisible] = useState(false);
  const [relatedDevicesData, setRelatedDevicesData] = useState([]);
  const [propertyData, setPropertyData] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [svgContent, setSvgContent] = useState(null);
  const [stencilresponse, SetStencilResponse] = useState([])
  const [shapedata ,setShapeData] = useState([])

// const {setRelatedDevice} = useTreeData()

  useEffect(() => {
    const { treeData: initialTreeData } = location.state || {};
    if (initialTreeData) {
      setTreeData(initialTreeData);
      console.log('initialdata', initialTreeData);
      autoExpandNodes(initialTreeData);
    }
  }, [location.state, setTreeData]);

  useEffect(() => {
    const { searchResult: searchdata } = location.state || {};
    if (searchdata) {
      console.log('searchdata', searchdata);
      SetSearchData(searchdata);
    }
  }, [location.state]);

  const handleClick = () => {
    window.open(data.logourl, '_blank');
  };

  const handleBackClick = () => {
    navigate('/mainpage');
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const switcherIcon = ({ expanded, isLeaf }) => {
    if (isLeaf) {
      return null;
    }

    return expanded ? <ExpandMoreIcon /> : <ChevronRightIcon />;
  };
  
  const autoExpandNodes = async (nodes, currentLevel = 0, keys = []) => {
    if (nodes.length !== 1) {
      return keys;
    }

    const node = nodes[0];
    keys.push(node.key);

    const matchingSearchData = searchData?.find((data) => data.EQID === node.key);
    if (matchingSearchData && !expandedEQIDs.has(node.key)) {
      console.log('Auto-expand: Condition met for EQID:', node.key);
      await callApiAndAddLeafNode(node);
      setExpandedEQIDs((prev) => new Set(prev).add(node.key));
    }


    if (node.children && node.children.length === 1) {
      await autoExpandNodes(node.children, currentLevel + 1, keys);
    } else if (node.children && node.children.length > 1) {

      // const firstChild = node.children[0];
      // setSelectedKeys([firstChild.key]);
      // handleSelect()
    }

    return keys;
  };

  const generateUniqueKey = () => {
    return `visio_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  };
  console.log('123456', generateUniqueKey)

  const callApiAndAddLeafNode = async (selectedNode) => {
    setIsLoading(true);
    try {
      const eqId = selectedNode.key;
      const [response, stencilResponse] = await Promise.all([
        axios.post('http://localhost:8000/library/GetDeviceShapes', {
          Email: '',
          SubNo: '000000000000000000001234',
          EQID: eqId,
          Get3DShapes: true,
        }),
        axios.post('http://localhost:8000/library/GetStencilNameByEQID', { EQID: [eqId] }),
      ]);
  
      const shapesData = response.data.Data;
      setShapeData(shapesData)
      const stencilsData = stencilResponse.data.Data[0].StencilName;
      console.log('56565', shapesData);
      SetStencilResponse(stencilResponse);
  
      const shapeLeafNodes = shapesData.map((shape) => ({
        key: shape.ShapeID,
        title: shape.Description,
        icon: shape.Description.toLowerCase().includes('front') ? (
          <img src='./assets/Front.png' alt="Front icon" />
        ) : shape.Description.toLowerCase().includes('rear') ? (
          <img src='./assets/Rear.png' alt="Rear icon" />
        ) : null,
        isLeaf: true,
        children: [],
      }));
  
      const stencilLeafNode = {
        key: generateUniqueKey(),
        title: 'visio',
        icon: <img src='/assets/visio.png' alt="icon" />,
        isLeaf: true,
        children: [],
        onClick: () => handleDownload(stencilsData[0].URL),  // Handle click for download
      };
  
      setSvgContent(null);
      addLeafNode(selectedNode.key, ...shapeLeafNodes, stencilLeafNode);
  
      // Maintain the current expanded keys and add the selected node's key if not already present
      setExpandedKeys((prevExpandedKeys) => {
        if (!prevExpandedKeys.includes(selectedNode.key)) {
          return [...prevExpandedKeys, selectedNode.key];
        }
        return prevExpandedKeys;
      });
  
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  


  const handleDownload = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = ''; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };



  const callApiForLeafNodePreview = async (shapeId) => {
    try {
      const response = await axios.post('http://localhost:8000/library/GetDevicePreview', {
        Email: '',
        SubNo: '000000000000000000001234',
        ShapeID: shapeId,
      });
      setSvgContent(response.data.Data.SVGFile);

      const resposedevice = response.data.Data.SVGFile
      // console.log('device ', resposedevice)
      console.log('Device Preview Response:', response.data);
    } catch (error) {
      console.error('Error fetching device preview:', error);
    }
  };

  const handleSelect = async (selectedKeys, info) => {
    const selectedNode = info.node;
    const eqId = selectedNode.key;

    if (!expandedKeys.includes(eqId)) {
      setSelectedKeys([eqId]);
      await callApisOnNodeSelect(eqId);
    }

    if (selectedNode.isLeaf && selectedNode.key) {
      await callApiForLeafNodePreview(selectedNode.key);

    }
  };

  const setPropertyValuesFromXML = (librarypropertywithskeloton, PropertyXMLString) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(PropertyXMLString, "text/xml");

      const updatedPropertyData = librarypropertywithskeloton.map((item) => {
        const propertyName = item.pName;
        const matchingElement = xmlDoc.querySelector(`Basic > ${propertyName}`);
        let newValue = matchingElement ? matchingElement.textContent.trim() : item.pValue;

        if (item.pType === 'number') {
          const numericValue = parseFloat(newValue);
          newValue = isNaN(numericValue) ? item.pValue : numericValue;
        }

        return {
          ...item,
          pValue: newValue,
        };
      });

      setPropertyData(updatedPropertyData);
    } catch (error) {
      console.error('Error parsing XML or setting property values:', error);
    }
  };

  const handleExpand = async (expandedKeys, info) => {
    const selectedNode = info.node;
    const eqId = selectedNode.key;

    if (expandedKeys.includes(eqId)) {
      const matchingSearchData = searchData?.find((data) => data.EQID === eqId);
      if (matchingSearchData) {
        console.log('Manual expand: Condition met for EQID:', eqId);
        setSelectedKeys([eqId]);
        setSvgContent(null);
        await callApiAndAddLeafNode(selectedNode);
        await callApisOnNodeSelect(eqId);

        setExpandedEQIDs((prev) => new Set(prev).add(eqId));
      } else {
        console.log('Manual expand: Condition not met for EQID:', eqId);
      }
    } else {
      const matchingSearchData = searchData?.find((data) => data.EQID === eqId);
      if (matchingSearchData) {
        console.log('Collapse detected: Selecting node due to matching condition:', eqId);
        setSelectedKeys([eqId]);
        setSvgContent(null);
        await callApisOnNodeSelect(eqId);
      } else {

        setPropertyData([]);
        setTabValue(0);
      }
    }

    setExpandedKeys(expandedKeys);
  };

  useEffect(() => {
  if (treeData.length > 0) {
      (async () => {
        const keysToExpand = await autoExpandNodes(treeData);
        setExpandedKeys(keysToExpand);
      })();
    }
  }, [treeData])
  
  

  const callApisOnNodeSelect = async (eqId) => {
    setIsLoading(true);
    try {
      const [relatedDevicesResponse, libraryPropertyResponse] = await Promise.all([
        axios.post('http://localhost:8000/library/HasRelatedDevices', {
          Email: '',
          SubNo: '000000000000000000001234',
          EQID: eqId,
        }),
        axios.post('http://localhost:8000/library/GetLibraryPropertyWithSkeleton', {
          Email: '',
          SubNo: '000000000000000000001234',
          EQID: eqId,
          FullLib: false,
          PropertyIDToShow: [],
        }),
      ]);

      console.log('Related Devices:', relatedDevicesResponse.data);
      console.log('Library Property:', libraryPropertyResponse.data);

      const librarypropertywithskeloton = libraryPropertyResponse.data.Data.libPropDetails.dtPropertySetSkeleton;
      const PropertyXMLString = libraryPropertyResponse.data.Data.libPropDetails.PropertyXMLString;
      const relatedDevice = relatedDevicesResponse.data === true
      console.log('789456', relatedDevice) 

      // setRelatedDevice(relatedDevice)
      // setEqId(eqId)

      setPropertyValuesFromXML(librarypropertywithskeloton, PropertyXMLString);

      if (relatedDevicesResponse.data === true) {
        setRelatedDevicesVisible(true);

        setRelatedDevicesData(relatedDevicesResponse.data);
      } else {
        setRelatedDevicesVisible(false);
        setTabValue(0);
      }
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleDrop = async (info) =>{
    // const Office = await import("@microsoft/office-js")
    const droppedNode = info.node;
    const shapeId = droppedNode.key;

    if (shapeId) {
      try {
        const response = await axios.post('http://localhost:8000/library/GetDevicePreviewToDrawOnSlide', {
          Email: 'your-email@example.com', // Replace with actual email
          SubNo: '000000000000000000001234', // Replace with actual SubNo
          ShapeID: shapeId,
        });

        const previewData = response.data;
        await insertSvgIntoWord(previewData);

      } catch (error) {
        console.error('API Error:', error);
      }
    }
  };

  const insertSvgIntoWord = async (svgContent) => {
    try {
      await Word.run(async (context) => {
        const base64Image = `data:image/svg+xml;base64,${btoa(svgContent)}`;
        
        const range = context.document.getSelection(); // Get the current selection in the Word document
        range.insertInlinePictureFromBase64(base64Image, Word.InsertLocation.end);

        await context.sync();
      });
    } catch (error) {
      console.error('Word Error:', error);
    }
  };




  return (
    <div style={{
      height: '100vh'
    }}>

      <div
        style={{
          backgroundColor: 'var(--bg-color)',
          height: '100vh',
          width: '100%',
          padding: '9px',
          boxSizing: 'border-box',
          overflowY: 'auto',
          display: 'flex',
          color: 'var(--font-color)',
          flexDirection: 'column',
          fontFamily: ['Segoe UI', 'sans-serif'],
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
          <Typography sx={{ marginLeft: '8px', fontSize: '12px' }}>
            Visit
          </Typography>
          <Tooltip title="Visit VisioStencils website" placement="bottom-end">
            <Typography
              sx={{
                marginLeft: '8px',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '12px',
              }}
              onClick={handleClick}
            >
              VisioStencils.com
            </Typography>
          </Tooltip>
        </Box>

        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Result" />
          {relatedDevicesVisible && <Tab label="Related" />}
        </Tabs>

        <Backdrop
          sx={{
            color: '#fff',
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        <div>

          {tabValue === 0 && (
            <>
              <Tree
                treeData={treeData}
                switcherIcon={switcherIcon}
                defaultExpandAll={false}
                showIcon={true}
                className="custom-rc-tree"
                expandedKeys={expandedKeys}
                onExpand={handleExpand}
                onSelect={handleSelect}
                selectedKeys={selectedKeys}
                draggable
                onDragStart={(info) => console.log("drag start", info.node)}
                onDrop={handleDrop}
              />
              {propertyData.length > 0 && <PropertyTable propertyData={propertyData} svgContent={svgContent} stencilResponse={stencilresponse} />
              }
            </>
          )}
        </div>

        {tabValue === 1 && relatedDevicesVisible && (
          <RelatedDevice relatedDevicesData={relatedDevicesData} />
        )}


      </div>
    </div>
  );
};


export default Treedata;

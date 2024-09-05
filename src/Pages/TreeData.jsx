import React, { useContext, useEffect, useState } from 'react';
import Tree from 'rc-tree';
import '../App.css';
import 'rc-tree/assets/index.css';
import data from '../Links.json';
import { useNavigate } from 'react-router';
import { Box, Tooltip, IconButton, Typography, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Button } from '@mui/material';
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
import { handleSearch, transformToTreeData } from '../Components/utils';

const Treedata = ({ treeData: initialTreeData, searchResult: searchdata, }) => {
  const navigate = useNavigate();
  const { treeData, relatedTree, setRelatedTree, setTreeData, addLeafNode, addLeafNodeToRelatedTree } = useTreeData();

  const [expandedKeys, setExpandedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [searchData, SetSearchData] = useState();
  const [expandedEQIDs, setExpandedEQIDs] = useState(new Set());
  const [tabValue, setTabValue] = useState(0);
  const [relatedDevicesVisible, setRelatedDevicesVisible] = useState(false);
  const [relatedDevicesData, setRelatedDevicesData] = useState([]);
  const [propertyData, setPropertyData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [svgContent, setSvgContent] = useState(null);
  const [stencilResponse, SetStencilResponse] = useState([]);
  const [shapeData, setShapeData] = useState([]);
  const [Eqid, SetEqId] = useState();
  const [related, setRelated] = useState('');

  useEffect(() => {

    if (initialTreeData) {
      setTreeData(initialTreeData);
      console.log('initial treeData', initialTreeData);
      autoExpandNodes(initialTreeData);
  
    }
  }, []);

  useEffect(() => {
  
    if (searchdata) {
      console.log('searchResult', searchdata);
      SetSearchData(searchdata);
    }
  }, []);


  useEffect(() => {

    const savedExpandedKeys = [...expandedKeys];

    if (treeData.length > 0 || relatedTree.length > 0) {
      (async () => {
        const keysToExpand = await autoExpandNodes(treeData, relatedTree);
        setExpandedKeys([...savedExpandedKeys, ...keysToExpand]); // Combine saved and new expanded keys
      })();
    }
  }, [treeData, relatedTree]);

  const handleClick = () => {
    window.open(data.logourl, '_blank');
  };

  const handleBackClick = () => {
    navigate('');
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

    // Check if node should be expanded based on searchData or relatedTree
    const matchingSearchData = searchData?.find((data) => data.EQID === node.key);
    const matchingRelatedTree = relatedTree?.find((data) => data.EQID === node.key);

    // Do not call API if the node already has children (it's already expanded)
    if (!node.children || node.children.length === 0) {
      if ((matchingSearchData || matchingRelatedTree) && !expandedEQIDs.has(node.key)) {
        console.log('Auto-expand: Condition met for EQID:', node.key);
        await callApiAndAddLeafNode(node);
        setExpandedEQIDs((prev) => new Set(prev).add(node.key));

        // After adding the leaf node, select the first leaf and call callApiForLeafNodePreview
        const leafNodes = node.children?.filter(child => child.isLeaf) || [];
        if (leafNodes.length > 0) {
          const firstLeafNode = leafNodes[0];
          await callApiForLeafNodePreview(firstLeafNode.key);
        }
      }
    }

    // Recursive call only if there is exactly one child and no duplicate leaf node is being added
    if (node.children && node.children.length === 1) {
      const child = node.children[0];

      // Avoid redundant calls by checking if a leaf node has already been added
      if (!child.isLeaf || !expandedEQIDs.has(child.key)) {
        await autoExpandNodes(node.children, currentLevel + 1, keys);
      }
    }

    return keys;
  };



  const generateUniqueKey = () => {
    return `visio_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  };

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
      const stencilsData = stencilResponse.data?.Data[0]?.StencilName;
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
        onClick: () => handleDownload(stencilsData[0].URL),
      };

      setSvgContent(null);
      addLeafNode(selectedNode.key, ...shapeLeafNodes, stencilLeafNode);
      addLeafNodeToRelatedTree(selectedNode.key, ...shapeLeafNodes, stencilLeafNode);


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

    // Strictly check if `eqId` is in `expandedKeys`
    const isAlreadyExpanded = selectedKeys.some((key) => key === eqId); // 

    if (!isAlreadyExpanded) {
      // If `eqId` is not already expanded, select the node and call APIs
      // setSelectedKeys([eqId]);
      await callApisOnNodeSelect(eqId);
    }

    if (selectedNode.isLeaf && selectedNode.key) {
      // If the selected node is a leaf node, call the API for leaf node preview
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

  const handleExpand = async (expandedKeys, info, isRelatedTree = false) => {
    const selectedNode = info.node;
    const eqId = selectedNode.key;

    // Determine if the node is being expanded or collapsed
    const isExpanding = expandedKeys.includes(eqId);

    if (isExpanding) {
      // Expanding the node
      if (!isRelatedTree) {
        // Handle expansion for search tree
        const matchingSearchData = searchData?.find((data) => data.EQID === eqId);
        if (matchingSearchData) {
          console.log('Expanding node in search tree for EQID:', eqId);
          setSelectedKeys([eqId]);
          setSvgContent(null);

          // Only call `callApiAndAddLeafNode` if the leaf node has not been added yet
          if (!expandedEQIDs.has(eqId)) {
            await callApiAndAddLeafNode(selectedNode);
            setExpandedEQIDs((prev) => new Set(prev).add(eqId));
          }

          await callApisOnNodeSelect(eqId);
        } else {
          console.log('Expand: Condition not met for EQID in search tree:', eqId);
          setSelectedKeys([]);
        }
      } else {
        // Handle expansion for related tree
        const matchingRelatedTree = relatedTree?.find((data) => data.EQID === eqId);
        if (matchingRelatedTree) {
          console.log('Expanding node in related tree for EQID:', eqId);
          setSelectedKeys([eqId]);
          setSvgContent(null);

          // Only call `callApiAndAddLeafNode` if the leaf node has not been added yet
          if (!expandedEQIDs.has(eqId)) {
            await callApiAndAddLeafNode(selectedNode);
            setExpandedEQIDs((prev) => new Set(prev).add(eqId));
          }

          await callApisOnNodeSelect(eqId);
        } else {
          console.log('Expand: Condition not met for EQID in related tree:', eqId);
          setSelectedKeys([]);
        }
      }
    } else {
      // Collapsing the node
      if (!isRelatedTree) {
        // Handle collapsing for search tree
        const matchingSearchData = searchData?.find((data) => data.EQID === eqId);
        if (matchingSearchData) {
          console.log('Collapse detected in search tree for EQID:', eqId);
          setSelectedKeys([eqId]);
          setSvgContent(null);
          await callApisOnNodeSelect(eqId);
        } else {
          setPropertyData([]); // Clear property data when no match
        }
      } else {

        const matchingRelatedTree = relatedTree?.find((data) => data.EQID === eqId);
        if (matchingRelatedTree) {
          console.log('Collapse detected in related tree for EQID:', eqId);
          setSelectedKeys([eqId]);
          setSvgContent([eqId]);
          await callApisOnNodeSelect(eqId);
        }
      }
    }


    setExpandedKeys(expandedKeys);
  };




  //   if (isRelatedTree) {
  //     setExpandedKeys((prevKeys) => [...prevKeys, ...expandedKeys]);
  //   } else {
  //     setExpandedKeys(expandedKeys);
  //   }
  // };



  const searchParams = {
    related,
    Eqid
  }

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

      const relatedDevice = relatedDevicesResponse.data === true;
      console.log('Related Device:', relatedDevice);

      SetEqId(eqId); // Ensure eqId is stored for further use

      // Setting property values from the response XML
      setPropertyValuesFromXML(librarypropertywithskeloton, PropertyXMLString);

      if (relatedDevice) {
        setRelatedDevicesVisible(true); // Show Related Devices tab if there are related devices
      } else {
        setRelatedDevicesVisible(false);
      }
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);

    if (newValue === 1 && relatedDevicesVisible) {
      setPropertyData([])
      handleSearch({ Eqid, related: true }, onRelatedSuccess);
    }
  }

  const onRelatedSuccess = (resultData) => {
    const RelatedTree = transformToTreeData(resultData);
    console.log('Related Tree:', RelatedTree);
    setRelatedTree(RelatedTree)
    // setRelatedDevicesVisible(true)
    setIsLoading(false);
    // setTabValue(0)
  }


  const handleDragStart = (info) => {
    const { node } = info;

    // Check if the node is a leaf
    if (!node.isLeaf) {
      // Prevent drag start if the node is not a leaf
      console.log("Cannot drag this node. It is not a leaf node.");
      // Optionally, set a custom property or message to indicate why dragging is disabled
      info.event.dataTransfer.effectAllowed = 'none';
      info.event.preventDefault();
    } else {
      // Allow dragging if the node is a leaf
      console.log("Drag start allowed for node:", node);
    }
  };

  const handleDrop = async (info) => {
    const droppedNode = info.node;
    const shapeId = droppedNode.key;

    // Check if the node is a leaf node and if its key matches the ShapeID
    if (droppedNode.isLeaf && shapeId) {
      try {
        const response = await axios.post('http://localhost:8000/library/GetDevicePreviewToDrawOnSlide', {
          Email: '',
          SubNo: '000000000000000000001234',
          ShapeID: shapeId,
        });

        const previewData = response.data;
        console.log('preview', previewData);
        // await insertSvgIntoWord(previewData);

      } catch (error) {
        console.error('API Error:', error);
      }
    } else {
      console.log('Node is not a leaf or does not have a valid ShapeID.');
    }
  };



  // const insertSvgIntoWord = async (svgContent) => {
  //   try {
  //     await Word.run(async (context) => {
  //       const base64Image = `data:image/svg+xml;base64,${btoa(svgContent)}`; // Convert SVG content to Base64

  //       const range = context.document.getSelection(); // Get the current selection in the Word document
  //       range.insertInlinePictureFromBase64(base64Image, Word.InsertLocation.end); // Insert the image

  //       await context.sync();
  //     });
  //   } catch (error) {
  //     console.error('Word Error:', error);
  //   }
  // };



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
          <Tab
            label="Result"
            disableRipple
            sx={{
              fontSize: '12px',
              fontFamily: '"Segoe UI", sans-serif',
              textTransform: 'none',
              color: '#ffffff',
            }}
          />
          {relatedDevicesVisible && (
            <Tab
              label="Related"
              disableRipple
              sx={{
                fontSize: '12px',
                fontFamily: '"Segoe UI", sans-serif',
                textTransform: 'none',
                color: 'white',
                '& .MuiTab-wrapper': {
                  color: 'white',
                  display: 'flex',
                },
              }}
            />
          )}
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
                onDragStart={handleDragStart}
                onDrop={handleDrop}
              />

              {propertyData.length > 0 && <PropertyTable propertyData={propertyData} svgContent={svgContent} stencilResponse={stencilResponse} />}
            </>
          )}

          {tabValue === 1 && relatedDevicesVisible && (
            <>
              <Tree
                treeData={relatedTree}
                switcherIcon={switcherIcon}
                defaultExpandAll={false}
                showIcon={true}
                className="custom-rc-tree"
                expandedKeys={expandedKeys}
                onExpand={handleExpand}
                onSelect={handleSelect}
                selectedKeys={selectedKeys}
              />
              {propertyData.length > 0 && <PropertyTable propertyData={propertyData} svgContent={svgContent} stencilResponse={stencilResponse} />}
            </>

          )}
        </div>

      </div>
    </div>
  );
};


export default Treedata;

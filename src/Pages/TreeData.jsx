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
import PropertyTable from '../Components/PropertyTable';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import { handleSearch, transformToTreeData } from '../Components/utils.jsx';
// import  {Office from '@microsoft/office-js'

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
  const [relatedtreedata, setRelatedtreedata] = useState([])

  useEffect(() => {

    if (initialTreeData) {
      setTreeData(initialTreeData);
      console.log('initial treeData', initialTreeData);
      // (initialTreeData);
  
    }
  }, []);

  useEffect(() => {
    if (searchdata) {
      console.log('searchResult', searchdata);
      SetSearchData(searchdata);
    }
  }, []);

    // useEffect(() => {
    //   const savedExpandedKeys = [...expandedKeys];
    //   const savedSelectedKeys = [...selectedKeys];
    
    //   if (treeData.length > 0) {
    //     // If treeData is present, auto-expand and select nodes
    //     const { keys: keysToExpand, selectedKeys: keysToSelect } = autoExpandNodes(treeData, savedExpandedKeys, savedSelectedKeys);
        
    //     // Apply auto-expanded keys only when tree data changes
    //     setExpandedKeys([...new Set(keysToExpand)]);
    //     setSelectedKeys([...new Set(keysToSelect)]);
    //   }
    // }, [treeData, relatedTree]);
  
  

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
  // const autoExpandNodes = (nodes, keys = [], selectedKeys = []) => {
  //   if (!nodes || nodes.length === 0) {
  //     return { keys, selectedKeys };
  //   }
  
  //   for (const node of nodes) {
  //     // Prevent recursion if the node is already expanded
  //     if (!keys.includes(node.key)) {
  //       keys.push(node.key); // Expand the current node
  
  //       if (node.children && node.children.length === 1) {
  //         // If the node has only one child, expand it recursively
  //         const { keys: childKeys, selectedKeys: childSelectedKeys } = autoExpandNodes(node.children, keys, selectedKeys);
  //         keys.push(...childKeys); // Recursively add child nodes to the expanded keys
  //         selectedKeys.push(...childSelectedKeys);
  //       } else if (node.children && node.children.length > 1) {
  //         // If the node has multiple children, expand it and select the first child
  //         selectedKeys.push(node.children[0].key); // Select the first child
  //         const { keys: childKeys, selectedKeys: childSelectedKeys } = autoExpandNodes(node.children, keys, selectedKeys);
  //         keys.push(...childKeys); // Recursively handle the children
  //         selectedKeys.push(...childSelectedKeys);
  //       }
  //     }
  //   }
  
  //   return { keys, selectedKeys };
  // };
  // function autoExpandNodes(nodes, keys = [], selectedKeys = []) {
  //   for (const node of nodes) {
  //     if (node.key) {
  //       keys.push(node.key); // Expand the current node
  
  //       if (node.children && node.children.length === 1 ) {
  //         // If the node has only one child, expand it recursively
  //         const { keys: childKeys, selectedKeys: childSelectedKeys } = autoExpandNodes(node.children, keys, selectedKeys);
  //         keys.push(...childKeys);
  //         selectedKeys.push(...childSelectedKeys);
  //       } else{
  //       //  if (node.children && node.children.length > 1) {
  //       //   // If the node has more than one child, select the first child and stop the loop
  //       //   const firstChild = node.children[0];
  //       //   if (firstChild.key) {
  //       //     keys.push(firstChild.key); // Expand the first child node
  //       //     // selectedKeys.push(firstChild.key); // Select the first child node
  //       //   }
  //         break; // Stop further expansion
  //       }
  //     }
  //   }
  
  //   return { keys, selectedKeys };
  // }
  
  const handleExpand = (expandedKeys, { node }) => {
    let newExpandedKeys = [...expandedKeys];
  
    newExpandedKeys = autoExpandNode(node, newExpandedKeys, handleSelect);
  
    setExpandedKeys(newExpandedKeys);
  };
  

  const autoExpandNode = (node, expandedKeys = [], handleSelect) => {
    if (node.children && node.children.length === 1) {
      const singleChild = node.children[0];
      if (!expandedKeys.includes(singleChild.key)) {
        expandedKeys.push(singleChild.key);
        handleSelect([singleChild.key], { node: singleChild }); // Select the single child
      }
      // Recursively auto-expand if the single child also has a single child
      autoExpandNode(singleChild, expandedKeys, handleSelect);
    } else if (node.children && node.children.length > 1) {
      // Select the first child if multiple children exist
      handleSelect([node.children[0].key], { node: node.children[0] });
    }
  
    return expandedKeys;
  };
  

  const generateUniqueKey = () => {
    return `visio_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  };

 // Function to call GetDeviceShapes API and add leaf nodes
const getDeviceShapes = async (selectedNode, addLeafNode, addLeafNodeToRelatedTree, eqid) => {
  try {
    const eqId = selectedNode.key;
    const response = await axios.post('http://localhost:8000/library/GetDeviceShapes', {
      Email: '',
      SubNo: '000000000000000000001234',
      EQID: eqId,

      Get3DShapes: true,
    });

    const shapesData = response.data.Data;
    setShapeData(shapesData);

    // Generate leaf nodes from shape data
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

    // Add the generated leaf nodes to the tree
    addLeafNode(selectedNode.key, ...shapeLeafNodes);
    addLeafNodeToRelatedTree(selectedNode.key, ...shapeLeafNodes);

    return shapesData;
  } catch (error) {
    console.error('Error fetching device shapes:', error);
    return [];
  }
};

// Function to call GetStencilNameByEQID API and handle stencil response
const getStencilNameByEQID = async (selectedNode, handleDownload, addLeafNode, addLeafNodeToRelatedTree, eqid) => {
  try {
    // const eqId = selectedNode.key;
    const response = await axios.post('http://localhost:8000/library/GetStencilNameByEQID', {
      EQID: [eqid],
    });

    const stencilData = response.data?.Data[0]?.StencilName;
    console.log('stencilname', stencilData)
    SetStencilResponse(stencilData);

    // Generate the visio leaf node
    const stencilLeafNode = {
      key: generateUniqueKey(),
      title: 'visio',
      icon: <img src='/assets/visio.png' alt="icon" />,
      isLeaf: true,
      onClick: () => handleDownload(stencilData?.[0]?.URL),
      children: []
    };

    // Add the visio node to the tree
    addLeafNode(selectedNode.key, stencilLeafNode);
    addLeafNodeToRelatedTree(selectedNode.key, stencilLeafNode);

    return stencilData;
  } catch (error) {
    console.error('Error fetching stencil name:', error);
    return [];
  }
};
const getStencilNameByEQIDoncollaps = async (selectedNode, handleDownload,eqid) => {
  try {
    // const eqId = selectedNode.key;
    const response = await axios.post('http://localhost:8000/library/GetStencilNameByEQID', {
      EQID: [eqid],
    });

    const stencilData = response.data?.Data[0]?.StencilName;
    console.log('stencilname', stencilData)
    SetStencilResponse(stencilData);

    // Generate the visio leaf node
    const stencilLeafNode = {
      key: generateUniqueKey(),
      title: 'visio',
      icon: <img src='/assets/visio.png' alt="icon" />,
      isLeaf: true,
      onClick: () => handleDownload(stencilData?.[0]?.URL),
      children: []
    };

    // Add the visio node to the tree
    addLeafNode(selectedNode.key, stencilLeafNode);
    addLeafNodeToRelatedTree(selectedNode.key, stencilLeafNode);

    return stencilData;
  } catch (error) {
    console.error('Error fetching stencil name:', error);
    return [];
  }
};

// Main function to handle API calls and add leaf nodes
const callApiforDeviceShapeStencilEqid = async (selectedNode) => {
  setIsLoading(true);
  try {
    const eqId = selectedNode.key; // Correctly extract eqId

    // Call the two APIs in parallel and include the logic for adding nodes
    await Promise.all([
      getDeviceShapes(selectedNode, addLeafNode, addLeafNodeToRelatedTree, eqId), // Pass the correct eqId
      getStencilNameByEQID(selectedNode, handleDownload, addLeafNode, addLeafNodeToRelatedTree, eqId), // Pass the correct eqId
    ]);

    // Set expanded keys to show the expanded node
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

  const RelatedandLibraryProperty = async (eqId) => {
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

  const callApiForGetDevicePreview = async (shapeId) => {
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

  const findMatchingNodeInTree = (tree, eqid) => {
    for (const node of tree) {
      if (node.key === eqid) {
        return node;
      }
      if (node.children && node.children.length > 0) {
        const foundNode = findMatchingNodeInTree(node.children, eqid);
        if (foundNode) {
          return foundNode; 
        }
      }
    }
    return null; 
  };

  
  const handleSelect = async (selectedKeys, info) => {
    const selectedNode = info.node;
    const eqid = selectedNode.key;
    console.log('Selected node key:', eqid);

    const isNodeExpanded = expandedKeys.includes(eqid);
    console.log('Is node expanded:', isNodeExpanded);

    const matchingShapeData = shapeData.find(shape => shape.ShapeID === eqid);
    const matchingRelatedTreeNode = findMatchingNodeInTree(relatedtreedata, eqid);

    // Toggle expansion
    const newExpandedKeys = isNodeExpanded
        ? expandedKeys.filter((key) => key !== eqid)
        : [...expandedKeys, eqid];

    setExpandedKeys(newExpandedKeys);
    setSelectedKeys([eqid]);

    const matchingTreeData = searchData?.find((data) => data.EQID === eqid);

    console.log('Matching Tree Data:', matchingTreeData);

    if (matchingShapeData) {
        console.log('Shape data matches for ShapeID:', eqid);
        await callApiForGetDevicePreview(eqid);
    
        return;
    }

    if (matchingTreeData) {
        console.log('Node selected with EQID in treeData:', eqid);
        setSvgContent(null);

        if (isNodeExpanded) {
            console.log('Collapsing node and calling API:', eqid);
            await RelatedandLibraryProperty(eqid);
        } else {
            console.log('Expanding node and calling APIs:', eqid);

            // Only call API if the node has no children (i.e., it's a leaf node or not expanded before)
            if (!selectedNode.children || selectedNode.children.length === 0) {
                await callApiforDeviceShapeStencilEqid(selectedNode);
                await RelatedandLibraryProperty(eqid);

                // Automatically expand nodes if a single child detected
                if (selectedNode.children && selectedNode.children.length === 1) {
                    // await autoExpandNodes(selectedNode.children, 0, newExpandedKeys);
                    setExpandedKeys(newExpandedKeys);
                }
            } else {
                console.log('Node already has children, skipping API call:', eqid);
            }
        }
    } else {
        console.log('No matching EQID found in treeData for selected node:', eqid);
        setPropertyData([]);
    }
};


  // const handleExpand = async (expandedKeys, info, isRelatedTree = false) => {
  //   const selectedNode = info.node;
  //   const eqId = selectedNode.key;
  //   const isExpanding = expandedKeys.includes(eqId);
  //   if (isExpanding) {
      
  //     if (!isRelatedTree) {
  //       const matchingSearchData = searchData?.find((data) => data.EQID === eqId);
  //       if (matchingSearchData) {
  //         console.log('Expanding node in search tree for EQID:', eqId);
  //         setSelectedKeys([eqId]);
  //         setSvgContent(null);
          

  //         if (!expandedEQIDs.has(eqId)) {
  //           await callApiforDeviceShapeStencilEqid(selectedNode); 
  //           setExpandedEQIDs((prev) => new Set(prev).add(eqId));
  //         }
  //       } else {
  //         console.log('Expand: Condition not met for EQID in search tree:', eqId);
  //         setSelectedKeys([eqId]);
  //       }
  //     } else {

  //       const matchingRelatedTree = relatedTree?.find((data) => data.EQID === eqId);
  //       if (matchingRelatedTree) {
  //         console.log('Expanding node in related tree for EQID:', eqId);
  //         setSelectedKeys([eqId]);
  //         setSvgContent(null);
  

  //         if (!expandedEQIDs.has(eqId)) {
  //           await callApiforDeviceShapeStencilEqid(selectedNode); 
  //           setExpandedEQIDs((prev) => new Set(prev).add(eqId));
  //         }
  //       } else {
  //         console.log('Expand: Condition not met for EQID in related tree:', eqId);
  //         setSelectedKeys([]);
  //       }
  //     }
  //   } else {
  //     // Collapsing the node
  //     if (!isRelatedTree) {
  //       // Handle collapsing for search tree
  //       const matchingSearchData = searchData?.find((data) => data.EQID === eqId);
  //       if (matchingSearchData) {
  //         console.log('Collapse detected in search tree for EQID:', eqId);
  //         setSelectedKeys([eqId]);
  //         setSvgContent(null);
  //         await RelatedandLibraryProperty(eqId); // Call the API for collapsing
  //       } else {
  //         setPropertyData([]);
  //       }
  //     } else {
  //       // Handle collapsing for related tree
  //       const matchingRelatedTree = relatedTree?.find((data) => data.EQID === eqId);
  //       if (matchingRelatedTree) {
  //         console.log('Collapse detected in related tree for EQID:', eqId);
  //         setSelectedKeys([eqId]);
  //         setSvgContent([eqId]);
  //         await RelatedandLibraryProperty(eqId); // Call the API for collapsing
  //       }
  //     }
  //   }
  // };
  
  
  //   const selectedNode = info.node;
  //   const eqId = selectedNode.key;
  //   const shapid = selectedNode.key

  //   // Strictly check if `eqId` is in `expandedKeys`
  //   const isAlreadyExpanded = selectedKeys.some((key) => key === eqId); // 

  //   if (!isAlreadyExpanded) {
  //     await callApisOnNodeSelect(eqId);
  //   }
  //   if (selectedNode.key) {
  //     await callApiForLeafNodePreview(selectedNode.key);
  //   }
  // };


  // const handleExpand = (newExpandedKeys, { node }) => {
  //   // Call autoExpandNodes on the expanded node's children
  //   // const { keys: autoExpandedKeys } = autoExpandNodes(node.children || []);
    
  //   // Merge the new expanded keys with the auto-expanded keys, ensuring they are unique
  //   setExpandedKeys([...new Set([...newExpandedKeys, ...autoExpandedKeys])]);
  // };
  
  


//   const handleExpand = (newExpandedKeys, { node }) => {
//     const autoExpandedKeys = autoExpandNodes(node.children).keys;
//     setExpandedKeys([...new Set([...newExpandedKeys, ...autoExpandedKeys])]); // Ensure keys are unique
// };


  const handleDownload = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const searchParams = {
    related,
    Eqid
  }
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);

    if (newValue === 1 && relatedDevicesVisible) {
      setPropertyData([])
      setIsLoading(true)
      handleSearch({ Eqid, related: true }, onRelatedSuccess);
    }
  }

  const onRelatedSuccess = (resultData) => {
    const RelatedTree = transformToTreeData(resultData);
    console.log('Related Tree:', RelatedTree);
    setRelatedTree(RelatedTree)
    setRelatedtreedata(RelatedTree)
    
    setIsLoading(false);
    // setTabValue(0)
  }

  const handleDragStart = (info) => {
    const { node } = info;

    // Check if the node is a leaf
    if (!node.isLeaf || !node.key) {
      console.log("Cannot drag this node. It is not a leaf node or does not have a ShapeID.");
      info.event.dataTransfer.effectAllowed = 'none';
      info.event.preventDefault();
    } else {
      console.log("Drag start allowed for node:", node);
    }
  };


  const handleDrop = async (info) => {
    const droppedNode = info.node;
    const shapeId = droppedNode.key;

    if (droppedNode.isLeaf && shapeId) {
      try {
        // Call the API to get the SVG content
        const response = await axios.post('http://localhost:8000/library/GetDevicePreviewToDrawOnSlide', {
          Email: '',
          SubNo: '000000000000000000001234',
          ShapeID: shapeId,
        });

        const previewData = response.data;
        console.log('Preview data:', previewData);

        if (previewData && previewData.svgContent) {
          // Insert SVG into Word
          await insertSvgIntoWord(previewData.svgContent);
        } else {
          console.warn('No SVG content found in API response.');
        }
      } catch (error) {
        console.error('API Error:', error);
      }
    } else {
      console.log('Node is not a leaf or does not have a valid ShapeID.');
    }
  };

  const insertSvgIntoWord = async (svgContent) => {
    try {
      // Convert SVG content to a base64 string
      const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
      const reader = new FileReader();
  
      reader.onloadend = async () => {
        const base64data = reader.result.split(',')[1];
  
        // Insert the SVG image as a base64-encoded image into Word
        await Office.context.document.setSelectedDataAsync(
          base64data,
          { coercionType: Office.CoercionType.Image },
          (asyncResult) => {
            if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
              console.log('SVG image inserted into Word document.');
            } else {
              console.error('Failed to insert SVG:', asyncResult.error.message);
            }
          }
        );
      };
  
      reader.readAsDataURL(svgBlob);
    } catch (error) {
      console.error('Failed to insert SVG into Word:', error);
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
          <Tab
            label="Result"
            disableRipple
            sx={{
              fontSize: '12px',
              fontFamily: '"Segoe UI", sans-serif',
              textTransform: 'none',
              color: '#ffffff',
              padding:'0px'
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
                onSelect={handleSelect}
                onExpand={handleExpand}
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

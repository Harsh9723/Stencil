import React, {useEffect, useState, useMemo } from 'react';
import Tree from 'rc-tree';
import '../App.css';
import 'rc-tree/assets/index.css';
import { useNavigate } from 'react-router';
import { Tabs, Tab,  } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import { useTreeData } from '../Context/TreedataContext';
import PropertyTable from '../Components/PropertyTable';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import { handleSearch, transformToTreeData } from '../Components/utils.jsx';
import SvgContent from '../Components/SvgContent.jsx';

const Treedata = ({ treeData: initialTreeData, searchResult: searchdata, }) => {
  const navigate = useNavigate();

  const { treeData, relatedTree, setRelatedTree, setTreeData, addLeafNode, addLeafNodeToRelatedTree } = useTreeData();
  // State for the first tree
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);

  // State for the relatedTree
  const [relatedExpandedKeys, setRelatedExpandedKeys] = useState([]);
  const [relatedSelectedKeys, setRelatedSelectedKeys] = useState([]);

  const [searchData, SetSearchData] = useState();
  const [expandedEQIDs, setExpandedEQIDs] = useState(new Set());
  const [tabValue, setTabValue] = useState(0);
  const [relatedDevicesVisible, setRelatedDevicesVisible] = useState(false);
  const [relatedDevicesData, setRelatedDevicesData] = useState([]);
  const [propertyData, setPropertyData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [svgContent, setSvgContent] = useState(null);
  const [stencilResponse, SetStencilResponse] = useState([]);
  const [Eqid, SetEqId] = useState();
  const [related, setRelated] = useState('');
  const [relatedtreedata, setRelatedtreedata] = useState([])

  useEffect(() => {
    if (initialTreeData) {
      setTreeData(initialTreeData);
      autoExpandDefaultNodesOfTree(initialTreeData).then(async ({ expandedKeys, selectedKeys, selectedNode, IsSelected }) => {
  
        setExpandedKeys(expandedKeys);
        // setSelectedKeys(selectedNode.key)
        if (selectedNode.Type && selectedNode.EQID && IsSelected == false) {

          let result = await callApiforDeviceShapeStencilEqid(selectedNode)
      
          if (result && result.shapenodes?.length > 0) {
            setSelectedKeys([result.shapenodes[0].key])
            if (result && result.shapenodes[0].ShapeID) {
              callApiForGetDevicePreview(result.shapenodes[0].ShapeID)
            }
          }
        } else if (
          selectedNode.Type && selectedNode.EQID && IsSelected == true) {
          RelatedandLibraryProperty(selectedNode.EQID)
          setSelectedKeys([selectedNode.key]);  
        }else {
          setSelectedKeys([selectedNode.key])
        }
        console.log('ex', expandedKeys)
        console.log('Sk', selectedKeys)
        console.log('selectednode', selectedNode)
      });
      console.log('initial treeData', initialTreeData);
    }
  }, [initialTreeData]);

  useEffect(() => {
    if (searchdata) {
      console.log('searchResult', searchdata);
      SetSearchData(searchdata);
    }
  }, []);

  const autoExpandDefaultNodesOfTree = async (treeData) => {
    let expKeys = [];
    let selKeys = [];
    let selNodes = null;
    let IsSelected = false;

    const ExpandAuto = async (nodes) => {
      for (let index = 0; index < nodes.length; index++) {
        const element = nodes[index];
        expKeys.push(element.key); // Expand this node

        if (element.children && element.children.length === 1) {
          // Auto-expand nodes with only one child
          await ExpandAuto(element.children);
          IsSelected = false
        } else if (element.children && element.children.length > 1) {
          // If a node has multiple children, select the first child after expanding
          expKeys.push(element.key); // Expand this node
          selKeys.push(element.children[0].key); // Select the first child
          selNodes = element.children[0];
          IsSelected = true;
          break; // Stop traversal
        } else {
          selKeys.push(element.key);
          selNodes = element;
          break;
        }
      }
    };

    await ExpandAuto(treeData);

    // Check if selected node has an EQID and call the API
    // if (selNodes && selNodes.EQID) {
    //    await callApiforDeviceShapeStencilEqid(selNodes);
    // }

    return { expandedKeys: expKeys, selectedKeys: selKeys, selectedNode: selNodes, IsSelected };
  };




  const switcherIcon = ({ expanded, isLeaf }) => {
    if (isLeaf) {
      return null;
    }

    return expanded ? <ExpandMoreIcon /> : <ChevronRightIcon />;
  };
  const memoizedTreeData = useMemo(() => treeData, [treeData]);
  const memoizedRelatedTreeData = useMemo(() => relatedTree, [relatedTree]);


  const generateUniqueKey = () => {
    return `visio_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  };
  // Function to call GetDeviceShapes API and add leaf nodes
  const getDeviceShapes = async (selectedNode, addLeafNode, eqid, setSelectedNode) => {
    try {
      const eqId = selectedNode.key;
      const response = await axios.post('http://localhost:5000/api/library/GetDeviceShapes', {
        Email: '',
        SubNo: '000000000000000000001234',
        EQID: eqId,
        Get3DShapes: true,
      });

      const shapesData = response.data.Data;

      // Generate leaf nodes from shape data
      const shapeLeafNodes = shapesData.map((shape) => ({
        key: shape.ShapeID,
        title: shape.Description,
        ShapeID: shape.ShapeID,
        icon: shape.Description.toLowerCase().includes('front') ? (
          <img src='./assets/Front.png' alt="Front icon" />
        ) : shape.Description.toLowerCase().includes('rear') ? (
          <img src='./assets/Rear.png' alt="Rear icon" />
        ) : null,
        isLeaf: true,
        children: [],
      }));

      // Add the generated leaf nodes to the tree (result or related, based on function passed)
      addLeafNode(selectedNode.key, ...shapeLeafNodes);
      if(relatedTree){
        addLeafNodeToRelatedTree(selectedNode.key, ...shapeLeafNodes)
      }
      return shapeLeafNodes;
    } catch (error) {
      console.error('Error fetching device shapes:', error);
      return [];
    }
  };

  // Function to call GetStencilNameByEQID API and handle stencil response
  const getStencilNameByEQID = async (selectedNode, addLeafNode, eqid) => {
    try {
      const response = await axios.post('http://localhost:5000/api/library/GetStencilNameByEQID', {
        EQID: [eqid],
      });

      const stencilData = response.data?.Data[0]?.StencilName;
      console.log('stencildata', stencilData)
      const visioDownloadUrl = response.data?.Data[0]?.URL;
      SetStencilResponse(stencilData)
      const handleVisioDownload = () => {
        if (visioDownloadUrl) {
          const link = document.createElement('a');
          link.target = '_blank'
          link.href = visioDownloadUrl;
          link.download = 'visio_image.png';
          document.body.appendChild(link);
          link.click();

          document.body.removeChild(link);
        } else {
          console.error('Visio download URL is not available');
        }
      };

      const stencilLeafNode = {
        key: generateUniqueKey(),
        title: 'visio',
        icon: <img src='/assets/visio.png' alt="icon" />,
        isLeaf: true,
        children: [],
        visioDownloadUrl: visioDownloadUrl,
        onClick: handleVisioDownload,
      };

      // Add the Visio node to the correct tree
      addLeafNode(selectedNode.key, stencilLeafNode);
      if(relatedTree.length > 0 ){
      addLeafNodeToRelatedTree(selectedNode.key, stencilLeafNode)

      }
      return stencilLeafNode
    } catch (error) {
      console.error('Error fetching stencil name:', error);
      return [];
    }
  };
  const getStencilName = async (eqid) => {
    try {
      const response = await axios.post('http://localhost:5000/api/library/GetStencilNameByEQID', {
        EQID: [eqid],
      });

      const stencilData = response.data?.Data[0]?.StencilName;
      console.log('stencildata', stencilData)
      // const visioDownloadUrl = response.data?.Data[0]?.URL;
      SetStencilResponse(stencilData)
      return stencilData
    } catch (error) {
      console.error('Error fetching stencil name:', error);
      return [];
    }
  };


  const getStencilNameByEQIDoncollaps = async (selectedNode, eqid) => {
    try {
      // const eqId = selectedNode.key;
      const response = await axios.post('http://localhost:5000/api/library/GetStencilNameByEQID', {
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
        // onClick: () => handleDownload(stencilData?.[0]?.URL),
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
  const callApiforDeviceShapeStencilEqid = async (selectedNode, isRelatedTree = false) => {
    setIsLoading(true);

    try {
      const eqId = selectedNode.EQID; // Correctly extract eqId

      // Choose the appropriate function based on the tree type
      const addLeafNodeFn = isRelatedTree ? addLeafNodeToRelatedTree : addLeafNode;

      // Call the two APIs in parallel and include the logic for adding nodes
      let shapenodes = await getDeviceShapes(selectedNode, addLeafNodeFn, eqId);
      let stencilNode = await getStencilNameByEQID(selectedNode, addLeafNodeFn, eqId); // Pass only the necessary addLeafNode function

      return { shapenodes, stencilNode }
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
        axios.post('http://localhost:5000/api/library/HasRelatedDevices', {
          Email: '',
          SubNo: '000000000000000000001234',
          EQID: eqId,
        }),
        axios.post('http://localhost:5000/api/library/GetLibraryPropertyWithSkeleton', {
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
      const response = await axios.post('http://localhost:5000/api/library/GetDevicePreview', {
        Email: '',
        SubNo: '000000000000000000001234',
        ShapeID: shapeId,
      });
      setSvgContent(response.data.Data.SVGFile);
      // console.log('svgfile', response.data.Data.SVGFile)
      setPropertyData([])

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

  const handleExpandRelatedTree = async (expandedKeys, { node, expanded }) => {
    let newExpandedKeys = [...expandedKeys];
    const eqid = node.EQID;
    console.log('Expand/Collapse related tree node:', eqid);
  
    // If the node is collapsed, remove it from the expanded keys
    if (!expanded) {
      newExpandedKeys = newExpandedKeys.filter(key => key !== node.key);
      setRelatedExpandedKeys(newExpandedKeys);
      setRelatedSelectedKeys([node.key])

      if(node.EQID && node.Type){
        console.log('calling property table api for related tree')
        await RelatedandLibraryProperty(node.EQID)
        await getStencilName(node.EQID)
      }
      return; // Exit to prevent auto-expand
    }
  
    // Auto-expand related nodes if necessary and get the selected node
    const { expandedKeys: autoExpandedKeys, selectedKeys: autoSelectedKeys, selectedNode, IsSelected } = await autoExpandDefaultNodesOfTree([node]);
  
    // Merge the expanded keys with the new expanded keys
    newExpandedKeys = Array.from(new Set([...newExpandedKeys, ...autoExpandedKeys]));
    setRelatedExpandedKeys(newExpandedKeys);
  
    // Set the selected key to the first child node's key if children exist
    if (autoSelectedKeys.length > 0) {
      setRelatedSelectedKeys(autoSelectedKeys);
    }
  
    console.log('Selected Related Node:', selectedNode);
    console.log('Auto-selected related keys:', autoSelectedKeys);
  
    // Implement the logic for calling APIs based on conditions similar to the main tree logic
  
    if (selectedNode.Type && selectedNode.EQID && IsSelected === true) {
      // Call API for related device shape/stencil if the node is not already selected
      await RelatedandLibraryProperty(selectedNode.EQID)
      await getStencilName(selectedNode.EQID)
      setRelatedSelectedKeys(autoSelectedKeys);
    } else if (selectedNode.Type && selectedNode.EQID && IsSelected === false) {
     
      let result = await callApiforDeviceShapeStencilEqid(selectedNode);
  
      if (result && result.shapenodes?.length > 0) {
        setRelatedSelectedKeys([result.shapenodes[0].key]);
        if (result.shapenodes[0].ShapeID) {
          callApiForGetDevicePreview(result.shapenodes[0].ShapeID);
        }
      } 
    } else if(selectedNode.ShapeID){
      await callApiForGetDevicePreview(selectedNode.ShapeID)
    }
  
    console.log('Related Tree Expanded Keys:', newExpandedKeys);
    console.log('Related Tree Selected Keys:', autoSelectedKeys);
  };
  

  const handleExpandMainTree = async (expandedKeys, { node, expanded }) => {
    let newExpandedKeys = [...expandedKeys];
    const eqid = node.EQID;
    console.log('Expand/Collapse node:', eqid);

    // If the node is collapsed, remove it from the expanded keys and select the collapsed node
    if (!expanded) {
      newExpandedKeys = newExpandedKeys.filter(key => key !== node.key);
      setExpandedKeys(newExpandedKeys);
      setSelectedKeys([node.key]);

      // Check if node has EQID and Type, and call API if conditions are met
      if (node.EQID && node.Type) {
        console.log('Calling RelatedandLibraryProperty for node EQID:', node.EQID);
        await RelatedandLibraryProperty(node.EQID);
        await getStencilName(node.EQID);
      }
      return; // Exit after collapsing and setting the node as selected
    }

    // Auto-expand nodes if necessary and get the selected node
    const { expandedKeys: autoExpandedKeys, selectedKeys: autoSelectedKeys, selectedNode, IsSelected } = await autoExpandDefaultNodesOfTree([node]);

    // Merge the expanded keys with the new expanded keys
    newExpandedKeys = Array.from(new Set([...newExpandedKeys, ...autoExpandedKeys]));
    setExpandedKeys(newExpandedKeys);

    // Set the selected key to the first child node's key if children exist
  
    if (autoSelectedKeys.length > 0) {
      setSelectedKeys(autoSelectedKeys);
    }

    console.log('Selected Node:', selectedNode);
    console.log('Auto-selected keys:', autoSelectedKeys);

    
    if (selectedNode.Type && selectedNode.EQID && IsSelected === true) {
      await RelatedandLibraryProperty(selectedNode.EQID);
      await getStencilName(selectedNode.EQID);
      setSelectedKeys(autoSelectedKeys);
    } else if (selectedNode.Type && selectedNode.EQID && IsSelected === false) {
      let result = await callApiforDeviceShapeStencilEqid(selectedNode);
      if (result && result.shapenodes?.length > 0) {
        setSelectedKeys([result.shapenodes[0].key]);
        if (result.shapenodes[0].ShapeID) {
          callApiForGetDevicePreview(result.shapenodes[0].ShapeID);
        }
      }
    }else if (selectedNode.ShapeID){
      await callApiForGetDevicePreview(selectedNode.ShapeID)
    }

    console.log('Expanded Keys:', newExpandedKeys);
    console.log('Selected Keys:', autoSelectedKeys);
};


  const handleSelectMainTree = async (selectedKeys, info) => {
    if (tabValue !== 0) return;
  
    const selectedNode = info.node;
    console.log("selected node info",selectedNode)
  
    setSelectedKeys([selectedNode.key]);
  
    if (selectedNode.key.includes('visio') && selectedNode.visioDownloadUrl) {
      selectedNode.onClick(); // Trigger download
      return;
    }
  
    console.log('Selected Node:', selectedNode);  
    console.log('Auto-selected keys:', selectedNode);
  
    // Call API to get device preview if ShapeID is present
    if (selectedNode.ShapeID) {
  
      await callApiForGetDevicePreview(selectedNode.ShapeID);
    }
      else if (selectedNode.Type && selectedNode.EQID) {
        await RelatedandLibraryProperty(selectedNode.EQID);
        await getStencilName(selectedNode.EQID);
  
        // Update selected keys with the current node key
        setSelectedKeys([selectedNode.key]);
      }
    console.log('Selected Keys:', selectedKeys);
  };
  
  



  useEffect(() => {
    console.log('resultExpanded', expandedKeys)
    console.log('relatedExpanded', relatedExpandedKeys)
  }, [expandedKeys, relatedExpandedKeys])

  const handleSelectRelatedTree = async (selectedKeys, info) => {
    if (tabValue !== 1) return; // Only proceed if the related tab is active

    const selectedNode = info.node;
    setRelatedSelectedKeys([selectedNode.key]);

    if(selectedNode.EQID && selectedNode.Type){
      await RelatedandLibraryProperty(selectedNode.EQID)
      await getStencilName(selectedNode.EQID)

      setRelatedSelectedKeys([selectedNode.key])
    } else if(selectedNode.ShapeID){
      await callApiForGetDevicePreview(selectedNode.ShapeID)

      setRelatedSelectedKeys([selectedNode.key])
    }
    console.log('related selected node', selectedNode.key)
  };


  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);

    if (newValue === 1 && relatedDevicesVisible) {
      // Reset propertyData and selected keys for related tree
      setPropertyData([]);
      setSvgContent(null)

      // setSelectedKeys([]);
      handleSearch({ Eqid, related: true }, onRelatedSuccess);
      setIsLoading(true);

    }

    if (newValue === 0) {
      // Reset propertyData and selected keys for result tree when switching back to the result tab
      setPropertyData([]);
      setSvgContent(null)
      // setRelatedSelectedKeys([]); // Clear selected keys for related tree
    }
    setIsLoading(false) 
  };
  useEffect(() => {
    console.log('resultSelected', selectedKeys)
    console.log('relatedSelected', relatedSelectedKeys)
  }, [selectedKeys, relatedSelectedKeys])


  const onRelatedSuccess = async (resultData) => {
    try {
      const RelatedTree = transformToTreeData(resultData);
      console.log('Related Tree:', resultData);
      setRelatedTree(RelatedTree)

      // Automatically expand and select nodes
      const { expandedKeys, selectedKeys, selectedNode } = await autoExpandDefaultNodesOfTree(RelatedTree);
  
      // Update expanded and selected keys for the related tree
      setRelatedExpandedKeys(expandedKeys);
      setRelatedSelectedKeys(selectedKeys);
  
      // Check if the selected node has an EQID and call the API if needed
      if (selectedNode && selectedNode.EQID) {
        await callApiforDeviceShapeStencilEqid(selectedNode, true);  // `true` to indicate it's related tree
      }
    } catch (error) {
      console.error('Error handling related tree data:', error);
    }
  };;
  useEffect(() => {
    if (relatedTree) {
      setRelatedTree(relatedTree); 
      console.log() 
      autoExpandDefaultNodesOfTree(relatedTree).then(async ({ expandedKeys, selectedKeys, selectedNode, IsSelected }) => {
    
        setRelatedExpandedKeys(expandedKeys);
        if (selectedNode.Type == 'ProductNumber' && selectedNode.EQID && IsSelected == false) {
          let resultRelated = await callApiforDeviceShapeStencilEqid(selectedNode)
          
          if (resultRelated && resultRelated.shapenodes?.length > 0) {
            setRelatedSelectedKeys([resultRelated.shapenodes[0].key])
            if (resultRelated && resultRelated.shapenodes[0].ShapeID) {
              callApiForGetDevicePreview(resultRelated.shapenodes[0].ShapeID)
            }
          }
        } else if (
          selectedNode.Type && selectedNode.EQID && IsSelected == true) {
          RelatedandLibraryProperty(selectedNode.EQID)
          // setRelatedSelectedKeys(selectedKeys);  

        }
        console.log('exRelated', expandedKeys)
        console.log('SkRelated', selectedKeys)
        console.log('selectednode', selectedNode)
      });
      console.log('initial treeData', relatedTree);
    }
  }, [relatedTree]);



 // Handle the drag start event
 let draggedSvgContent = ''; 

 // Handle the drag start event
 const handleDragStart = async (info) => {
   const { node } = info;
   console.log('Drag started on node:', node);
 
   try {
     // Call the API to get the SVG content
     const response = await axios.post('http://localhost:5000/api/library/GetDevicePreviewToDrawOnSlide', {
       Email: '', 
       SubNo: '000000000000000000001234', 
       ShapeID: node.ShapeID
     });
 
     if (response && response.data && response.data.Data && response.data.Data.SVGFile) {
       // Store the SVG content in a global variable
       draggedSvgContent = response.data.Data.SVGFile;
       console.log('SVG content fetched and stored:', draggedSvgContent);
     } else {
       console.error('No SVG content found in API response');
     }
 
     return response;
   } catch (error) {
     console.error('API Error:', error);
   }
 };
 
 // Handle the drop event
 const handleDrop = async (info) => {
  const {node } = info
  console.log('dropped  node', node)
   try {

    const response = await axios.post('http://localhost:5000/api/library/GetDevicePreviewToDrawOnSlide', {
      Email: '', 
      SubNo: '000000000000000000001234', 
      ShapeID: node.ShapeID
    });

const svg = response.data.Data.SVGFile
     // Check if the SVG content is available
     if (svg) {
       console.log('Inserting SVG into Word document:', svg);
 
       // Insert the SVG image into Word
       await Office.context.document.setSelectedDataAsync(
         svg,
         { coercionType: Office.CoercionType.XmlSvg }, // Ensure the coercion type is set to XML/SVG
         (asyncResult) => {
           if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
             console.log('SVG image successfully inserted into Word document.');
           } else {
             console.error('Failed to insert SVG image:', asyncResult.error.message);
           }
         }
       );
     } else {
       console.warn('No SVG content available for drop.');
     }
   } catch (error) {
     console.error('Error during drop:', error);
   }
 };
 
 const handleDoubleClick = async (info) => {
  console.log('Double-click event info:', info); // Log the entire info object
  
  const  node  = info.node || {}; // Safely destructure node

  if ( node.ShapeID) {
    console.log('Condition met. Fetching SVG for node:', node.key);

    try {
      const response = await axios.post('http://localhost:5000/api/library/GetDevicePreviewToDrawOnSlide', {
        Email: '',
        SubNo: '000000000000000000001234',
        ShapeID: node.ShapeID, // Assuming ShapeID exists on the node
      });

      if (response && response.data && response.data.Data && response.data.Data.SVGFile) {
        const svgContent = response.data.Data.SVGFile;
        console.log('Received SVG content:', svgContent);

        await Office.context.document.setSelectedDataAsync(
          svgContent,
          { coercionType: Office.CoercionType.XmlSvg },
          (Result) => {
            if (Result.status === Office.AsyncResultStatus.Succeeded) {
              console.log('SVG image successfully inserted into Word.');
            } else {
              console.error('Failed to insert SVG image:', Result.error.message);
            }
          }
        );
      } else {
        console.error('No SVG content found in API response');
      }
    } catch (error) {
      console.error('API Error:', error);
    }
  } else {
    console.warn('Condition not met. Node or key is undefined.');
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
        {/* <Box
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
        </Box> */}

        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab
            label="Result"
            disableRipple
            sx={{
              fontSize: '12px',
              fontFamily: '"Segoe UI", sans-serif',
              textTransform: 'none',
              color: '#ffffff',
              padding: '0px'
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
      {/* Main Tree Rendering */}
      <Tree
        treeData={treeData}
        switcherIcon={switcherIcon}
        defaultExpandAll={false}
        showIcon={true}
        className="custom-rc-tree"
        expandedKeys={expandedKeys}
        onSelect={handleSelectMainTree}
        onExpand={handleExpandMainTree}
        onDoubleClick={handleDoubleClick}
        selectedKeys={selectedKeys}
        draggable
        onDragStart={handleDragStart}
        onDrop={handleDrop}
      />

      {/* Conditionally render PropertyTable or SvgContent */}
      {propertyData && propertyData.length > 0 ? (
        <PropertyTable propertyData={propertyData} stencilResponse={stencilResponse} />
      ) : (
        svgContent && svgContent.length > 0 && <SvgContent svgContent={svgContent}  />
      )}
    </>
  )}

  {tabValue === 1 && relatedDevicesVisible && (
    <>
      {/* Related Tree Rendering */}
      <Tree
        treeData={relatedTree}
        switcherIcon={switcherIcon}
        defaultExpandAll={false}
        showIcon={true}
        className="custom-rc-tree"
        expandedKeys={relatedExpandedKeys}
        onSelect={handleSelectRelatedTree}
        onExpand={handleExpandRelatedTree}
      
        selectedKeys={relatedSelectedKeys}
      />

      {/* Conditionally render PropertyTable or SvgContent */}
      {Array.isArray(propertyData) && propertyData.length > 0 ? (
        <PropertyTable propertyData={propertyData} stencilResponse={stencilResponse} />
      ) : (
        svgContent && svgContent.length > 0 && <SvgContent svgContent={svgContent} />
      )}
    </>
  )}
</div>




      </div>
    </div>
  );
};


export default Treedata;

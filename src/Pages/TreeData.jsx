import React, { useEffect, useState, useMemo } from 'react';
import Tree from 'rc-tree';
import '../App.css';
import 'rc-tree/assets/index.css';
import { Tabs, Tab, } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import { useTreeData } from '../Context/TreedataContext';
import PropertyTable from '../Components/PropertyTable';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import SvgContent from '../Components/SvgContent.jsx';
import BASE_URL from '../Config/Config.js';
import { insertSvgContentIntoOffice } from '../Common/CommonFunction.jsx';
import { handleSearch, transformToTreeData } from '../Common/CommonFunction.jsx';
const Treedata = ({ treeData: initialTreeData, searchResult: searchdata,  }) => {

  const { treeData, relatedTree, setRelatedTree, setTreeData, addLeafNode, addLeafNodeToRelatedTree,
  } = useTreeData();

  const [expandedKeys, setExpandedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [selectednode, SetSelectedNode] = useState([])
  const [relatedExpandedKeys, setRelatedExpandedKeys] = useState([]);
  const [relatedSelectedKeys, setRelatedSelectedKeys] = useState([]);
  const [relatedselectednode, SetRelatesSelectedNode] = useState([])
  const [searchData, SetSearchData] = useState();
  const [tabValue, setTabValue] = useState(0);
  const [relatedDevicesVisible, setRelatedDevicesVisible] = useState(false);
  const [propertyData, setPropertyData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [svgContent, setSvgContent] = useState(null);
  const [stencilResponse, SetStencilResponse] = useState([]);
  const [Eqid, SetEqId] = useState(null);
  const [shapeCounter, setShapeCounter] = useState(0);


  useEffect(() => {
    if (initialTreeData) {
      setTreeData(initialTreeData);
      autoExpandDefaultNodesOfTree(initialTreeData).then(async ({ expandedKeys, selectedKeys, selectedNode, IsSelected }) => {
        setExpandedKeys(expandedKeys);
        if (selectedNode.Type && selectedNode.EQID && IsSelected === false) {

          let result = await callApiforDeviceShapeStencilEqid(selectedNode)

          if (result && result.shapenodes?.length > 0) {
            setSelectedKeys([result.shapenodes[0].key])
            SetSelectedNode(result.shapenodes[0])
            if (result && result.shapenodes[0].ShapeID) {
              callApiForGetDevicePreview(result.shapenodes[0].ShapeID)
            }
          }
        } else if (
          selectedNode.Type && selectedNode.EQID && IsSelected === true) {
          RelatedandLibraryProperty(selectedNode.EQID)
          getStencilName(selectedNode.EQID)
          setSelectedKeys([selectedNode.key]);
          SetSelectedNode([selectedNode])
        } else {
          setSelectedKeys([selectedNode.key])
          SetSelectedNode([selectedNode])
        }
        console.log('ex', expandedKeys)
        console.log('Sk', selectedKeys)
        console.log('selectednode', selectedNode)
      });
      console.log('initial treeData', initialTreeData);
    }
  }, [initialTreeData]);


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
          IsSelected = false
          await ExpandAuto(element.children);
        } else if (element.children && element.children.length > 1) {
          expKeys.push(element.key); // Expand this node
          selKeys.push(element.children[0].key);
          selNodes = element.children[0];
          IsSelected = true
          break;
        } else {
          selKeys.push(element.key);
          selNodes = element;
          break;
        }
      }
    };
    await ExpandAuto(treeData);
    return { expandedKeys: expKeys, selectedKeys: selKeys, selectedNode: selNodes, IsSelected };
  };


  const switcherIcon = ({ expanded, isLeaf }) => {
    if (isLeaf) {
      return null;
    }
    return expanded ? <ExpandMoreIcon /> : <ChevronRightIcon />;
  };
  const generateUniqueKey = () => {
    return `visio_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  };
  const getDeviceShapes = async (selectedNode, addLeafNode, eqid, setSelectedNode, isRelatedTree = false) => {

    try {
      const eqId = selectedNode.key;
      const response = await axios.post(`${BASE_URL}GetDeviceShapes`, {
        Email: '',
        SubNo: '000000000000000000001234',
        EQID: eqId,
        Get3DShapes: true,
      });

      const shapesData = response.data.Data;

      // Generate leaf nodes from shape data
      const shapeLeafNodes = shapesData.map((shape) => ({
        key: shape.ShapeID,
        title: (
          <span title={`Drag and Drop to insert ${shape.Description} view`} placement='bottom-end'>
            <span>{shape.Description}</span>
          </span>
        ),
        ShapeID: shape.ShapeID,
        EqId: eqId,
        icon: shape.Description.toLowerCase().includes('front') ? (
          <img src='./assets/Front.png' alt="Front icon" />
        ) : shape.Description.toLowerCase().includes('rear') ? (
          <img src='./assets/Rear.png' alt="Rear icon" />
        ) : shape.Description.toLowerCase().includes('top') ? (
          <img src='./assets/TopView.png' alt="Top Icon" />
        ) : null,
        isLeaf: true,
        children: [],
      }));

      if (!isRelatedTree && treeData) {
        addLeafNode(selectedNode.key, ...shapeLeafNodes);
      }
      if (isRelatedTree && relatedTree) {
        addLeafNodeToRelatedTree(selectedNode.key, ...shapeLeafNodes);
      }
      return shapeLeafNodes;
    } catch (error) {
      console.error('Error fetching device shapes:', error);
      return [];
    }
  };


  const getStencilNameByEQID = async (selectedNode, addLeafNode, eqid, isRelatedTree = false) => {
    try {
      const response = await axios.post(`${BASE_URL}GetStencilNameByEQID`, {
        EQID: [eqid],
      });

      const stencilData = response.data?.Data[0]?.StencilName;
      console.log('stencildata', stencilData);
      const visioDownloadUrl = response.data?.Data[0]?.URL;
      SetStencilResponse(stencilData);
      const handleVisioDownload = () => {
        if (visioDownloadUrl) {
          const link = document.createElement('a');
          link.target = '_blank';
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
        title: (
          <span title={`Drag and Drop to save`} placement='bottom-end'>
            <span>Visio Stencil</span>
          </span>
        ),
        icon: <img src='/assets/visio.png' alt="icon" />,
        isLeaf: true,
        children: [],
        visioDownloadUrl: visioDownloadUrl,
        onClick: handleVisioDownload,
      };
      if (!isRelatedTree && treeData) {
        addLeafNode(selectedNode.key, stencilLeafNode);
      }
      if (isRelatedTree && relatedTree) {
        addLeafNodeToRelatedTree(selectedNode.key, stencilLeafNode);
      }
      return stencilLeafNode;
    } catch (error) {
      console.error('Error fetching stencil name:', error);
      return [];
    }
  };

  const getStencilName = async (eqid) => {
    try {
      const response = await axios.post(`${BASE_URL}GetStencilNameByEQID`, {
        EQID: [eqid],
      });

      const stencilData = response.data?.Data[0]?.StencilName;
      console.log('stencildata', stencilData)
      SetStencilResponse(stencilData)
      return stencilData
    } catch (error) {
      console.error('Error fetching stencil name:', error);
      return [];
    }
  };

  const callApiforDeviceShapeStencilEqid = async (selectedNode, isRelatedTree = false) => {
    setIsLoading(true);

    try {
      const eqId = selectedNode.EQID;
      const addLeafNodeFn = isRelatedTree ? addLeafNodeToRelatedTree : addLeafNode;

     
      let shapenodes = await getDeviceShapes(selectedNode, addLeafNodeFn, eqId);
      let stencilNode = await getStencilNameByEQID(selectedNode, addLeafNodeFn, eqId); 

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
        axios.post(`${BASE_URL}HasRelatedDevices`, {
          Email: '',
          SubNo: '000000000000000000001234',
          EQID: eqId,
        }),
        axios.post(`${BASE_URL}GetLibraryPropertyWithSkeleton`, {
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

      SetEqId(eqId);
      setPropertyValuesFromXML(librarypropertywithskeloton, PropertyXMLString);

      if (relatedDevice) {
        setRelatedDevicesVisible(true);
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
      const response = await axios.post(`${BASE_URL}GetDevicePreview`, {
        Email: '',
        SubNo: '000000000000000000001234',
        ShapeID: shapeId,
      });
      setSvgContent(response.data.Data.SVGFile);
      setPropertyData([])

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


  const handleExpandRelatedTree = async (expandedKeys, { node, expanded }) => {
    let newExpandedKeys = [...expandedKeys];
    const eqid = node.EQID;
    console.log('Expand/Collapse related tree node:', eqid);

    if (!expanded) {
      newExpandedKeys = newExpandedKeys.filter(key => key !== node.key);
      setRelatedExpandedKeys(newExpandedKeys);
      setRelatedSelectedKeys([node.key]);
      SetRelatesSelectedNode([node])

      if (!node.EQID) {
        setPropertyData([]);
        setSvgContent(null);
        SetEqId(null);
      }
      if (node.EQID && node.Type) {
        await RelatedandLibraryProperty(node.EQID);
        await getStencilName(node.EQID);
      }
      return;
    }

    const { expandedKeys: autoExpandedKeys, selectedKeys: autoSelectedKeys, selectedNode, IsSelected } = await autoExpandDefaultNodesOfTree([node]);

    newExpandedKeys = Array.from(new Set([...newExpandedKeys, ...autoExpandedKeys]));
    setRelatedExpandedKeys(newExpandedKeys);

    if (autoSelectedKeys.length > 0) {
      setRelatedSelectedKeys(autoSelectedKeys);
      SetRelatesSelectedNode([selectedNode])
    }

    console.log('Selected Related Node:', selectedNode);
    console.log('Auto-selected related keys:', autoSelectedKeys);

    if (selectedNode.Type && selectedNode.EQID && IsSelected === true) {
      setRelatedSelectedKeys(autoSelectedKeys);

      await RelatedandLibraryProperty(selectedNode.EQID);
      await getStencilName(selectedNode.EQID);
      SetRelatesSelectedNode([selectedNode])
    } else if (selectedNode.Type && selectedNode.EQID && IsSelected === false) {

      let result = await callApiforDeviceShapeStencilEqid(selectedNode, true);
      if (result && result.shapenodes?.length > 0) {
        setRelatedSelectedKeys([result.shapenodes[0].key]);
        SetRelatesSelectedNode([result.shapenodes[0]])
        if (result.shapenodes[0].ShapeID) {
          callApiForGetDevicePreview(result.shapenodes[0].ShapeID);
        }
      }
    } else if (selectedNode.ShapeID && selectedNode.EqId) {
      await callApiForGetDevicePreview(selectedNode.ShapeID);
      setRelatedDevicesVisible(true)
      SetEqId(selectedNode.EqId)
    }
  };


  const handleExpandMainTree = async (expandedKeys, { node, expanded }) => {
    let newExpandedKeys = [...expandedKeys];
    const eqid = node.EQID;
    console.log('Expand/Collapse node:', eqid);

    if (!expanded) {
      newExpandedKeys = newExpandedKeys.filter(key => key !== node.key);
      setExpandedKeys(newExpandedKeys);
      setSelectedKeys([node.key]);
      SetSelectedNode([node])
      if (!node.EQID) {
        setPropertyData([]);
        setSvgContent(null);
        SetEqId(null);
        setRelatedDevicesVisible(false);
      }
      if (node.EQID && node.Type) {
        await RelatedandLibraryProperty(node.EQID);
        await getStencilName(node.EQID);
      }
      return;
    }

    const { expandedKeys: autoExpandedKeys, selectedKeys: autoSelectedKeys, selectedNode, IsSelected } = await autoExpandDefaultNodesOfTree([node]);
    newExpandedKeys = Array.from(new Set([...newExpandedKeys, ...autoExpandedKeys]));
    setExpandedKeys(newExpandedKeys);

    if (autoSelectedKeys.length > 0) {
      setSelectedKeys(autoSelectedKeys);
      SetSelectedNode(selectedNode)
    }

    if (selectedNode.Type && selectedNode.EQID && IsSelected === true) {

      await RelatedandLibraryProperty(selectedNode.EQID);
      await getStencilName(selectedNode.EQID);
      setSelectedKeys(autoSelectedKeys);
      SetSelectedNode(selectedNode)

    } else if (selectedNode.Type && selectedNode.EQID && IsSelected === false) {
      let result = await callApiforDeviceShapeStencilEqid(selectedNode);
      if (result && result.shapenodes?.length > 0) {
        setSelectedKeys([result.shapenodes[0].key]);
        SetSelectedNode([result.shapenodes[0]])
        if (result.shapenodes[0].ShapeID) {
          await callApiForGetDevicePreview(result.shapenodes[0].ShapeID);
        }
      }
    }
    else if (selectedNode.ShapeID && selectedNode.EqId) {
      await callApiForGetDevicePreview(selectedNode.ShapeID);
      setRelatedDevicesVisible(true)
    }
  };



  const handleSelectMainTree = async (selectedKeys, info) => {
    if (tabValue !== 0) return;

    const selectedNode = info.node;
    console.log("selected node info", selectedNode)

    setSelectedKeys([selectedNode.key]);
    SetSelectedNode([selectedNode])
    if (selectedNode.key.includes('visio') && selectedNode.visioDownloadUrl) {
      selectedNode.onClick();
      return;
    }

    if (selectedNode.ShapeID && selectedNode.EqId) {
      await callApiForGetDevicePreview(selectedNode.ShapeID);

      SetEqId(selectedNode.EqId)
    }
    else if (selectedNode.Type && selectedNode.EQID) {
      setSelectedKeys([selectedNode.key]);

      await RelatedandLibraryProperty(selectedNode.EQID);
      await getStencilName(selectedNode.EQID);


      SetSelectedNode([selectedNode])
    }

    if (!selectedNode.Type && !selectedNode.EQID && !selectedNode.ShapeID) {
    
      setPropertyData([])
      setSvgContent(null)
      setRelatedDevicesVisible(false)

    }
    console.log('Selected Keys:', selectedKeys);
  };

  useEffect(() => {
    console.log('resultExpanded', expandedKeys)
    console.log('relatedExpanded', relatedExpandedKeys)
  }, [expandedKeys, relatedExpandedKeys])

  const handleSelectRelatedTree = async (relatedSelectedKeys, info) => {
    if (tabValue !== 1) return;

    const selectedNodeRelated = info.node;
    console.log('relatedselected node info', selectedNodeRelated)

    setRelatedSelectedKeys([selectedNodeRelated.key]);
    SetRelatesSelectedNode([selectedNodeRelated])

    if (selectedNodeRelated.key.includes('visio') && selectedNodeRelated.visioDownloadUrl) {
      selectedNodeRelated.onClick();
      return;
    }
    console.log('Selected Related Node:', selectedNodeRelated);
    console.log('Auto-selected Related keys:', selectedNodeRelated);

    if (selectedNodeRelated.EQID && selectedNodeRelated.Type) {
      setRelatedSelectedKeys([selectedNodeRelated.key])

      await RelatedandLibraryProperty(selectedNodeRelated.EQID)
      await getStencilName(selectedNodeRelated.EQID)

      SetRelatesSelectedNode([selectedNodeRelated])
    } else if (selectedNodeRelated.ShapeID) {

      await callApiForGetDevicePreview(selectedNodeRelated.ShapeID)

    }
    if (!selectedNodeRelated.Type && !selectedNodeRelated.EQID && !selectedNodeRelated.ShapeID) {
      setPropertyData([])
      setSvgContent(null)
      setRelatedDevicesVisible(false)
    }
    console.log('related selected node', relatedSelectedKeys)
  };

  const handleTabChange = async (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 1) {
      setIsLoading(true);
      setPropertyData([]);
      setSvgContent(null);
      handleSearch({ Eqid, related: true }, onRelatedSuccess);
      setIsLoading(false);
    }

    if (newValue === 0) {
      setSvgContent(null);
      setRelatedSelectedKeys([]);
      SetRelatesSelectedNode([])
      setSelectedKeys(selectedKeys);
      SetSelectedNode(selectednode)
      setExpandedKeys(expandedKeys);


      if (selectednode) {
        if (selectednode[0]?.ShapeID) {
          await callApiForGetDevicePreview(selectednode[0]?.ShapeID);
        } else if (selectednode.Type && selectednode.EQID) {
          await RelatedandLibraryProperty(selectednode.EQID);
          await getStencilName(selectednode.EQID);
        } else if (selectednode[0].Type && selectednode[0]?.EQID) {
          await RelatedandLibraryProperty(selectednode[0]?.EQID);
          await getStencilName(selectednode[0]?.EQID);
        }
      }
    }
  };

  const onRelatedSuccess = async (resultData) => {
    try {
      const RelatedTree = transformToTreeData(resultData);
      console.log('Related Tree:', resultData);
      setRelatedTree(RelatedTree)
      const { expandedKeys, selectedKeys, selectedNode, IsSelected } = await autoExpandDefaultNodesOfTree(RelatedTree);


      setRelatedExpandedKeys(expandedKeys);
      setRelatedSelectedKeys(selectedKeys);
      SetRelatesSelectedNode(selectedNode)
      if (selectedNode.Type && selectedNode.EQID && IsSelected == false) {
        let resultRelated = await callApiforDeviceShapeStencilEqid(selectedNode, true)

        if (resultRelated && resultRelated.shapenodes?.length > 0) {
          setRelatedSelectedKeys([resultRelated.shapenodes[0].key])
          SetRelatesSelectedNode([resultRelated.shapenodes[0]])
          if (resultRelated && resultRelated.shapenodes[0].ShapeID) {
            callApiForGetDevicePreview(resultRelated.shapenodes[0].ShapeID)
          }
        }
      } else if (selectedNode.Type && selectedNode.EQID && IsSelected == true) {
        RelatedandLibraryProperty(selectedNode.EQID)
        getStencilName(selectedNode.EQID)
        setRelatedSelectedKeys(selectedKeys);
        SetRelatesSelectedNode(selectedNode)

      }
    } catch (error) {
      console.error('Error handling related tree data:', error);
    }
  };

  const handleDragStart = async (info) => {
    const { node } = info;
    console.log('Drag started on node:', node);

    try {
      const response = await axios.post(`${BASE_URL}GetDevicePreviewToDrawOnSlide`, {
        Email: '',
        SubNo: '000000000000000000001234',
        ShapeID: node.ShapeID
      });
      const svgonDragstart = response.data.Data.SVGFile

      await insertSvgContentIntoOffice(svgonDragstart, 'drag', shapeCounter)
      setShapeCounter(shapeCounter +1)
      return response;
    } catch (error) {
      console.error('API Error:', error);
    }
  };


  return (
    <div style={{
      height: '100vh',
      padding: '0 16px'
    }}>
      <div>
         <Tabs
          value={tabValue}
          onChange={handleTabChange}
          TabIndicatorProps={{
            style: {
              display: 'none',
              color: 'var(--font-color)',
              minHeight:'26px'
            }
          }}
          sx={{
            minHeight: '26px',  
            padding: 0,         
            margin: 0,          
          }}>
          <Tab
            label="Result"
            disableRipple
            sx={{
              fontSize: '12px',
              fontFamily: '"Segoe UI", sans-serif',
              textTransform: 'none',
              color: 'var(--font-color)',
              padding: '4px 8px', 
              minWidth: '',   
              height:'10px'
            }} />
          {relatedDevicesVisible && (
            <Tab
              label="Related"
              disableRipple
              sx={{
                fontSize: '12px',
                fontFamily: '"Segoe UI", sans-serif',
                textTransform: 'none',
                color: 'var(--font-color)',
                padding: '4px 8px',  
                minWidth: 'auto',    
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
          open={isLoading}>
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
                onSelect={handleSelectMainTree}
                onExpand={handleExpandMainTree}
                selectedKeys={selectedKeys}
                draggable
                onDragStart={handleDragStart}
              />

              {propertyData && propertyData.length > 0 ? (
                <PropertyTable propertyData={propertyData} stencilResponse={stencilResponse} />
              ) : (
                svgContent && svgContent.length > 0 && <SvgContent svgContent={svgContent} />
              )}
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
                expandedKeys={relatedExpandedKeys}
                selectedKeys={relatedSelectedKeys}
                draggable
                onSelect={handleSelectRelatedTree}
                onExpand={handleExpandRelatedTree}
                onDragStart={handleDragStart}
              />

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

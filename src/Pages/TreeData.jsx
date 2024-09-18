import React, {useEffect, useState, useMemo } from 'react';
import Tree from 'rc-tree';
import '../App.css';
import 'rc-tree/assets/index.css';
import { Tabs, Tab,} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import { useTreeData } from '../Context/TreedataContext';
import PropertyTable from '../Components/PropertyTable';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
// import { handleSearch, transformToTreeData } from './MainPage.jsx';
import SvgContent from '../Components/SvgContent.jsx';

const Treedata = ({ treeData: initialTreeData, searchResult: searchdata, handleprop }) => {

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


  const API_URL = 'http://localhost:5000/api/library/';

/**
 * Handles searching by making an API request based on provided parameters and processes the response data.
 * 
 * @param {Object} searchParams -  for the search API call.
 * @param {Function} onSuccess - Callback to handle successful search response.
 * @param {Function} onError - Callback to handle errors.
 */

 const handleSearch = async (searchParams, onSuccess, onError) => {
  const { keyword, related,Eqid ,selectedManufacturer, setSnackbarMessage, setSnackbarOpen, selectedEqType, selectedProductLine, selectedProductNumber, selectedDtManufacturers, } = searchParams;
  let searchType = 'Solution';
    let paramXml = '';


  if (keyword) {
          searchType = 'Kwd';
          paramXml = `<Search><NotificationCount>10</NotificationCount><SearchType>${searchType}</SearchType><KwdSearchType>0</KwdSearchType><TextSearched>${keyword}</TextSearched><MfgFilterList>${selectedManufacturer ? selectedManufacturer : selectedDtManufacturers.length > 0 ? selectedDtManufacturers.join(',') : ""}</MfgFilterList><LikeOpeartor /><LikeType /><IncludeRelatedMfg>true</IncludeRelatedMfg><CardModuleFlag>false</CardModuleFlag><RackFlag>false</RackFlag><RMFlag>false</RMFlag><ChassisFlag>false</ChassisFlag><ToSearchOnlyWithShape>true</ToSearchOnlyWithShape><OrderByClause /></Search>`;

        }
        else if (selectedManufacturer || selectedEqType || selectedProductLine || selectedProductNumber) {
          paramXml = `<Search><NotificationCount/><SearchType>Solution</SearchType><SelectedMfg>${selectedManufacturer || ''}</SelectedMfg><SelectedEqType>${selectedEqType || ''}</SelectedEqType><SelectedMfgProdLine>${selectedProductLine || ''}</SelectedMfgProdLine><SelectedMfgProdNo>${selectedProductNumber || ''}</SelectedMfgProdNo><IncludeRelatedMfg>true</IncludeRelatedMfg><CardModuleFlag>false</CardModuleFlag><RackFlag>false</RackFlag><RMFlag>false</RMFlag><ChassisFlag>false</ChassisFlag><ToSearchOnlyWithShape>true</ToSearchOnlyWithShape><OrderByClause /></Search>`;

        }else if (related || '') {
          paramXml=` <Search><NotificationCount>500</NotificationCount><SearchType>Related</SearchType><EQID>${Eqid}</EQID><MfgFilterList></MfgFilterList><IncludeRelatedMfg>true</IncludeRelatedMfg><ToSearchOnlyWithShape>true</ToSearchOnlyWithShape><OrderByClause /></Search>`
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
 * @param {Array} result - The search results to transform.
 * @returns {Array} - The transformed tree data.
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
      MFGDESC='',
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
    
    
    
    if (!productnoNode) {
      productnoNode = {
        title: (
          <span title={MFGDESC} placement="bottom-end" >
            <span>{MFGPRODNO}</span>
          </span>
        ),
        key: productNumberKey,
        icon: <img src="./assets/product_no.gif" alt="product no" style={{ width: 16, height: 16 }} />,
        children: [],
        EQID: productNumberKey,
        Type:'ProductNumber',
        isLeaf:false
      };
      prodLineNode.children.push(productnoNode);
    }
  });

  return tree;
};


    useEffect(() => {
      if (initialTreeData) {
        setTreeData(initialTreeData);
        autoExpandDefaultNodesOfTree(initialTreeData).then(async ({ expandedKeys, selectedKeys, selectedNode, IsSelected }) => {
          setExpandedKeys(expandedKeys);
          // setSelectedKeys(selectedNode.key)
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
          }else {
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
          IsSelected=true
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
        title: (
          <span title={`Drag and Drop to insert ${shape.Description} view`} placement='bottom-end'>
            <span>{shape.Description}</span>
          </span>
        ),
        ShapeID: shape.ShapeID,
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

      if(treeData){
        addLeafNode(selectedNode.key, ...shapeLeafNodes);
      }
      if(relatedTree){
        addLeafNodeToRelatedTree(selectedNode.key, ...shapeLeafNodes)
      }
      return shapeLeafNodes;
    } catch (error) {
      console.error('Error fetching device shapes:', error);
      return [];
    }
  };


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
        title:  (
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

      // Add the Visio node to the correct tree
      addLeafNode(selectedNode.key, stencilLeafNode);
      
      if(relatedTree){
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

  // Main function to handle API calls and add leaf nodes
  const callApiforDeviceShapeStencilEqid = async (selectedNode, isRelatedTree = false) => {
    setIsLoading(true);

    try {
      const eqId = selectedNode.EQID; 
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
      setRelatedSelectedKeys([node.key]);
    SetRelatesSelectedNode([node])
  
      if (!node.EQID) {
        setPropertyData([]);
        setSvgContent(null);
        SetEqId(null);
      }
      if (node.EQID && node.Type) {
        // console.log('Calling RelatedandLibraryProperty for node EQID:', node.EQID);
        await RelatedandLibraryProperty(node.EQID);
        await getStencilName(node.EQID);
      }
      return;
    }
  
    // Auto-expand related nodes if necessary and get the selected node
    const { expandedKeys: autoExpandedKeys, selectedKeys: autoSelectedKeys, selectedNode, IsSelected } = await autoExpandDefaultNodesOfTree([node]);
  
    // Merge the expanded keys with the new expanded keys
    newExpandedKeys = Array.from(new Set([...newExpandedKeys, ...autoExpandedKeys]));
    setRelatedExpandedKeys(newExpandedKeys);

    // Set the selected key to the first child node's key if children exist
    if (autoSelectedKeys.length > 0) {
      setRelatedSelectedKeys(autoSelectedKeys);
     SetRelatesSelectedNode([selectedNode])
    }
  
    console.log('Selected Related Node:', selectedNode);
    console.log('Auto-selected related keys:', autoSelectedKeys);
  
    if (selectedNode.Type && selectedNode.EQID && IsSelected === true) {
      // Call API for related device shape/stencil
      await RelatedandLibraryProperty(selectedNode.EQID);
      await getStencilName(selectedNode.EQID);
      setRelatedSelectedKeys(autoSelectedKeys);
      SetRelatesSelectedNode([selectedNode])
    } else if (selectedNode.Type && selectedNode.EQID && IsSelected === false) {

      let result = await callApiforDeviceShapeStencilEqid(selectedNode);
      if (result && result.shapenodes?.length > 0) {
        setRelatedSelectedKeys([result.shapenodes[0].key]);
        SetRelatesSelectedNode([result.shapenodes[0]])
        if (result.shapenodes[0].ShapeID) {
          callApiForGetDevicePreview(result.shapenodes[0].ShapeID);
        }
      }
    } else if (selectedNode.ShapeID) {
      await callApiForGetDevicePreview(selectedNode.ShapeID);
    }
  
    console.log('Related Tree Expanded Keys:', newExpandedKeys);
    console.log('Related Tree Selected Keys:', autoSelectedKeys);
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
  
    console.log('Selected Node:', selectedNode);
    console.log('Auto-selected keys:', autoSelectedKeys);
    
    
    if (selectedNode.Type && selectedNode.EQID && IsSelected === true ) {
      
        await RelatedandLibraryProperty(selectedNode.EQID);
        await getStencilName(selectedNode.EQID);
        setSelectedKeys(autoSelectedKeys);
        SetSelectedNode(selectedNode)
      
    } else if (selectedNode.Type && selectedNode.EQID && IsSelected === false){
      let result = await callApiforDeviceShapeStencilEqid(selectedNode);
      if (result && result.shapenodes?.length > 0) {
        setSelectedKeys([result.shapenodes[0].key]);
        SetSelectedNode([result.shapenodes[0]])
        if (result.shapenodes[0].ShapeID) {
          await callApiForGetDevicePreview(result.shapenodes[0].ShapeID);
        }
      } 
    }
    else if (selectedNode.ShapeID) {
      await callApiForGetDevicePreview(selectedNode.ShapeID);
    }
  
    console.log('Expanded Keys:', newExpandedKeys);
    console.log('Selected Keys:', autoSelectedKeys);
  };
  


  const handleSelectMainTree = async (selectedKeys, info) => {
    if (tabValue !== 0) return;
  
    const selectedNode = info.node;
    console.log("selected node info",selectedNode)
  
    setSelectedKeys([selectedNode.key]);
     SetSelectedNode([selectedNode])
    if (selectedNode.key.includes('visio') && selectedNode.visioDownloadUrl) {
      selectedNode.onClick();
      return;
    }
  
    console.log('Selected Node:', selectedNode);  
    console.log('Auto-selected keys:', selectedNode);
  
  
    if (selectedNode.ShapeID) {
      await callApiForGetDevicePreview(selectedNode.ShapeID);
    }
      else if (selectedNode.Type && selectedNode.EQID) {
        await RelatedandLibraryProperty(selectedNode.EQID);
        await getStencilName(selectedNode.EQID);
  

        setSelectedKeys([selectedNode.key]);
        SetSelectedNode([selectedNode])
      } 
      
      if (!selectedNode.Type && !selectedNode.EQID && !selectedNode.ShapeID ){
        setPropertyData([])
        setSvgContent(null) 
      }
    console.log('Selected Keys:', selectedKeys);
  }; 
  
  useEffect(() => {
    console.log('resultExpanded', expandedKeys)
    console.log('relatedExpanded', relatedExpandedKeys)
  }, [expandedKeys, relatedExpandedKeys])

  const handleSelectRelatedTree = async (info) => {
    if (tabValue !== 1) return;

    const selectedNode = info.node;
    setRelatedSelectedKeys([selectedNode.key]);
    SetRelatesSelectedNode([selectedNode])

    if (selectedNode.key.includes('visio') && selectedNode.visioDownloadUrl) {
      selectedNode.onClick();
      return;
    }
    if(selectedNode.EQID && selectedNode.Type){
      await RelatedandLibraryProperty(selectedNode.EQID)
      await getStencilName(selectedNode.EQID)

      setRelatedSelectedKeys([selectedNode.key])
      SetRelatesSelectedNode([selectedNode])
    } else if(selectedNode.ShapeID){
      await callApiForGetDevicePreview(selectedNode.ShapeID)
    }
    console.log('related selected node', selectedNode.key)
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
// setselectednode()

 
    if (selectednode) {
      if (selectednode[0]?.ShapeID) {
        await callApiForGetDevicePreview(selectednode[0]?.ShapeID);
      } else if (selectednode.Type && selectednode.EQID) {
        await RelatedandLibraryProperty(selectednode.EQID);
        await getStencilName(selectednode.EQID);
      } else if (selectednode[0].Type && selectednode[0]?.EQID){
        await RelatedandLibraryProperty(selectednode[0]?.EQID);
        await getStencilName(selectednode[0]?.EQID);
      }
    }
  }
};

  


useEffect(() => {
    console.log('resultSelected', selectedKeys);
    console.log('selectednode', selectednode);
    console.log('relatedseletednode', relatedselectednode)
    console.log('relatedSelected', relatedSelectedKeys);
}, [selectedKeys, relatedSelectedKeys]);



  const onRelatedSuccess = async (resultData) => {
    try {
      const RelatedTree = transformToTreeData(resultData);
      console.log('Related Tree:', resultData);
      setRelatedTree(RelatedTree)

      // Automatically expand and select nodes
      const { expandedKeys, selectedKeys, selectedNode, IsSelected } = await autoExpandDefaultNodesOfTree(RelatedTree);
  
      // Update expanded and selected keys for the related tree
      setRelatedExpandedKeys(expandedKeys);
      setRelatedSelectedKeys(selectedKeys);
      SetRelatesSelectedNode(selectedNode)
      // Check if the selected node has an EQID and call the API if needed
      if (selectedNode.Type && selectedNode.EQID && IsSelected == false) {
        let resultRelated = await callApiforDeviceShapeStencilEqid(selectedNode)
        
        if (resultRelated && resultRelated.shapenodes?.length > 0) {
          setRelatedSelectedKeys([resultRelated.shapenodes[0].key])
          SetRelatesSelectedNode([resultRelated.shapenodes[0]])
          if (resultRelated && resultRelated.shapenodes[0].ShapeID) {
            callApiForGetDevicePreview(resultRelated.shapenodes[0].ShapeID)
          }
        }
      } else if ( selectedNode.Type && selectedNode.EQID && IsSelected == true) {
        RelatedandLibraryProperty(selectedNode.EQID)
        getStencilName(selectedNode.EQID)
        setRelatedSelectedKeys(selectedKeys);    
        SetRelatesSelectedNode(selectedNode) 

      }
    } catch (error) {
      console.error('Error handling related tree data:', error);
    }
  };

  // useEffect(() => {
    
  //   if (relatedTree) {
  //     setRelatedTree(relatedTree); 
  //     console.log() 
  //     autoExpandDefaultNodesOfTree(relatedTree).then(async ({ expandedKeys, selectedKeys, selectedNode, IsSelected }) => {
  //       // setRelatedExpandedKeys(expandedKeys);
  //       if (selectedNode.Type && selectedNode.EQID && IsSelected == false) {
  //         let resultRelated = await callApiforDeviceShapeStencilEqid(selectedNode)
          
  //         if (resultRelated && resultRelated.shapenodes?.length > 0) {
  //           setRelatedSelectedKeys([resultRelated.shapenodes[0].key])
  //           if (resultRelated && resultRelated.shapenodes[0].ShapeID) {
  //             callApiForGetDevicePreview(resultRelated.shapenodes[0].ShapeID)
  //           }
  //         }
  //       } else if ( selectedNode.Type && selectedNode.EQID && IsSelected == true) {
  //         RelatedandLibraryProperty(selectedNode.EQID)
  //         setRelatedSelectedKeys(selectedKeys);  
  //       getStencilName(selectedNode.EQID)


  //       }
  //       console.log('exRelated', expandedKeys)
  //       console.log('SkRelated', selectedKeys)
  //       console.log('selectednode', selectedNode)
  //     });
  //     console.log('initial treeData', relatedTree);
  //   }
  // }, [relatedTree]);





 // Handle the drag start event
 const handleDragStart = async (info) => {
   const { node } = info;
   console.log('Drag started on node:', node);
 
   try {
     
     const response = await axios.post('http://localhost:5000/api/library/GetDevicePreviewToDrawOnSlide', {
       Email: '', 
       SubNo: '000000000000000000001234', 
       ShapeID: node.ShapeID
     });
 const svgonDragstart = response.data.Data.SVGFile
    
      
      await Office.context.document.setSelectedDataAsync(
        svgonDragstart,
        { coercionType: Office.CoercionType.XmlSvg },
        (asyncResult) => {
          if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
            console.log('SVG image successfully inserted into Word document.');
          } else {
            console.error('Failed to insert SVG image:', asyncResult.error.message);
          }
        }
      );
    
     return response;
   } catch (error) {
     console.error('API Error:', error);
   }
 };
 


 
  return (
    <div style={{
      height: '100vh',
      // overflowY: 'auto'
    }}>

      <div
      >
        

        <Tabs value={tabValue} onChange={handleTabChange} TabIndicatorProps={{ style: { display: 'none' } }}> 
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
        selectedKeys={selectedKeys}
        draggable
        onDragStart={handleDragStart}
      />

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
        selectedKeys={relatedSelectedKeys}
        draggable
        onSelect={handleSelectRelatedTree}
        onExpand={handleExpandRelatedTree}
        onDragStart={handleDragStart}
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

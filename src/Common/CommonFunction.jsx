import BASE_URL from "../Config/Config";
import axios from "axios";

export const insertSvgContentIntoOffice = async (svgContent, insertType, shapeCounter) => {
  try {
    let left = 50 + (20 * shapeCounter);
    let top = 50;

    if (left > 400) {
      let extraY = Math.floor(left / 400);
      left = 50 + (20 * (shapeCounter - 18));
      top = 50 + (20 * extraY);
    }

    const options = {
      coercionType: Office.CoercionType.XmlSvg,
      imageLeft: left,
      imageTop: top,
    };

    await Office.context.document.setSelectedDataAsync(svgContent, {
      ...options,
      asyncContext: { insertType }
    });

    console.log(`SVG inserted via ${insertType} at position (left: ${left}, top: ${top})`);
  } catch (error) {
    console.error(`Error during ${insertType}:`, error);
  }
};

const API_URL = `${BASE_URL}`;

/**

 * 
 * @param {Object} searchParams - 
 * @param {Function} onSuccess .
 * @param {Function} onError 
 */

export const handleSearch = async (searchParams, onSuccess, onError) => {
  const { keyword,kwdSearchType, related, Eqid, selectedManufacturer, setSnackbarMessage, setSnackbarOpen, selectedEqType, selectedProductLine, selectedProductNumber, selectedDtManufacturers, } = searchParams;
  let searchType = 'Solution';
  let paramXml = '';


  if (keyword) {
    searchType = 'Kwd';
    paramXml = `<Search><NotificationCount>10</NotificationCount><SearchType>${searchType}</SearchType><KwdSearchType>${kwdSearchType}</KwdSearchType><TextSearched>${keyword}</TextSearched><MfgFilterList>${selectedManufacturer ? selectedManufacturer : selectedDtManufacturers.length > 0 ? selectedDtManufacturers.join(',') : ""}</MfgFilterList><LikeOpeartor /><LikeType /><IncludeRelatedMfg>true</IncludeRelatedMfg><CardModuleFlag>false</CardModuleFlag><RackFlag>false</RackFlag><RMFlag>false</RMFlag><ChassisFlag>false</ChassisFlag><ToSearchOnlyWithShape>true</ToSearchOnlyWithShape><OrderByClause /></Search>`;

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

  if (resultData.length > 0 || dtResultdata.length > 0) {
      // If there are search results, call onSuccess with resultData
      onSuccess(resultData, dtResultdata);}
       else {
      console.log('No relevant data found');
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

export const transformToTreeData = (result,) => {
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
      MFGDESC = '',
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
        Type: 'ProductNumber',
        isLeaf: false
      };
      prodLineNode.children.push(productnoNode);
    }
  });

  return tree;
};

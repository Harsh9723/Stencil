// svgUtils.js
export const insertSvgContentIntoOffice = async (svgContent, insertType) => {
  try {
    await Office.context.document.setSelectedDataAsync(svgContent, {
      coercionType: Office.CoercionType.XmlSvg,
      asyncContext: { insertType }
    });
    console.log(`SVG inserted via ${insertType}`);
  } catch (error) {
    console.error(`Error during ${insertType}:`, error);
  }
};

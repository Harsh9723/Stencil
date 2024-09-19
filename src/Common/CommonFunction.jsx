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

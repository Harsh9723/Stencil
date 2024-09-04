import React from 'react';
import { styled } from '@mui/system';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper, IconButton, Card, CardContent } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const StyledCard = styled(Card)({
  backgroundColor: '#778899',
  marginTop: '20px',
  borderRadius: '8px',
  color: 'white',
});

const StyledTableContainer = styled(TableContainer)({
  width: '100%',
  backgroundColor: '#4e88c9',
  borderRadius: '8px',
  overflow: 'hidden',
});

const StyledTableCellHeader = styled(TableCell)({
  backgroundColor: '#EFEFEF',
  padding: '10px 16px',
  fontWeight: 'bold',
  color: '#333',
  border: '1px solid #778899',
  textAlign: 'left',
});

const StyledTableCellBody = styled(TableCell)({
  backgroundColor: '#778899',
  padding: '10px 16px',
  border: '1px solid #ffffff',
  color: '#ffffff',
  position: 'relative',
  textAlign: 'left',
});

const CopyIconWrapper = styled('div')({
  position: 'absolute',
  right: '8px',
  top: '50%',
  transform: 'translateY(-50%)',
  opacity: 0,
  transition: 'opacity 0.3s',
});

const StyledTableRow = styled(TableRow)({
  '&:hover': {
    backgroundColor: '#ffffff',
  },
  '&:hover .copy-icon': {
    opacity: 1,
  },
});

const SvgWrapper = styled('div')({
  margin: '0 auto',
  maxHeight: '325px',
  maxWidth: '100%',
  '& svg': {
    width: '100%',
    height: '325px',
  },
});

const PropertyTable = ({ propertyData, svgContent, stencilResponse }) => {
  const copyToClipboard = (value) => {
    navigator.clipboard.writeText(value)
      .then(() => {
        console.log('Copied to clipboard:', value);
      })
      .catch((error) => {
        console.error('Failed to copy:', error);
      });
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', svgContent);
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDropOnWord = async () => {
    try {
      await Office.context.document.setSelectedDataAsync(svgContent, { coercionType: Office.CoercionType.Html });
      console.log('SVG content inserted into Word document');
    } catch (error) {
      console.error('Failed to insert SVG into Word:', error);
    }
  };

  return (
    <StyledCard>
      <CardContent
        style={{
          display: 'flex',
          justifyContent: svgContent ? 'center' : 'flex-start',
          alignItems: svgContent ? 'center' : 'flex-start',
        }}
      >
        {svgContent ? (
          <SvgWrapper
            draggable
            onDragStart={handleDragStart}
            onDrop={handleDropOnWord}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : (
          <StyledTableContainer component={Paper} style={{ width: '100%' }}>
            <Table>
              <TableBody>
                {propertyData
                  .filter((item) => item.GroupName === 'Basic')
                  .map((item, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCellHeader component="th" scope="row">
                        {item.pLabel}
                      </StyledTableCellHeader>
                      <StyledTableCellBody>
                        {item.pValue}
                        <CopyIconWrapper className="copy-icon">
                          <IconButton
                            size="small"
                            onClick={() => copyToClipboard(item.pValue)}
                            sx={{ color: '#ffffff' }}
                          >
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </CopyIconWrapper>
                      </StyledTableCellBody>
                    </StyledTableRow>
                  ))}
                <StyledTableRow>
                  <StyledTableCellHeader component="th" scope="row">
                    Stencil
                  </StyledTableCellHeader>
                  <StyledTableCellBody>
                    {stencilResponse.data.Data[0].StencilName}
                    <CopyIconWrapper className="copy-icon">
                      <IconButton
                        size="small"
                        onClick={() => copyToClipboard(stencilResponse.data.Data[0].StencilName)}
                        sx={{ color: '#ffffff' }}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </CopyIconWrapper>
                  </StyledTableCellBody>
                </StyledTableRow>
              </TableBody>
            </Table>
          </StyledTableContainer>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default PropertyTable;

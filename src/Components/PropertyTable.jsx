import React, { useEffect } from 'react';
import { styled } from '@mui/system';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// Styled components
const StyledPropertyCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#778899',
  marginTop: '20px',
  borderRadius: '8px',
  color: 'white',
  fontSize: '12px',
  fontFamily: 'Segoe UI, sans-serif',
  [theme.breakpoints.down('sm')]: {
    marginTop: '10px',
    padding: '10px',
  },
}));

const StyledSvgCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#778899',
  marginTop: '20px',
  borderRadius: '8px',
  color: 'white',
  fontSize: '12px',
  fontFamily: 'Segoe UI, sans-serif',
  padding: '20px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    marginTop: '10px',
    padding: '10px',
  },
}));

const StyledTableContainer = styled(TableContainer)({
  width: '100%',
  backgroundColor: '#4e88c9',
  borderRadius: '8px',
  overflow: 'hidden',
  fontFamily: 'Segoe UI, sans-serif',
  fontSize: '12px',
});

const StyledTableCellHeader = styled(TableCell)({
  backgroundColor: '#EFEFEF',
  padding: '10px 16px',
  fontWeight: 'bold',
  color: '#333',
  border: '1px solid #778899',
  textAlign: 'left',
  fontSize: '12px',
  fontFamily: 'Segoe UI, sans-serif',
});

const StyledTableCellBody = styled(TableCell)({
  backgroundColor: '#778899',
  padding: '10px 16px',
  border: '1px solid #ffffff',
  color: '#ffffff',
  position: 'relative',
  textAlign: 'left',
  fontSize: '12px',
  fontFamily: 'Segoe UI, sans-serif',
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
  fontSize: '12px',
  fontFamily: 'Segoe UI, sans-serif',
});

const SvgWrapper = styled('div')(({ theme }) => ({
  margin: '0 auto',
  width: '100%',
  maxHeight: '325px',
  maxWidth: '80%',
  '& svg': {
    width: '100%',
    height: 'auto',
    maxHeight: '325px',
    [theme.breakpoints.down('md')]: {
      maxHeight: '250px',
    },
    [theme.breakpoints.down('sm')]: {
      maxHeight: '200px',
    },
  },
  fontSize: '12px',
  fontFamily: 'Segoe UI, sans-serif',
}));

const PropertyTable = ({ propertyData = [], svgContent = '', stencilResponse = '' }) => {
  useEffect(() => {
    Office.onReady((info) => {
      if (info.host === Office.HostType.Word) {
        console.log('Office is ready.');
      }
    });
  }, []);

  const handleDragStart = (e) => {
    // Convert SVG content to a base64 string
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result.split(',')[1]; // Extract base64 string
      e.dataTransfer.setData('image/svg+xml', base64data); // Set data for drag event
      e.dataTransfer.dropEffect = 'copy';
    };
    reader.readAsDataURL(svgBlob); // Convert Blob to Data URL
  };

  const handleDropOnWord = async (e) => {
    e.preventDefault(); // Prevent default behavior
    try {
      const base64data = e.dataTransfer.getData('image/svg+xml');
      if (base64data) {
        const imageUrl = `data:image/svg+xml;base64,${base64data}`;
        await Office.context.document.setSelectedDataAsync(imageUrl, {
          coercionType: Office.CoercionType.Image,
        }, (result) => {
          if (result.status === Office.AsyncResultStatus.Succeeded) {
            console.log('SVG image inserted into Word document.');
          } else {
            console.error('Error inserting SVG into Word document:', result.error);
          }
        });
      }
    } catch (error) {
      console.error('Failed to insert SVG into Word:', error);
    }
  };

  return svgContent ? (
    <StyledSvgCard>
      <SvgWrapper
        draggable
        onDragStart={handleDragStart}
        onDragOver={(e) => e.preventDefault()}// Allow drop
        onDrop={handleDropOnWord} // Handle drop
        dangerouslySetInnerHTML={{ __html: svgContent }} // Display SVG
      />
    </StyledSvgCard>
  ) : (
    <StyledPropertyCard>
      <CardContent>
        <StyledTableContainer component={Paper}>
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
                  {stencilResponse}
                  <CopyIconWrapper className="copy-icon">
                    <IconButton
                      size="small"
                      onClick={() => copyToClipboard(stencilResponse)}
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
      </CardContent>
    </StyledPropertyCard>
  );
};

export default PropertyTable;

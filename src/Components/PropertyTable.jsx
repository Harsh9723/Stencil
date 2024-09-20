import React from 'react';
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
  color: 'var(--font-colo)',
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

const PropertyTable = ({ propertyData = [], stencilResponse = '' }) => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    console.log('Copied to clipboard:', text);
  };

 

  return (
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

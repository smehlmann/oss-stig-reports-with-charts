import React from 'react';
import { Button, styled } from '@mui/material';

// Styled button with default styles
const ExpandButton = styled(Button)(({ theme }) => ({
  fontWeight: 700,
  textTransform: 'capitalize', // Ensure button text is not uppercase
  backgroundColor: theme.palette.secondary.dark,
  '&:hover':{
    backgroundColor: '#251e50',
  },
}));

// ExpandButton wrapper component
const CollapseButtonWrapper = ({ isCollapsed, onClick }) => {
  return (
    <ExpandButton size="small" variant = 'contained' onClick={onClick}>
      {isCollapsed ? 'Expand' : 'Collapse'}
    </ExpandButton>
  );
};

export default CollapseButtonWrapper;
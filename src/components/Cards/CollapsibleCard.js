import React, {useState} from 'react';
import { Card, styled } from '@mui/material';
import CollapseButtonWrapper from './CollapseButtonWrapper'

// common properties
const StyledCard = styled(Card)(({ theme }) => ({
  height: '475px',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: theme.shadows[3],
  borderRadius: 10,
  padding: 0,
  overflow: 'hidden',
  transition: 'height 0.3s ease',
}));



const CollapsibleCard = ({
  title, 
  children, 
  HeaderComponent, 
  ContentComponent, 
  headerProps = {}, 
  contentProps = {}, 
}) => {
  //manages the state (collapsed/expanded) of card
  const [isCollapsed, setIsCollapsed] = useState(false);

  //toggle collapse/expand
  const handleToggle = () => {
    setIsCollapsed((prev) => !prev);
  }

  return(
    <StyledCard
      sx={{
        height: isCollapsed ? 'auto' : '475px', // dynamic height based on collapse state
      }}
    >
      {HeaderComponent && (
        <HeaderComponent 
          title={title} 
          action={
            <CollapseButtonWrapper 
              onClick = {handleToggle}
              isCollapsed = {isCollapsed} 
            />
          }
          {...headerProps} // pass any additional props to the header
        />
      )}
      {!isCollapsed && ContentComponent && (
        <ContentComponent {...contentProps}>
          {children}
        </ContentComponent>
      )}
    </StyledCard>
  );
};
export default CollapsibleCard;
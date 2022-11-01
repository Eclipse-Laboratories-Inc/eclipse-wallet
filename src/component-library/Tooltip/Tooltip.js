import React from 'react';
import MUITooltip from '@mui/material/Tooltip';

const Tooltip = ({ title, children }) => {
  return <MUITooltip title={title}>{children}</MUITooltip>;
};

export default Tooltip;

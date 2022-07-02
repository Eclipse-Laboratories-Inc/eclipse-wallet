import * as React from 'react';
import MUIBox from '@mui/material/Box';

const Box = ({ children, px = 0, py = 0 }) => {
  return (
    <MUIBox
      sx={{
        padding: `${px}px ${py}px`,
      }}>
      {children}
    </MUIBox>
  );
};

export default Box;

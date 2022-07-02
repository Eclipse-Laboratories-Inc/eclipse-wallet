import React from 'react';
import GridMUI from '@mui/material/Grid';

const Grid = ({ items = [], spacing = 12, columns = 1 }) => (
  <GridMUI container spacing={spacing}>
    {items.map((item, index) => (
      <GridMUI key={index} item xs={12 / columns}>
        {item}
      </GridMUI>
    ))}
  </GridMUI>
);

export default Grid;

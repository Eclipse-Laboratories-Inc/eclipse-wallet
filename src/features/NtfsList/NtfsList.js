import React from 'react';
import Card from '../../component-library/Card/Card';
import Grid from '../../component-library/Grid/Grid';

const NtfsList = ({ntfs}) => (
  <Grid
    spacing={0.5}
    columns={2}
    items={ntfs.map(ntf => (
      <Card key={ntf.url} media={{url: ntf.uri}} />
    ))}
  />
);

export default NtfsList;

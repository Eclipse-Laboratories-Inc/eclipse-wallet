import React from 'react';
import MUICard from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const Card = ({title, subtitle, content}) => (
  <MUICard>
    <CardContent>
      <Typography sx={{fontSize: 22}} color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
        {subtitle}
      </Typography>
      <Typography sx={{fontSize: 22}} color="text.secondary" gutterBottom>
        {content}
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small">Cancel</Button>
      <Button size="small">OK</Button>
    </CardActions>
  </MUICard>
);

export default Card;

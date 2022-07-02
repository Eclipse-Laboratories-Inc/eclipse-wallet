import React from 'react';
import MUICard from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardActionArea from '@mui/material/CardActionArea';

const SelectableCard = ({
  headerIcon,
  headerAction,
  headerTitle,
  headerSubtitle,
  children,
  actions,
  onSelect,
  selected,
}) => (
  <MUICard {...(selected ? { variant: 'outlined' } : {})}>
    <CardActionArea onClick={() => onSelect(!selected)}>
      <CardHeader
        {...(headerIcon ? { avatar: headerIcon } : {})}
        {...(headerAction ? { action: headerAction } : {})}
        title={headerTitle}
        subheader={headerSubtitle}
      />
      <CardContent>{children}</CardContent>
      <CardActions>{actions && actions.map(action => action)}</CardActions>
    </CardActionArea>
  </MUICard>
);

export default SelectableCard;

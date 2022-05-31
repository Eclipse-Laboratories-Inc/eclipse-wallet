import React from 'react';
import MUICard from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';

const BasicCard = ({
  headerIcon,
  headerAction,
  headerTitle,
  headerSubtitle,
  children,
  actions,
}) => (
  <MUICard>
    <CardHeader
      {...(headerIcon ? {avatar: headerIcon} : {})}
      {...(headerAction ? {action: headerAction} : {})}
      title={headerTitle}
      subheader={headerSubtitle}
    />
    <CardContent>{children}</CardContent>
    <CardActions>{actions && actions.map(action => action)}</CardActions>
  </MUICard>
);

export default BasicCard;

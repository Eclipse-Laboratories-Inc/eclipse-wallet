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
  contentStyle,
  ...props
}) => (
  <MUICard {...props}>
    {(headerIcon || headerAction || headerTitle || headerSubtitle) && (
      <CardHeader
        {...(headerIcon ? { avatar: headerIcon } : {})}
        {...(headerAction ? { action: headerAction } : {})}
        title={headerTitle}
        subheader={headerSubtitle}
      />
    )}
    <CardContent style={contentStyle}>{children}</CardContent>
    {actions && <CardActions>{actions.map(action => action)}</CardActions>}
  </MUICard>
);

export default BasicCard;

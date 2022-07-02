import React from 'react';
import MUICard from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import { CardActionArea } from '@mui/material';

const ClickableBasicCard = ({
  headerIcon,
  headerAction,
  headerTitle,
  headerSubtitle,
  children,
  onClick,
  ...props
}) => (
  <MUICard {...props}>
    <CardActionArea onClick={onClick}>
      <CardHeader
        {...(headerIcon ? { avatar: headerIcon } : {})}
        {...(headerAction ? { action: headerAction } : {})}
        title={headerTitle}
        subheader={headerSubtitle}
      />
      <CardContent>{children}</CardContent>
    </CardActionArea>
  </MUICard>
);

export default ClickableBasicCard;

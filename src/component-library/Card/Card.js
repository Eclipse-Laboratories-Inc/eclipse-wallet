import React from 'react';
import MUICard from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

const Card = ({
  headerTitle,
  headerSubtitle,
  headerAction,
  title,
  content,
  media,
  actions,
}) => (
  <MUICard>
    {headerTitle && (
      <CardHeader
        {...(headerAction ? {action: headerAction} : {})}
        title={headerTitle}
        subheader={headerSubtitle}
      />
    )}
    {media && (
      <CardMedia
        component="img"
        height={media.height}
        image={media.url}
        alt={media.alt}
      />
    )}
    {content && (
      <CardContent>
        <Typography sx={{fontSize: 24}} color="text.primary" gutterBottom>
          {title}
        </Typography>
        <Typography sx={{fontSize: 22}} color="text.secondary" gutterBottom>
          {content}
        </Typography>
      </CardContent>
    )}
    {actions && (
      <CardActions>{actions && actions.map(action => action)}</CardActions>
    )}
  </MUICard>
);

export default Card;

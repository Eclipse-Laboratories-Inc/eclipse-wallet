import * as React from 'react';
import { Card, Title, Paragraph } from 'react-native-paper';

const MyComponent = ({
  headerTitle,
  headerSubtitle,
  headerAction,
  title,
  content,
  media,
  actions,
}) => (
  <Card>
    {headerTitle && (
      <Card.Title
        title={headerTitle}
        subtitle={headerSubtitle}
        {...(headerAction ? { right: () => headerAction } : {})}
      />
    )}
    {media && <Card.Cover source={media.url} />}
    {content && (
      <Card.Content>
        <Title>{title}</Title>
        <Paragraph>{content}</Paragraph>
      </Card.Content>
    )}
    {actions && (
      <Card.Actions>{actions && actions.map(action => action)}</Card.Actions>
    )}
  </Card>
);

export default MyComponent;

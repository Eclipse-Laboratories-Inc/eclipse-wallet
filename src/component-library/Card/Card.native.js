import * as React from 'react';
import {Button, Card, Title, Paragraph} from 'react-native-paper';

const MyComponent = ({title, subtitle, content}) => (
  <Card>
    <Card.Title title={title} subtitle={subtitle} />
    <Card.Content>
      <Paragraph>{content}</Paragraph>
    </Card.Content>
    <Card.Actions>
      <Button>Cancel</Button>
      <Button>Ok</Button>
    </Card.Actions>
  </Card>
);

export default MyComponent;

import React from 'react';
import {ScrollView} from 'react-native';

const PageLayout = ({children}) => (
  <ScrollView contentInsetAdjustmentBehavior="automatic">{children}</ScrollView>
);

export default PageLayout;

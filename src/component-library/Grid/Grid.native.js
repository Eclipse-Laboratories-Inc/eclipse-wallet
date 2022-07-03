import React from 'react';
import { View } from 'react-native';

const Grid = ({ items = [], spacing = 12, columns = 1 }) => (
  <View
    style={{
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: -(8 * spacing),
      marginLeft: -(8 * spacing),
    }}>
    {items.map((item, index) => (
      <View
        key={index}
        style={{
          paddingTop: 8 * spacing,
          paddingLeft: 8 * spacing,
          width: `${100 / columns}%`,
        }}>
        {item}
      </View>
    ))}
  </View>
);

export default Grid;

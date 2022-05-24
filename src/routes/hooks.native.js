import {useContext} from 'react';
import {NavigationContext} from '@react-navigation/native';

export const useNavigation = () => {
  const navigation = useContext(NavigationContext);
  return to => navigation.navigate(to.replace('/', ''));
};

import {useNavigate} from 'react-router-dom';
import find from 'lodash/find';
import {globalRoutes} from './app-routes';

const getRoute = routeKey =>
  find(globalRoutes, route => route.key === routeKey);
export const useNavigation = () => {
  const navigate = useNavigate();
  return to => {
    const toRoute = getRoute(to);
    if (toRoute) {
      navigate(toRoute.route);
    } else {
      console.warn(`route not found ${to}`);
    }
  };
};

import AdapterSelectPage from './AdapterSelectPage';
import AdapterDetailPage from './AdapterDetailPage';

export const ROUTES_MAP = {
  ADAPTER_SELECT: 'ADAPTER_SELECT',
  ADAPTER_DETAIL: 'ADAPTER_DETAIL',
};

const routes = [
  {
    key: ROUTES_MAP.ADAPTER_SELECT,
    name: 'adapterSelect',
    path: 'select',
    route: '/adapter/select',
    Component: AdapterSelectPage,
    default: true,
  },
  {
    key: ROUTES_MAP.ADAPTER_DETAIL,
    name: 'adapterDetail',
    path: 'detail',
    route: '/adapter/detail',
    Component: AdapterDetailPage,
  },
];

export default routes;

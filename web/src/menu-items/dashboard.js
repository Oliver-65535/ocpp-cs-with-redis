// assets

import { CaretLeftOutlined, DashboardOutlined, FileExclamationOutlined, PlayCircleOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  CaretLeftOutlined,
  PlayCircleOutlined,
  FileExclamationOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    // {
    //   id: 'dashboard',
    //   title: 'Dashboard',
    //   type: 'item',
    //   url: '/dashboard/default',
    //   icon: icons.DashboardOutlined,
    //   breadcrumbs: false
    // },
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'transactions',
      title: 'Transactions',
      type: 'item',
      url: '/dashboard/transactions',
      icon: icons.PlayCircleOutlined,
      breadcrumbs: false
    },
    {
      id: 'log',
      title: 'Logs',
      type: 'item',
      url: '/dashboard/log',
      icon: icons.FileExclamationOutlined,
      breadcrumbs: false
    }
  ]
};

export default dashboard;

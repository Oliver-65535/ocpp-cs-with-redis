import Loadable from '../components/Loadable';
import MainLayout from '../layout/MainLayout';
import { lazy } from 'react';

// project import

// render - dashboard
// const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));
const Dashboard1 = Loadable(lazy(() => import('../pages/dashboard1')));
const Transactions = Loadable(lazy(() => import('../pages/transactions')));
const Logs = Loadable(lazy(() => import('../pages/notification')));

// // render - sample page
// const SamplePage = Loadable(lazy(() => import('pages/extra-pages/SamplePage')));

// // render - utilities
// const Typography = Loadable(lazy(() => import('pages/components-overview/Typography')));
// const Color = Loadable(lazy(() => import('pages/components-overview/Color')));
// const Shadow = Loadable(lazy(() => import('pages/components-overview/Shadow')));
// const AntIcons = Loadable(lazy(() => import('pages/components-overview/AntIcons')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <Dashboard1 />
    },
    // {
    //   path: 'color',
    //   element: <Color />
    // },
    // {
    //   path: 'dashboard',
    //   children: [
    //     {
    //       path: 'def1',
    //       element: <DashboardDefault />
    //     }
    //   ]
    // },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <Dashboard1 />
        },
        {
          path: 'transactions',
          element: <Transactions />
        },
        {
          path: 'log',
          element: <Logs />
        }
      ]
    }

    // {
    //   path: 'sample-page',
    //   element: <SamplePage />
    // },
    // {
    //   path: 'shadow',
    //   element: <Shadow />
    // },
    // {
    //   path: 'typography',
    //   element: <Typography />
    // },
    // {
    //   path: 'icons/ant',
    //   element: <AntIcons />
    // }
  ]
};

export default MainRoutes;

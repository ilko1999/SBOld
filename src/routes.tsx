import { Component, lazy } from 'solid-js';
import MyOrgTab from './components/Feed/Tabs/HomeTab/MyOrgTab';
import { ENDPOINTS } from './constants/global';
import FeedPage from './pages/feed-page';
import LoginPage from './pages/login-page';

const HomePage = lazy(() => import('./pages/home-page'));
const RegisterPage = lazy(() => import('./pages/register-page'));

interface Routes {
  path: string;
  component: Component;
}

export const ROUTES: Routes[] = [
  {
    path: ENDPOINTS.HOME,
    component: HomePage,
  },
  {
    path: ENDPOINTS.REGISTER,
    component: RegisterPage,
  },
  {
    path: ENDPOINTS.LOGIN,
    component: LoginPage,
  },
  {
    path: ENDPOINTS.FEED,
    component: FeedPage,
  },
  {
    path: ENDPOINTS.NOTIFICATIONS,
    component: FeedPage,
  },
  {
    path: ENDPOINTS.CHATS,
    component: FeedPage,
  },
  {
    path: ENDPOINTS.MORE,
    component: FeedPage,
  },
  {
    path: ENDPOINTS.EXPLORE,
    component: FeedPage,
  },
  {
    path: ENDPOINTS.PROFILE,
    component: FeedPage,
  },
  {
    path: ENDPOINTS.USER,
    component: FeedPage,
  },
  {
    path: ENDPOINTS.ORG,
    component: FeedPage,
  },
  {
    path: ENDPOINTS.EVENT,
    component: FeedPage,
  },
  {
    path: ENDPOINTS.MYORG,
    component: FeedPage,
  },
  {
    path: ENDPOINTS.EVENTS,
    component: FeedPage,
  },
];

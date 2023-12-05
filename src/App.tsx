import { Route, Routes } from '@solidjs/router';
import {
  Component,
  createEffect,
  For,
  createSignal,
  createResource,
} from 'solid-js';
import { ROUTES } from './routes';
import AuthProvider, { useAuthContext, UserData } from './store/auth-context';
import { StepperProvider } from './store/stepper-context';
import { Router } from '@solidjs/router';

import {
  createClient,
  dedupExchange,
  errorExchange,
  fetchExchange,
} from '@urql/core';
import { BASE_URL } from './constants/global';
import { Toaster } from 'solid-toast';
import { STEP_NUMBER } from './components/RegisterForm/registerFormTypes';
import TabProvider from './store/tabs-context';
import { HopeProvider, HopeThemeConfig } from '@hope-ui/solid';
import { Provider } from 'solid-urql';
import Cookies from 'js-cookie';
import { GET_NEW_RT_ANT_AT } from './gql/user';
import { NotificationProvider } from './store/notification-context';
import { io } from 'socket.io-client';
import { socket } from './components/layout/LoggedInLayout/LoggedInLayout';

const [hasError, setHasError] = createSignal(false);
const [authState, { setRefreshFailed }] = useAuthContext();

export let client = createClient({
  url: BASE_URL + '/graphql',
  suspense: hasError() ? true : false,
  exchanges: [
    dedupExchange,
    errorExchange({
      onError(error) {
        setHasError(true);
      },
    }),
    fetchExchange,
  ],
  fetchOptions: () => ({
    headers: {
      Authorization: `Bearer ${
        !hasError() ? Cookies.get('access_token') : Cookies.get('refresh_token')
      }`,
    },
  }),
});

const config: HopeThemeConfig = {
  initialColorMode: 'system',
  lightTheme: {
    colors: {
      primary1: '#FF570A',
      primary8: '#FF570A80',
      primary5: '#FF570A33',
      primary9: '#FF570A',
      primary10: '#EE520B',
      primary2: '#FF570A',
      primary3: '#FF570A',
      primary4: '#FF570A',
      primary6: '#FF570A',
      primary7: '#FF570A',
      primary11: '#FF570A',
      primary12: '#FF570A',
      neutral8: '#D1CFD6',
      neutral7: '#1B0E330D',
      focusRing: '#FF570A33',
      'primary-orange-opacity-50': '#FF570A80',
      'primary-orange-opacity-20': '#FF570A33',
      'primary-purple': '#1B0E33',
      'primary-purple-opacity-5': '#1B0E330D',
      'primary-purple-opacity-80': '#1B0E33CC',
      'primary-purple-opacity-15': '#1B0E3326',
      'primary-purple-opacity-50': '#1B0E3380',
      'primary-purple-opacity-30': '#1B0E334D',
      'primary-purple-opacity-20': '#D1CFD6',
      'primary-purple-opacity-60': '#1B0E3399',
      'primary-purple-opacity-40': '#1B0E3366',
      'primary-gray': '#D9D9D973',
      'primary-gray-opacity-80': '#D9D9D9CC',
      'primary-gray-opacity-50': '#d9d9d980',
      'primary-gray-opacity-45': '#D9D9D973',
      'primary-red-opacity-80': '#EF4444CC',
      'primary-red-opacity-50': '#F8717180',
      'primary-red-opacity-20': '#F8717133',
    },
  },
};

const App: Component = () => {
  createEffect(() => {
    if (hasError()) {
      const [items, { refetch }] = createResource(() => {
        return client
          .mutation(GET_NEW_RT_ANT_AT, {})
          .toPromise()
          .then(({ data: { rtSportsBuddy } }) => {
            Cookies.set('access_token', rtSportsBuddy.acces_token);
            Cookies.set('refresh_token', rtSportsBuddy.refresh_token);
          });
      });

      setHasError(!hasError());

      // const [items, itemState] = createQuery({
      //   query: GET_NEW_RT_ANT_AT,
      //   context: {
      //     fetchOptions: () => ({
      //       headers: {
      //         Authorization: `Bearer ${Cookies.get('refresh_token')}`,
      //       },
      //     }),
      //   },
      // });
    }
  });
  return (
    <HopeProvider config={config}>
      <Provider value={client}>
        <NotificationProvider>
          <HopeProvider>
            <AuthProvider>
              <TabProvider>
                <Toaster />
                {/* <StepperProvider step={STEP_NUMBER.FIRST}> */}
                <Router>
                  <Routes>
                    <For each={ROUTES}>
                      {(route) => (
                        <Route path={route.path} component={route.component} />
                      )}
                    </For>
                  </Routes>
                </Router>
                {/* </StepperProvider> */}
              </TabProvider>
            </AuthProvider>
          </HopeProvider>
        </NotificationProvider>
      </Provider>
    </HopeProvider>
  );
};

export default App;

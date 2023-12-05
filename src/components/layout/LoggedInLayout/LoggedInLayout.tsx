import { Avatar, notificationTitleStyles, Spinner } from '@hope-ui/solid';
import { useNavigate, useParams, useLocation } from '@solidjs/router';
import Cookies from 'js-cookie';
import { io, Socket } from 'socket.io-client';
import {
  createResource,
  JSXElement,
  onCleanup,
  onMount,
  Show,
  Suspense,
} from 'solid-js';
import { createEffect, createSignal, on } from 'solid-js';
import toast from 'solid-toast';
import { createMutation, createQuery, createSubscription } from 'solid-urql';
import { client } from '../../../App';
import {
  GET_NEW_RT_ANT_AT,
  GET_NOTIFS,
  GET_SPORTSBUDDY,
} from '../../../gql/user';
import _ from 'lodash';
import { useAuthContext } from '../../../store/auth-context';
import { useNotifs } from '../../../store/notification-context';
import { parseJwt } from '../../../utils/authentication';
import ProfileDrawer from '../../Feed/ProfileDrawer/ProfileDrawer';
import SideOrganisationFeed from '../../Feed/SideOrganisationFeed/SideOrganisationFeed';

interface LoggedInLayoutProps {
  children: JSXElement;
}

export let socket = io('http://localhost:3333/sport_events', {
  auth: {
    token: Cookies.get('access_token'),
  },
});

const LoggedInLayout = (props: LoggedInLayoutProps) => {
  const { notifs, setNotifs, reRefetch, setReRefetch, follows, setFollows } =
    useNotifs();

  const { exp } = Cookies.get('refresh_token');
  const navigate = useNavigate();
  const location = useLocation();
  const [pageLoaded, setPageLoaded] = createSignal(0);
  const [sportsBuddy, { refetch }] = createResource(() => {
    return client
      .query(GET_SPORTSBUDDY, {})
      .toPromise()
      .then(({ data: { sportbuddy } }) => sportbuddy);
  });

  createEffect(() => {
    if (Date.now() >= exp * 1000) {
      navigate('/');
    }
    refetch();
  });

  createEffect(
    on(
      () => sportsBuddy(),
      () => {
        socket.disconnect();
        socket.connect();
      }
    )
  );

  onMount(() => {
    const [fetchedNotifs, { refetch }] = createResource(() => {
      return client
        .query(GET_NOTIFS, {})
        .toPromise()
        .then(({ data: { notifs } }) => {
          if (notifs === null) {
            setNotifs([]);
          } else {
            setNotifs(notifs);
          }
        });
    });
    setPageLoaded(pageLoaded() + 1);
  });

  return (
    <div class="grid grid-cols-12 gap-2 mx-6 pt-6">
      <ProfileDrawer data={sportsBuddy()} />
      <Suspense fallback={<Spinner />}>
        <Show when={sportsBuddy()}>
          {props.children}
          <SideOrganisationFeed />
        </Show>
      </Suspense>
    </div>
  );
};

export default LoggedInLayout;

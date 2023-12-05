import { Match, Show, Switch, onMount, createSignal } from 'solid-js';
import HomeTab from '../components/Feed/Tabs/HomeTab/HomeTab';
import LoggedInLayout from '../components/layout/LoggedInLayout/LoggedInLayout';
import useCheckAuthentication from '../hooks/useCheckAuthentication';
import { TABS, useTab } from '../store/tabs-context';
import { getDataFromLocalStorage } from '../utils/localStorage';
import { useLocation, useNavigate } from '@solidjs/router';
import ProfileTab from '../components/Feed/Tabs/HomeTab/ProfileTab';
import Cookies from 'js-cookie';
import { parseJwt } from '../utils/authentication';
import { SportsBuddyPage } from '../components/Feed/Tabs/HomeTab/SportsBuddyPage';
import { OrgPage } from '../components/Feed/Tabs/HomeTab/OrgPage';
import { EventPage } from '../components/Feed/Tabs/HomeTab/EventPage';
import NotificationsTab from '../components/Feed/Tabs/NotificationsTab/NotificationsTab';
import MyOrgTab from '../components/Feed/Tabs/HomeTab/MyOrgTab';
import MyEventsPage from '../components/Feed/Tabs/HomeTab/MyEvents';

const FeedPage = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = createSignal('');
  // onMount(() => {
  //   const token = Cookies.get('access_token');
  //   const { payload } = parseJwt(token);
  //   setUserId(payload.sub);
  // });

  const location = useLocation();
  const pathnameToMatch = location.pathname;

  const user = getDataFromLocalStorage();
  useCheckAuthentication();
  // create hook that checks selected tab from context and sends the user there
  const [tabsState, { changeTab }] = useTab();
  return (
    <Show when={user}>
      <LoggedInLayout>
        <Switch>
          <Match when={pathnameToMatch === '/' + TABS.FEED}>
            <HomeTab />
          </Match>
          <Match when={pathnameToMatch === '/' + TABS.EXPLORE}>
            <p class="col-span-7">Еxplore</p>
          </Match>
          <Match when={pathnameToMatch === '/' + TABS.NOTIFICATIONS}>
            <NotificationsTab />
          </Match>
          <Match when={pathnameToMatch === '/' + TABS.PROFILE}>
            <ProfileTab />
          </Match>
          <Match when={pathnameToMatch === '/' + TABS.MORE}>
            <p class="col-span-7">More</p>
          </Match>
          <Match when={pathnameToMatch === '/' + TABS.CHATS}>
            <p class="col-span-7">Chats</p>
          </Match>
          <Match when={pathnameToMatch.includes(TABS.EVENT + '/')}>
            <EventPage />
          </Match>
          <Match when={pathnameToMatch.includes(TABS.USER)}>
            <SportsBuddyPage />
          </Match>
          <Match when={pathnameToMatch.includes(TABS.ORG + '/')}>
            <OrgPage />
          </Match>
          <Match when={pathnameToMatch === '/' + TABS.ORGANIZATION}>
            <MyOrgTab />
          </Match>
          <Match when={pathnameToMatch === '/' + 'events'}>
            <MyEventsPage />
          </Match>
        </Switch>
      </LoggedInLayout>
    </Show>
  );
};

export default FeedPage;

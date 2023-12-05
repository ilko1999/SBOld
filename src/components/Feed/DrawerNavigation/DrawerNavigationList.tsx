import { Spinner } from '@hope-ui/solid';
import Cookies from 'js-cookie';
import { createEffect, createResource, For, Show, on } from 'solid-js';
import { client } from '../../../App';
import { GET_SPORTSBUDDY } from '../../../gql/user';
import { useNotifs } from '../../../store/notification-context';
import Dot from '../SideOrganisationFeed/Dot';
import {
  drawerNavigationItems,
  drawerNavigationItemsOrg,
} from './drawerNavigation';
import DrawerNavigationItem from './DrawerNavigationItem';

const DrawerNavigationList = () => {
  const { notifs } = useNotifs();

  const [sportsBuddy, { refetch }] = createResource(() => {
    return client
      .query(GET_SPORTSBUDDY, {})
      .toPromise()
      .then(({ data: { sportbuddy } }) => sportbuddy);
  });

  createEffect(
    on(
      () => Cookies.get('access_token'),
      () => refetch()
    )
  );

  createEffect((prev) => {
    const updated = notifs();

    console.log('route previous value is', prev);
    console.log('route updated value is', updated);
    refetch();
    return updated;
  }, notifs());

  return (
    <>
      <Show when={sportsBuddy()} fallback={<Spinner />}>
        <ul class="flex flex-col gap-y-9 mt-9 pr-6 sm:items-start md:items-start">
          <For
            each={
              sportsBuddy().usersOrganization
                ? drawerNavigationItemsOrg
                : drawerNavigationItems
            }
          >
            {(item) => (
              <Show
                when={item.header === 'Notifications'}
                fallback={
                  <DrawerNavigationItem header={item.header} icon={item.icon} />
                }
              >
                {/* <strong class="relative">
                  <span class="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-green-600 flex justify-center items-center items">
                    <span>10</span>
                  </span> */}
                <DrawerNavigationItem header={item.header} icon={item.icon} />
                {/* </strong> */}
              </Show>
            )}
          </For>
        </ul>
      </Show>
    </>
  );
};

export default DrawerNavigationList;

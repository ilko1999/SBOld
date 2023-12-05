import {
  Avatar,
  Button,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Tag,
  Tooltip,
} from '@hope-ui/solid';
import { useParams } from '@solidjs/router';
import {
  Component,
  createResource,
  Show,
  Suspense,
  onMount,
  createEffect,
  createSignal,
  on,
  For,
} from 'solid-js';
import { client } from '../../../../App';
import { GET_CERTAIN_BUDDY, GET_SPORTSBUDDY } from '../../../../gql/user';
import { socket } from '../../../layout/LoggedInLayout/LoggedInLayout';

import MultiSelect from '../../../UI/MultiSelect';

export const SportsBuddyPage: Component<{}> = (props) => {
  const params = useParams();
  const [usCalling, setUsCalling] = createSignal(null);
  const [followed, setFollowed] = createSignal(0);

  onMount(() => {
    refetch();
    const [userCalling] = createResource(() => {
      return client
        .query(GET_SPORTSBUDDY, {})
        .toPromise()
        .then(({ data: { sportbuddy } }) => setUsCalling(sportbuddy));
    });
  });

  const [sportsBuddy, { refetch }] = createResource(() => {
    return client
      .query(GET_CERTAIN_BUDDY, { user: params.name })
      .toPromise()
      .then(({ data: { getUser } }) => getUser);
  });

  createEffect(() => {
    refetch();
  }, [sportsBuddy(), followed()]);

  createEffect(
    on(
      () => followed(),
      () => {
        refetch();
      }
    )
  );

  createEffect(
    on(
      () => params.name,
      () => refetch()
    )
  );

  function handleFollow(userId: string) {
    socket.emit('follow_user', { userId: userId });
    refetch();
    setFollowed(followed() + 1);
  }

  return (
    <Suspense fallback={<Spinner class="col-span-10 col-start-2 ml-28" />}>
      <Show when={sportsBuddy()}>
        <div class="col-span-10 col-start-2 ml-28">
          <div class="max-w-3xl w-full mx-auto z-10">
            <div class="flex flex-col">
              <div class="bg-white border border-white shadow-lg  rounded-3xl p-4 m-4">
                <div class="flex-none sm:flex">
                  <div class=" relative h-32 w-32   sm:mb-0">
                    <Avatar size="xl" name={sportsBuddy().name} />
                  </div>
                  <div class="flex-auto sm:ml-5 justify-evenly">
                    <div class="flex items-center justify-between sm:mt-2">
                      <div class="flex items-center">
                        <div class="flex flex-col">
                          <div class="w-full flex-none text-lg text-gray-800 font-bold leading-none">
                            {sportsBuddy().name}
                          </div>
                          <div class="flex-auto text-gray-500 my-1">
                            <span class="mr-3 ">
                              @{sportsBuddy().profileName}
                            </span>
                            <span class="mr-3 border-r border-gray-200  max-h-0"></span>
                            <span>{sportsBuddy().email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="flex flex-row items-center">
                      <div class="flex-auto text-gray-500 my-1">
                        <span class="flex-auto text-primary-purple mr-2">
                          Bio:
                        </span>
                        {sportsBuddy().bio.length > 0
                          ? sportsBuddy().bio
                          : 'User has not described himself still..🥲'}
                      </div>
                    </div>
                    <div class="flex pt-2  text-sm text-gray-500">
                      <div class="flex-1 inline-flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"></path>
                        </svg>
                        <p class="">
                          {sportsBuddy().followedBy.length} Followers
                        </p>
                      </div>

                      <div class="flex-1 inline-flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"></path>
                        </svg>
                        <p class="">
                          {sportsBuddy().following.length} Following
                        </p>
                      </div>
                      <div class="flex-1 inline-flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                        <Tooltip label="№ of events the user participates in.">
                          <p class="">
                            {sportsBuddy().Event === null
                              ? 0
                              : sportsBuddy().Event.length}{' '}
                            Events
                          </p>
                        </Tooltip>
                      </div>

                      <Show
                        when={
                          sportsBuddy().followedBy.some(
                            (e) => e.name === usCalling()?.name
                          ) === true
                        }
                      >
                        <Tag
                          size={'md'}
                          class=" group-hover:bg-primary-purple-opacity-5 group-hover:text-primary-purple-opacity-80 ease-in-out transition-all"
                        >
                          Already Following 💪
                        </Tag>
                      </Show>
                      <Show
                        when={
                          sportsBuddy().followedBy.some(
                            (e) => e.name === usCalling()?.name
                          ) === false
                        }
                      >
                        <Button
                          disabled={usCalling()?.role === 'ORG'}
                          size={'sm'}
                          borderRadius={'$xl'}
                          backgroundColor={'#D9D9D973'}
                          color={'#FF570A'}
                          _hover={{
                            backgroundColor: '#D9D9D9CC',
                          }}
                          onClick={() => handleFollow(sportsBuddy().id)}
                        >
                          Follow 🫂
                        </Button>
                      </Show>
                    </div>
                  </div>
                </div>
                <div class="flex flex-wrap justify-center my-4">
                  <div class="w-full lg:w-9/12 px-4">
                    <div class="text-sm leading-normal mt-0 mb-2 text-blueGray-400">
                      Users interests
                    </div>
                    <MultiSelect
                      disable={true}
                      isObject
                      placeholder="Sports interested in 🏅"
                      displayValue="name"
                      selectedValues={sportsBuddy().interests}
                    ></MultiSelect>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Tabs alignment={'apart'}>
            <TabList>
              <Tab>Followers</Tab>
              <Tab>Following</Tab>
              <Tab>Events Participating In</Tab>
            </TabList>
            <TabPanel>
              <div class="p-4 w-full bg-white rounded-lg border shadow-md sm:p-8">
                <Show
                  when={sportsBuddy().followedBy.length > 0}
                  fallback={<p>User has no follower 🕸️</p>}
                >
                  <div class="flow-root">
                    <ul
                      role="list"
                      class=" scrollbar-none divide-y divide-gray-200 dark:divide-gray-700 max-h-64 overflow-y-scroll"
                    >
                      <For each={sportsBuddy().followedBy}>
                        {(item) => {
                          return (
                            <li class="py-3 sm:py-4">
                              <div class="flex items-center space-x-4">
                                <div class="flex-shrink-0">
                                  <Avatar name={item.name} />
                                </div>
                                <div class="flex-1 min-w-0">
                                  <p class="text-sm font-medium text-primary-purple truncate">
                                    {item.name}
                                  </p>
                                  <p class="text-sm text-primary-purple-opacity-50">
                                    {item.profileName}
                                  </p>
                                </div>
                              </div>
                            </li>
                          );
                        }}
                      </For>
                    </ul>
                  </div>
                </Show>
              </div>
            </TabPanel>
            <TabPanel>
              <div class="p-4 w-full bg-white rounded-lg border shadow-md sm:p-8">
                <Show
                  when={sportsBuddy().following.length > 0}
                  fallback={<p>User is not following anyone 🕸️</p>}
                >
                  <div class="flow-root">
                    <ul
                      role="list"
                      class=" scrollbar-none divide-y divide-gray-200 dark:divide-gray-700 max-h-64 overflow-y-scroll"
                    >
                      <For each={sportsBuddy().following}>
                        {(item) => {
                          return (
                            <li class="py-3 sm:py-4">
                              <div class="flex items-center space-x-4">
                                <div class="flex-shrink-0">
                                  <Avatar name={item.name} />
                                </div>
                                <div class="flex-1 min-w-0">
                                  <p class="text-sm font-medium text-primary-purple truncate">
                                    {item.name}
                                  </p>
                                  <p class="text-sm text-primary-purple-opacity-50">
                                    {item.profileName}
                                  </p>
                                </div>
                              </div>
                            </li>
                          );
                        }}
                      </For>
                    </ul>
                  </div>
                </Show>
              </div>
            </TabPanel>
            <TabPanel>
              <div class="p-4 w-full bg-white rounded-lg border shadow-md sm:p-8">
                <Show
                  when={sportsBuddy().Event.length > 0}
                  fallback={<p>User is not Participating in any event 🕸️</p>}
                >
                  <div class="mb-10 sm:mb-0 mt-10 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
                    <For each={sportsBuddy()?.Event}>
                      {(event) => (
                        <div
                          class="relative group bg-primary-purple-opacity-50 py-10 sm:py-20 px-4 flex flex-col space-y-2 items-center cursor-pointer rounded-md hover:bg-primary-purple-opacity-15 hover:smooth-hover hover:scale-110 transform 
                                transition duration-500"
                          onClick={() => {
                            onOpen();
                            setSelectedEvent(event);
                          }}
                        >
                          <Show
                            when={event.EventAdditions.eventCoverPhoto !== ''}
                            fallback={
                              <div class="relative h-32  w-full bg-primary-purple-opacity-5 rounded-2xl sm:mb-0 mb-3">
                                <p class="text-xl text-primary-purple-opacity-20 text-center absolute -mx-14 w-28 h-28 left-1/2 top-1/2">
                                  No image.
                                </p>
                              </div>
                            }
                          >
                            <div class="block h-40 w-full bg-primary-purple-opacity-5 rounded-2xl sm:mb-0 mb-3">
                              <img
                                src={event.EventAdditions.eventCoverPhoto}
                                alt={event.EventAdditions.nameOfTheEvent}
                                class=" w-full h-full object-cover rounded-2xl"
                              />
                            </div>
                          </Show>
                          <h4 class="text-white text-2xl font-medium capitalize text-center">
                            {event.EventAdditions.nameOfTheEvent.length > 12
                              ? event.EventAdditions.nameOfTheEvent.slice(0, 11)
                              : event.EventAdditions.nameOfTheEvent}
                            &hellip;
                          </h4>

                          {/* <Badge>22 &bull; members</Badge> */}
                        </div>
                      )}
                    </For>
                  </div>
                </Show>
              </div>
            </TabPanel>
          </Tabs>
        </div>
      </Show>
    </Suspense>
  );
};

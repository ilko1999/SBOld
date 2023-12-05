import {
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  Button,
  Divider,
} from '@hope-ui/solid';
import { createEffect, createResource, For, Show } from 'solid-js';
import CustomButton from '../../../UI/CustomButton';
import Profile from '../../Profile/Profile';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useNotifs } from '../../../../store/notification-context';

import { client } from '../../../../App';
import {
  GET_CERTAIN_BUDDY,
  GET_NOTIFS,
  GET_SPORTSBUDDY,
} from '../../../../gql/user';
import { socket } from '../../../layout/LoggedInLayout/LoggedInLayout';
dayjs.extend(relativeTime);

const NotificationsTab = () => {
  const { notifs, setNotifs, setReRefetch, reRefetch, follows } = useNotifs();

  const [sportsBuddy, { refetch }] = createResource(() => {
    return client
      .query(GET_SPORTSBUDDY, {})
      .toPromise()
      .then(({ data: { sportbuddy } }) => sportbuddy);
  });

  function handleGrantRequest(name, nId, uId, eId) {
    const [sportsBuddy, { refetch }] = createResource(() => {
      return client
        .query(GET_CERTAIN_BUDDY, { user: name })
        .toPromise()
        .then(({ data: { getUser } }) => {
          console.log(getUser);
          socket.emit('grant_access', {
            notifId: nId,
            userId: getUser.id,
            eventId: eId,
          });
          setReRefetch(reRefetch() + 1);
        });
    });

    console.log(name, nId, uId, eId);
  }

  function handleDenyRequest(name, nId, uId, eId) {
    const [sportsBuddy, { refetch }] = createResource(() => {
      return client
        .query(GET_CERTAIN_BUDDY, { user: name })
        .toPromise()
        .then(({ data: { getUser } }) => {
          console.log(getUser);
          socket.emit('deny_access', {
            notifId: nId,
            userId: getUser.id,
            eventId: eId,
          });
          setReRefetch(reRefetch() + 1);
        });
    });
  }

  return (
    <div class="col-span-10 col-start-2 ml-28">
      <h1 class="text-left font-semibold text-5xl">Notifications</h1>

      <div class="flex justify-center mt-8">
        <div class="flex gap-x-8 2xl:gap-x-8 h-680  md:h-auto xs:h-auto lg:h-auto sm:h-auto justify-center xs:flex-col sm:flex-col md:flex-col lg:flex-col">
          <div class=" scrollbar-none scrollbar-rounded-sm scrollbar-thumb-primary-purple-opacity-80 scrollbar-track-primary-purple-opacity-5 p-2 border border-primary-purple-opacity-80 bg-primary-white rounded-xl w-96 max-w-sm h-full overflow-y-scroll xs:pb-44 md:pb-44 sm:pb-44 lg:pb-44 overflow-x-hidden mt-8 md:overflow-hidden lg:overflow-hidden sm:overflow-hidden max-h-156 h-156">
            <h2 class="text-primary-purple-opacity-80 text-2xl mb-4 fixed top-20 xs:static md:static lg:static sm:static">
              Access Requests 🙏
            </h2>
            <div>
              <Show
                when={notifs().length > 0}
                fallback={
                  <Alert
                    status="info"
                    variant="subtle"
                    flexDirection="column"
                    justifyContent="center"
                    textAlign="center"
                    height="200px"
                    class="m-10"
                    rounded={'$xl'}
                    color={'$primary1'}
                    backgroundColor={'$primary5'}
                  >
                    <AlertTitle mt="$4" mb="$1" fontSize="$lg">
                      No requests at this moment 🕸️
                    </AlertTitle>
                    <AlertDescription maxWidth="$sm">
                      Wait till someone requests access to your events. 🙌
                    </AlertDescription>
                  </Alert>
                }
              >
                <For each={notifs()}>
                  {(notif) => {
                    return (
                      <div>
                        <div class="flex justify-between ml-1 mt-2">
                          <div class="flex items-center gap-2 pb-4">
                            <Avatar
                              size="md"
                              name={notif.userAwaiting.name}
                            ></Avatar>
                            <div>
                              <p class=" lg:flex xl:flex 2xl:flex text-sm">
                                {notif.userAwaiting.name}
                              </p>
                              <p class="text-primary-purple-opacity-50  lg:flex xl:flex 2xl:flex  text-sm">
                                @{notif.userAwaiting.profileName}
                              </p>
                            </div>
                          </div>
                          <span class="mr-3">
                            🗓️ {dayjs().to(dayjs(notif.createdAt))}
                          </span>
                        </div>
                        <div class="ml-2 mt-4">
                          <span class="text-primary-purple-opacity-70">
                            Wants to join event:
                          </span>
                          {notif.eventForUser.EventAdditions.nameOfTheEvent}
                        </div>
                        <div class="flex justify-end items-center mt-4 mb-4 mr-1">
                          <Button
                            class="mr-2"
                            size={'sm'}
                            borderRadius={'$xl'}
                            backgroundColor={'#FF570A'}
                            color={'# D9D9D973'}
                            _hover={{
                              backgroundColor: '#FF570A80',
                            }}
                            onClick={() => {
                              console.log('grantingAccess');
                              handleGrantRequest(
                                notif.userAwaiting.profileName,
                                notif.id,
                                notif.userAwaiting.id,
                                notif.eventForUser.id
                              );
                            }}
                          >
                            Grant Access ✅
                          </Button>
                          <Button
                            borderRadius={'$xl'}
                            size={'sm'}
                            backgroundColor={'#D9D9D973'}
                            color={'#FF570A'}
                            _hover={{
                              backgroundColor: '#D9D9D9CC',
                            }}
                            onClick={() => {
                              console.log('grantingAccess');
                              handleDenyRequest(
                                notif.userAwaiting.profileName,
                                notif.id,
                                notif.userAwaiting.id,
                                notif.eventForUser.id
                              );
                            }}
                          >
                            Deny Access ❌
                          </Button>
                        </div>
                        <Divider thickness={'2px'} />
                      </div>
                    );
                  }}
                </For>
              </Show>
            </div>
          </div>
          <div class="max-h-156 h-156 scrollbar-none scrollbar-rounded-sm scrollbar-thumb-primary-purple-opacity-80 scrollbar-track-primary-purple-opacity-5 p-2 border border-primary-purple-opacity-80 bg-primary-white rounded-xl w-96 max-w-sm h-full overflow-y-scroll overflow-x-hidden xs:overflow-hidden mt-8 md:overflow-hidden lg:overflow-hidden sm:overflow-hidden">
            <h2 class="text-primary-purple-opacity-80 text-2xl mb-4 fixed top-20 xs:static md:static lg:static sm:static">
              Recent Followers 🫂
            </h2>
            <div>
              <Show
                when={follows().length > 0}
                fallback={
                  <Alert
                    status="info"
                    variant="subtle"
                    flexDirection="column"
                    justifyContent="center"
                    textAlign="center"
                    height="200px"
                    class="m-10"
                    rounded={'$xl'}
                    color={'$primary1'}
                    backgroundColor={'$primary5'}
                  >
                    <AlertTitle mt="$4" mb="$1" fontSize="$lg">
                      No follows 🕸️
                    </AlertTitle>
                    <AlertDescription maxWidth="$sm">
                      Dont you worry someone will follow you. 🙌
                    </AlertDescription>
                  </Alert>
                }
              >
                <For each={follows()}>
                  {(follow) => {
                    return (
                      <div>
                        <div class="flex justify-between ml-1 mt-2">
                          <span>🔔 New follower</span>
                          <span class="mr-3">
                            🗓️ {dayjs().to(dayjs(follow.createdAt))}
                          </span>
                        </div>
                        <div class="flex justify-center">
                          <div class="flex items-center gap-2 pb-4">
                            <Avatar size="md" name={follow.name}></Avatar>
                            <div>
                              <p class=" lg:flex xl:flex 2xl:flex text-sm">
                                {follow.name}
                              </p>
                              <p class="text-primary-purple-opacity-50  lg:flex xl:flex 2xl:flex  text-sm">
                                @{follow.profileName}
                              </p>
                            </div>
                          </div>
                        </div>

                        <Divider thickness={'2px'} />
                      </div>
                    );
                  }}
                </For>
              </Show>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsTab;

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Avatar,
  Button,
  createDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
} from '@hope-ui/solid';
import {
  createEffect,
  createResource,
  Show,
  For,
  createSignal,
  onMount,
  on,
} from 'solid-js';
import { client } from '../../../../App';
import { GET_CERTAIN_CLUBS } from '../../../../gql/clubs';
import { GET_ORG_EVENTS } from '../../../../gql/events';
import {
  GET_CERTAIN_BUDDY,
  GET_ORGANIZATION,
  GET_SPORTSBUDDY,
} from '../../../../gql/user';
import { GroupModal } from '../../../UI/GroupModal';
import { EventModal } from './EventCard';

function MyOrgTab() {
  const [orgClubs, setOrgClubs] = createSignal(null);
  const [buddy, setBuddy] = createSignal(null);
  const [buddyOrg, setBuddyOrg] = createSignal(null);
  const [isSelectedGroupOpen, setIsSelectedGroupOpen] = createSignal(false);
  const [selectedGroup, setSelectedGroup] = createSignal(null);
  const [selectedEvent, setSelectedEvent] = createSignal(null);

  const [sportsBuddy] = createResource(() => {
    return client
      .query(GET_SPORTSBUDDY, {})
      .toPromise()
      .then(({ data: { sportbuddy } }) => {
        const [clubs, { refetch }] = createResource(() => {
          return client
            .query(GET_CERTAIN_CLUBS, {
              orgId: sportbuddy.usersOrganization.id,
            })
            .toPromise()
            .then(({ data: { getClubsByString } }) =>
              setOrgClubs(getClubsByString)
            );
        });

        setBuddy(sportbuddy);
      });
  });

  const { isOpen, onOpen, onClose } = createDisclosure();

  createEffect(
    on(
      () => buddy()?.usersOrganization.name,
      () => {
        console.log(buddy()?.usersOrganization.name);
        const [org] = createResource(() => {
          return client
            .query(GET_ORGANIZATION, {
              org: buddy()?.usersOrganization.name,
            })
            .toPromise()
            .then(({ data: { getOrg } }) => setBuddyOrg(getOrg));
        });
      }
    )
  );

  return (
    <div class="col-span-10 col-start-2 ml-28">
      <Show when={buddy()} fallback={<Spinner />}>
        <h1 class="text-left font-semibold text-5xl mb-6">
          Organization {buddyOrg()?.name}
        </h1>

        <Show
          when={buddyOrg()?.orgCreatedEvent.length !== 0}
          fallback={
            <Alert
              status="info"
              variant="subtle"
              flexDirection="column"
              justifyContent="center"
              textAlign="center"
              height="200px"
              rounded={'$xl'}
              class="m-10"
              color={'$primary1'}
              backgroundColor={'$primary5'}
            >
              <AlertTitle mt="$4" mb="$1" fontSize="$lg">
                No events created by this Org. 🕸️
              </AlertTitle>
              <AlertDescription maxWidth="$sm">
                Wait till your organization creates an event and access any
                detail of it here. 🙌
              </AlertDescription>
            </Alert>
          }
        >
          <div class=" flex-1 flex flex-col space-y-5 lg:space-y-0 lg:flex-row lg:space-x-10 max-w-6xl sm:p-6 sm:my-2 sm:mx-4 sm:rounded-2xl">
            <div class="flex-1 px-2 sm:px-0">
              <div class="flex items-center gap-y-2 gap-x-4">
                <p class="text-lg leading-6 text-gray-900">
                  <strong class="font-semibold">Events</strong>
                  <svg
                    viewBox="0 0 2 2"
                    class="mx-2 inline h-0.5 w-0.5 fill-current"
                    aria-hidden="true"
                  >
                    <circle cx="1" cy="1" r="1" />
                  </svg>
                  {buddyOrg()?.name}
                </p>
              </div>
              <div class="mb-10 sm:mb-0 mt-10 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
                <For each={buddyOrg()?.orgCreatedEvent}>
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
            </div>
          </div>
        </Show>

        <Show
          when={orgClubs()?.length !== 0}
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
                No clubs created by this Org. 🕸️
              </AlertTitle>
              <AlertDescription maxWidth="$sm">
                Wait till your organization creates a club and access any detail
                of it here. 🙌
              </AlertDescription>
            </Alert>
          }
        >
          <div class=" flex-1 flex flex-col space-y-5 lg:space-y-0 lg:flex-row lg:space-x-10 max-w-6xl sm:p-6 sm:my-2 sm:mx-4 sm:rounded-2xl">
            <div class="flex-1 px-2 sm:px-0">
              <div class="flex items-center gap-y-2 gap-x-4">
                <p class="text-lg leading-6 text-gray-900">
                  <strong class="font-semibold">Groups</strong>
                  <svg
                    viewBox="0 0 2 2"
                    class="mx-2 inline h-0.5 w-0.5 fill-current"
                    aria-hidden="true"
                  >
                    <circle cx="1" cy="1" r="1" />
                  </svg>
                  {buddyOrg()?.name}
                </p>
              </div>
              <div class="mb-10 sm:mb-0 mt-10 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
                <For each={orgClubs()?.reverse()}>
                  {(club) => (
                    <div
                      class="relative group bg-primary-purple-opacity-50 py-10 sm:py-20 px-4 flex flex-col space-y-2 items-center cursor-pointer rounded-md hover:bg-primary-purple-opacity-15 hover:smooth-hover hover:scale-110 transform 
                                transition duration-500"
                      onClick={() => {
                        setIsSelectedGroupOpen(true);
                        setSelectedGroup(club.id);
                      }}
                    >
                      <img
                        class="w-36 h-36 object-cover object-center rounded-full"
                        src={club.clubCoverPhoto}
                        alt={club.name}
                      />
                      <h4 class="text-white text-2xl font-medium capitalize text-center">
                        {club.name.length > 12
                          ? club.name.slice(0, 11)
                          : club.name}
                        &hellip;
                      </h4>

                      {/* <Badge>22 &bull; members</Badge> */}
                    </div>
                  )}
                </For>
              </div>
            </div>
          </div>
        </Show>

        <Modal
          centered
          scrollBehavior="inside"
          opened={isSelectedGroupOpen()}
          size="xl"
          onClose={() => {
            setSelectedGroup(null);
            setIsSelectedGroupOpen(false);
          }}
        >
          <ModalOverlay
            css={{
              backdropFilter: 'blur(5px)',
            }}
          />
          <ModalContent>
            <Show when={selectedGroup()}>
              <GroupModal
                userId={buddy()?.id}
                isUser={
                  buddy()?.role !== 'ORG' &&
                  buddy()?.usersOrganization.id === buddyOrg()?.id
                    ? true
                    : false
                }
                id={selectedGroup()}
              />
            </Show>
          </ModalContent>
        </Modal>

        <Modal size={'3xl'} opened={isOpen()} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <Show when={selectedEvent()}>
              <ModalCloseButton />
              <ModalHeader>
                {/* {props.event.EventAdditions?.nameOfTheEvent} */}
              </ModalHeader>
              <ModalBody>
                <EventModal event={selectedEvent()} />
              </ModalBody>
              <ModalFooter>
                <Button onClick={onClose}>Close</Button>
              </ModalFooter>
            </Show>
          </ModalContent>
        </Modal>
      </Show>
    </div>
  );
}

export default MyOrgTab;

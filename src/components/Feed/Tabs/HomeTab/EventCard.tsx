import Profile from '../../Profile/Profile';
import { Event } from '../../SideOrganisationFeed/SideOrganisationFeedList';
import { IoLocation, IoPeopleSharp } from 'solid-icons/io';
import CustomButton from '../../../UI/CustomButton';
import { CgProfile } from 'solid-icons/cg';
import { isImgUrl } from '../../../../utils/validations';
import * as maplibre from 'maplibre-gl';

import {
  createSignal,
  onMount,
  Show,
  createEffect,
  createResource,
  Suspense,
  Component,
  For,
} from 'solid-js';
import {
  Avatar,
  AvatarExcess,
  AvatarGroup,
  Badge,
  Button,
  Checkbox,
  createDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Tag,
  Tooltip,
  VStack,
} from '@hope-ui/solid';
import { createQuery } from 'solid-urql';
import { GET_SPORTSBUDDY } from '../../../../gql/user';
import { client } from '../../../../App';
import { GET_CERTAIN_EVENT_ALL_DATA } from '../../../../gql/events';
import {
  FaSolidCalendar,
  FaSolidCheck,
  FaSolidClock,
  FaSolidDoorOpen,
  FaSolidGear,
} from 'solid-icons/fa';
import MapGL, { Layer, Source, Viewport, Image } from 'solid-map-gl';
import { useNotifs } from '../../../../store/notification-context';
import { socket } from '../../../layout/LoggedInLayout/LoggedInLayout';

interface EventCardProps {
  event: Event;
  reRefetch: any;
  setReRefetch: any;
}

const EventCard = (props: EventCardProps) => {
  const { reRefetch, setReRefetch } = useNotifs();

  const [sportsBuddy, { refetch }] = createResource(() => {
    return client
      .query(GET_SPORTSBUDDY, {})
      .toPromise()
      .then(({ data: { sportbuddy } }) => sportbuddy);
  });

  function handleRequestAccess(eventId: string) {
    refetch();
    socket.emit('request_access', { id: eventId });
    setReRefetch(reRefetch() + 1);
    setReRefetch(reRefetch() + 1);
  }

  createEffect(() => {
    refetch();
  }, [props, reRefetch()]);

  const { isOpen, onOpen, onClose } = createDisclosure();

  const leftColumnColSpanClass = isImgUrl(
    props.event.EventAdditions?.eventCoverPhoto!
  )
    ? 'col-span-4'
    : 'col-span-6';
  return (
    <div
      onClick={() => {
        onOpen();
      }}
      class="group grid grid-cols-12 bg-primary-purple-opacity-5 border border-primary-purple-opacity-50 rounded-2xl cursor-pointer transition-all ease-in-out hover:bg-primary-orange-opacity-20 hover:border-primary-orange"
    >
      <Modal size={'3xl'} opened={isOpen()} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            {props.event.EventAdditions?.nameOfTheEvent}
          </ModalHeader>
          <ModalBody>
            <EventModal event={props.event} creator={sportsBuddy()} />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <div
        class={`${leftColumnColSpanClass} flex flex-col col-span-8 justify-evenly ml-6`}
      >
        <div class="flex items-center justify-between">
          <Show
            when={props.event.createdBy}
            fallback={
              <div
                class="flex items-center gap-2 pb-4"
                classList={{
                  'mt-6': !props.removeMarginTop,
                }}
              >
                <Avatar size="md" name={props.event.Organization.name}></Avatar>
                <div>
                  <p class=" lg:flex xl:flex 2xl:flex text-sm">
                    {props.event.Organization.name}
                  </p>
                  <p class="text-primary-purple-opacity-50  lg:flex xl:flex 2xl:flex  text-sm">
                    @{props.event.Organization.profileName}
                  </p>
                </div>
              </div>
            }
          >
            <div
              class="flex items-center gap-2 pb-4"
              classList={{
                'mt-6': !props.removeMarginTop,
              }}
            >
              <Avatar size="md" name={props.event.createdBy.name}></Avatar>
              <div>
                <p class=" lg:flex xl:flex 2xl:flex text-sm">
                  {props.event.createdBy.name}
                </p>
                <p class="text-primary-purple-opacity-50  lg:flex xl:flex 2xl:flex  text-sm">
                  @{props.event.createdBy.profileName}
                </p>
              </div>
            </div>
          </Show>
          <div>
            <Badge
              class="mr-3"
              colorScheme={props.event.hasFinished ? 'danger' : 'success'}
            >
              {props.event.hasFinished ? 'Closed' : 'Open'}
            </Badge>
            <Tag class="mr-3 group-hover:bg-primary-purple-opacity-5 group-hover:text-primary-purple-opacity-80 ease-in-out transition-all">
              Event type: {props.event.sport.name}
            </Tag>
          </div>
        </div>

        <div>
          <h1 class="text-primary-purple font-semibold pb-2 text-lg">
            {props.event.EventAdditions?.nameOfTheEvent}
          </h1>
          <p class="pb-8 font-light">
            {props.event.EventAdditions?.description}
          </p>
        </div>

        <div class="flex items-center justify-between py-2">
          <div class="flex">
            <IoPeopleSharp size={35} class="pr-2" />
            <AvatarGroup size={'sm'}>
              <Show
                when={props.event.User.length <= 2}
                fallback={
                  <>
                    <Avatar name={props.event.User[0].name} />
                    <Avatar name={props.event.User[1].name} />
                    <AvatarExcess>{props.event.User.length - 2}</AvatarExcess>
                  </>
                }
              >
                <For each={props.event.User}>
                  {(user) => {
                    return <Avatar name={user.name} />;
                  }}
                </For>
              </Show>
            </AvatarGroup>
          </div>

          <Suspense fallback={<Spinner />}>
            <Show
              when={sportsBuddy()?.role !== 'ORG'}
              fallback={
                <Tooltip
                  placement="bottom"
                  class="bg-slate-100"
                  label="As an Organization you are not allowed to join other organizations events."
                >
                  <Badge
                    variant={'outline'}
                    class=" group-hover:bg-primary-purple-opacity-5 group-hover:text-primary-purple-opacity-80 ease-in-out transition-all"
                  >
                    You are an ORG. 🏢
                  </Badge>
                </Tooltip>
              }
            >
              <Show
                when={
                  props.event.usersRequestingToJoin.some(
                    (e) => e.id === sportsBuddy()?.id
                  ) === false &&
                  props.event.User.some((e) => e.id === sportsBuddy()?.id) ===
                    false &&
                  props.event?.createdBy?.id !== sportsBuddy()?.id
                }
              >
                <Button
                  class=""
                  borderRadius={'$xl'}
                  backgroundColor={'#FF570A'}
                  color={'# D9D9D973'}
                  _hover={{
                    backgroundColor: '#FF570A80',
                  }}
                  onClick={(e) => {
                    handleRequestAccess(props.event.id);
                    e.stopPropagation();
                  }}
                >
                  Request Access 🙏{' '}
                </Button>
              </Show>

              <Show when={props.event?.createdBy?.id === sportsBuddy()?.id}>
                <Tooltip
                  placement="bottom"
                  class="bg-slate-100"
                  label="Click to view the event details"
                >
                  <Tag
                    class="group-hover:bg-primary-purple-opacity-5 group-hover:text-primary-purple-opacity-80 ease-in-out transition-all"
                    variant={'subtle'}
                  >
                    You are the owner of the event 💂
                  </Tag>
                </Tooltip>
              </Show>

              <Show
                when={
                  props.event.usersRequestingToJoin.some(
                    (e) => e.id === sportsBuddy()?.id
                  ) === true
                }
              >
                <Tag class=" group-hover:bg-primary-purple-opacity-5 group-hover:text-primary-purple-opacity-80 ease-in-out transition-all">
                  Access Pending ⌛
                </Tag>
              </Show>

              <Show
                when={
                  props.event.usersRequestingToJoin.some(
                    (e) => e.id === sportsBuddy()?.id
                  ) === false &&
                  props.event.User.some((e) => e.id === sportsBuddy()?.id) ===
                    true &&
                  props.event.createdBy.id !== sportsBuddy()?.id
                }
              >
                <Tag class=" group-hover:bg-primary-purple-opacity-5 group-hover:text-primary-purple-opacity-80 ease-in-out transition-all">
                  You are in the event 🎈
                </Tag>
              </Show>
            </Show>
          </Suspense>
        </div>
      </div>

      <Show
        when={props.event.EventAdditions?.eventCoverPhoto !== ''}
        fallback={
          <div class="col-span-4 flex bg-primary-purple-opacity-5 m-2 rounded-2xl sm:mb-0 mb-3 justify-center items-center">
            <p class="text-xl text-primary-purple-opacity-20 text-center">
              No image.
            </p>
          </div>
        }
      >
        <div class="col-span-4 flex m-2 rounded-2xl sm:mb-0 mb-3">
          <img
            src={props.event.EventAdditions?.eventCoverPhoto}
            alt={props.event.EventAdditions?.nameOfTheEvent}
            class=" w-full  object-cover rounded-2xl"
          />
        </div>
      </Show>
    </div>
  );
};

export default EventCard;

export const EventModal = (props: any) => {
  const [isClicked, setIsClicked] = createSignal(0);
  const [eventData, { refetch }] = createResource(() => {
    return client
      .query(GET_CERTAIN_EVENT_ALL_DATA, { eventId: props.event.id })
      .toPromise()
      .then(({ data: { event } }) => event);
  });

  const [viewport, setViewport] = createSignal({
    center: [25.4858, 42.7339],
    zoom: 10,
  } as Viewport);

  function SetLoc() {
    console.log(
      eventData()?.location.latitude,
      eventData()?.location.longitude
    );
    setViewport({
      ...viewport(),
      center: [
        Number(eventData()?.location.longitude),
        Number(eventData()?.location.latitude),
      ],
      zoom: 16,
    });
  }

  function closeEvent() {
    socket.emit('complete_event', { eventId: eventData().id });
  }

  return (
    <Suspense fallback={<Spinner />}>
      <Show when={eventData()}>
        <div class="max-w-3xl w-full mx-auto z-10">
          <div class="max-w-3xl w-full mx-auto z-10">
            <div class="flex flex-col">
              <div class="bg-white border border-white shadow-lg  rounded-3xl p-4 m-4">
                <div class="flex-none sm:flex">
                  <Show
                    when={eventData().EventAdditions.eventCoverPhoto !== ''}
                    fallback={
                      <div class="relative h-48  w-full bg-primary-purple-opacity-5 rounded-2xl sm:mb-0 mb-3">
                        <p class="text-xl text-primary-purple-opacity-20 text-center absolute -mx-14 w-28 h-28 left-1/2 top-1/2">
                          No image.
                        </p>
                      </div>
                    }
                  >
                    <div class="block  w-full bg-primary-purple-opacity-5 rounded-2xl sm:mb-0 mb-3">
                      <img
                        src={eventData().EventAdditions.eventCoverPhoto}
                        alt={eventData().sport.name}
                        class=" w-full  object-cover rounded-2xl"
                      />
                    </div>
                  </Show>
                  <div class="flex-auto sm:ml-5 justify-evenly">
                    <div class="flex items-center justify-between sm:mt-2">
                      <div class="flex items-center">
                        <div class="flex flex-col">
                          <div class="flex-auto text-gray-500 my-2">
                            <Tag> {eventData().sport.name}</Tag>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Tabs alignment={'apart'} variant={'outline'}>
                      <TabList>
                        <Tab>
                          <IoPeopleSharp size={25} class="pr-2" />
                          <p class="">
                            {eventData().User.length}
                            {'/'}
                            {eventData().maxPpl}
                            Participating
                          </p>
                        </Tab>
                        <Tab onClick={() => SetLoc()}>
                          <IoLocation size={25} class="pr-2" />
                          <p class="">{eventData().location.name}</p>
                        </Tab>
                        <Tab>
                          <FaSolidClock size={25} class="pr-2" />
                          <p class="">{eventData().time}</p>
                        </Tab>
                        <Show
                          when={
                            props.event?.createdBy?.id === props.creator?.id
                          }
                        >
                          <Tab>
                            <FaSolidGear size={25} class="pr-2" />
                            <p class="">Advanced Settings</p>
                          </Tab>
                        </Show>
                      </TabList>
                      <TabPanel>
                        <div class="p-4 w-full bg-white rounded-lg border shadow-md sm:p-8">
                          <Show
                            when={eventData().User.length > 0}
                            fallback={<p>No participants to show</p>}
                          >
                            <div class="flow-root">
                              <ul
                                role="list"
                                class=" scrollbar-none divide-y divide-gray-200 dark:divide-gray-700 max-h-64 overflow-y-scroll"
                              >
                                <For each={eventData().User}>
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
                                          <div class="inline-flex items-center text-base font-semibold text-primary-purple">
                                            {item.email}
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
                        <div class="m-2 w-full bg-white rounded-lg border shadow-md sm:p-8 h-72 max-h-72">
                          <MapGL
                            class="w-full h-full rounded-3xl"
                            mapLib={maplibre} // <- Pass MapLibre package here
                            options={{
                              style:
                                'https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL',
                            }}
                            viewport={viewport()}
                            onViewportChange={() => setViewport(viewport())}
                          >
                            <Image
                              id="cat"
                              image="https://img.icons8.com/parakeet/256/visit.png"
                            />
                            <Source
                              source={{
                                type: 'geojson',
                                data: {
                                  type: 'FeatureCollection',
                                  features: [
                                    {
                                      type: 'Feature',
                                      geometry: {
                                        type: 'Point',
                                        coordinates: viewport().center,
                                      },
                                    },
                                  ],
                                },
                              }}
                            >
                              <Layer
                                style={{
                                  type: 'symbol',
                                  layout: {
                                    'icon-image': 'cat',
                                    'icon-size': 0.1,
                                  },
                                }}
                              />
                            </Source>
                          </MapGL>
                        </div>
                      </TabPanel>
                      <TabPanel>
                        <div class="p-4 w-full bg-white rounded-lg border shadow-md sm:p-8">
                          <div class="w-full flex-none text-lg pb-4 text-primary-purple font-bold leading-none">
                            Event Info:
                          </div>
                          <div class=" w-auto break-words flex-none text-md pb-4 text-primary-purple-opacity-50 font-normal   ">
                            {eventData().EventAdditions.description}
                          </div>

                          <div class="w-full flex-none text-lg pb-4 text-primary-purple font-bold leading-none">
                            Created By:
                          </div>
                          <Show
                            when={eventData().createdBy}
                            fallback={
                              <div class="flex items-center space-x-4 pb-4">
                                <div class="flex-shrink-0">
                                  <Avatar
                                    name={eventData().Organization.name}
                                  />
                                </div>
                                <div class="flex-1 min-w-0">
                                  <p class="text-sm font-medium text-primary-purple truncate">
                                    {eventData().Organization.name}
                                  </p>
                                  <p class="text-sm text-primary-purple-opacity-50">
                                    {eventData().Organization.profileName}
                                  </p>
                                </div>
                              </div>
                            }
                          >
                            <div class="flex items-center space-x-4 pb-4">
                              <div class="flex-shrink-0">
                                <Avatar name={eventData().createdBy.name} />
                              </div>
                              <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-primary-purple truncate">
                                  {eventData().createdBy.name}
                                </p>
                                <p class="text-sm text-primary-purple-opacity-50">
                                  {eventData().createdBy.profileName}
                                </p>
                              </div>
                            </div>
                          </Show>

                          <div class="flex pt-2  text-sm text-gray-500 justify-between">
                            <div class=" inline-flex items-center">
                              <FaSolidCalendar size={25} class="pr-2" />
                              <p class="">{eventData().date}</p>
                            </div>
                            <Tooltip
                              label={`Event is ${
                                eventData().isOpen ? 'Open' : 'Closed'
                              }`}
                            >
                              <div class=" inline-flex items-center">
                                <FaSolidDoorOpen size={25} class="pr-2" />
                                <Checkbox
                                  disabled
                                  defaultChecked={eventData().isOpen}
                                  colorScheme="primary"
                                />
                              </div>
                            </Tooltip>
                            <div class=" inline-flex items-center">
                              <FaSolidClock size={25} class="pr-2" />
                              <p class="">{eventData().time}</p>
                            </div>
                          </div>
                        </div>
                      </TabPanel>
                      <TabPanel>
                        <div class="p-4 w-full bg-white rounded-lg border shadow-md sm:p-8">
                          <div class="w-full flex-none text-lg pb-4 text-primary-purple font-bold leading-none">
                            Event advanced settings
                          </div>

                          <Button onClick={closeEvent}>
                            Close the event 🏁
                          </Button>
                        </div>
                      </TabPanel>
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </Suspense>
  );
};

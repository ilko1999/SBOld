import {
  Spinner,
  Tag,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Avatar,
  Checkbox,
  Box,
  SkeletonCircle,
  SkeletonText,
  Tooltip,
} from '@hope-ui/solid';
import { useParams } from '@solidjs/router';
import { FaSolidClock, FaSolidCalendar, FaSolidDoorOpen } from 'solid-icons/fa';
import { IoPeopleSharp, IoLocation } from 'solid-icons/io';
import { ConfettiExplosion } from 'solid-confetti-explosion';
import {
  Component,
  createEffect,
  createResource,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show,
  Suspense,
} from 'solid-js';
import { client } from '../../../../App';
import {
  GET_CERTAIN_EVENT_ALL_DATA,
  UPDATE_VIEWS_EVENT,
} from '../../../../gql/events';
import MapGL, { Layer, Source, Viewport, Image } from 'solid-map-gl';
import * as maplibre from 'maplibre-gl';

export const EventPage: Component<{}> = (props) => {
  const params = useParams();

  const [eventData, { refetch }] = createResource(() => {
    return client
      .query(GET_CERTAIN_EVENT_ALL_DATA, { eventId: params.id })
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

  onMount(() => {
    const [setVisitedEvent] = createResource(() => {
      return client
        .mutation(UPDATE_VIEWS_EVENT, { setVisitedEventId: params.id })
        .toPromise()
        .then(({ data: { setVisitedEvent } }) => setVisitedEvent);
    });
  });

  return (
    <div class="col-span-10 col-start-2 ml-28">
      <Suspense
        fallback={
          <Box p="$6" boxShadow="$lg" rounded="$sm" bg="$loContrast">
            <SkeletonCircle size="$10" />
            <SkeletonText mt="$4" noOfLines={4} spacing="$4" />
          </Box>
        }
      >
        <Show when={eventData()}>
          <div class="max-w-3xl w-full mx-auto z-10">
            <div class="max-w-3xl w-full mx-auto z-10">
              <div class="flex flex-col">
                <div class="flex justify-center">
                  <Show when={eventData().numVisited === 0}>
                    <ConfettiExplosion
                      particleCount={200}
                      shouldDestroyAfterDone={true}
                      particlesShape="mix"
                      stageHeight={2000}
                      force={0.3}
                    />
                  </Show>
                </div>
                <div class="bg-white border border-white shadow-lg  rounded-3xl p-4 m-4">
                  <div class="flex-none sm:flex">
                    <div class=" block  w-full bg-primary-purple-opacity-5 rounded-2xl sm:mb-0 mb-3">
                      <Show
                        when={eventData().EventAdditions.eventCoverPhoto !== ''}
                        fallback={
                          <p class="text-xl text-primary-purple-opacity-20 text-center absolute -mx-14 w-28 h-28 left-1/2 top-1/2">
                            No image.
                          </p>
                        }
                      >
                        <img
                          src={eventData().EventAdditions.eventCoverPhoto}
                          alt={eventData().sport.name}
                          class=" w-full  object-cover rounded-2xl"
                        />
                      </Show>
                    </div>
                    <div class="flex-auto sm:ml-5 justify-evenly">
                      <div class="flex items-center justify-between sm:mt-2">
                        <div class="flex items-center">
                          <div class="flex flex-col">
                            <div class="flex-auto text-gray-500 my-1">
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
                                  class="divide-y divide-gray-200 dark:divide-gray-700 max-h-64 overflow-y-scroll"
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
                      </Tabs>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Show>
      </Suspense>
    </div>
  );
};

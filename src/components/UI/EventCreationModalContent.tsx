import { createForm } from '@felte/solid';
import { validator } from '@felte/validator-yup';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  SimpleOption,
  SimpleSelect,
  Textarea,
  VStack,
  Switch,
  Avatar,
} from '@hope-ui/solid';
import { Image as hopeImage } from '@hope-ui/solid';
import {
  createEffect,
  createResource,
  createSignal,
  For,
  Show,
} from 'solid-js';
import MapGL, { Layer, Source, Viewport, Image } from 'solid-map-gl';
import type { InferType } from 'yup';
import { boolean, object, string, number, date } from 'yup';
import { client } from '../../App';
import {
  CREATE_EVENT,
  GET_ALL_LOCATIONS,
  GET_ALL_SPORTS,
} from '../../gql/events';
import * as maplibre from 'maplibre-gl';
import { useNavigate } from '@solidjs/router';
import { GET_SPORTSBUDDY } from '../../gql/user';
import { socket } from '../layout/LoggedInLayout/LoggedInLayout';
import { useNotifs } from '../../store/notification-context';

const schema = object({
  eventDetails: object({
    description: string()
      .max(180)
      .label('Description')
      .required('An event always needs description..'),
    nameOfTheEvent: string()
      .required('What is an event without a name')
      .label('Event name'),
    eventCoverPhoto: string().default(''),
  }),
  sport: object({
    id: string().required(),
  }),
  maxPpl: number()
    .integer()
    .nullable(false)
    .required('Dont you need friends to play with?')
    .max(400)
    .min(1)
    .label('Number of people'),
  date: string().required('Date is quite important.'),
  time: string().required('Time is quite important also..'),
  isOpen: boolean(),
  isPaid: boolean(),
  location: object({
    id: string().required('People should know where they are going'),
    latitude: string(),
    longitude: string(),
    name: string(),
  }),
});

export function EventCreationModalContent(props) {
  const { reRefetch, setReRefetch } = useNotifs();
  const { form, errors, data, isValid, setFields } = createForm<
    InferType<typeof schema>
  >({
    extend: validator({ schema }),
    onSubmit: (values) => {
      console.log(values);
    },
    initialValues: {
      eventDetails: {
        description: '',
        nameOfTheEvent: '',
        eventCoverPhoto: '',
      },
      sport: {
        id: '',
      },
      maxPpl: 0,
      date: '',
      time: '',
      isOpen: true,
      isPaid: false,
      location: {
        id: '',
      },
    },
  });

  type Sports = {
    id: string;
    name: string;
  };

  type Location = {
    id: string;
    latitude: string;
    longitude: string;
    name: string;
  };

  const [sports] = createResource<Sports[]>(() => {
    return client
      .query(GET_ALL_SPORTS, {})
      .toPromise()
      .then(({ data: { sports } }) => sports);
  });

  const [sportsBuddy] = createResource(() => {
    return client
      .query(GET_SPORTSBUDDY, {})
      .toPromise()
      .then(({ data: { sportbuddy } }) => sportbuddy);
  });

  const [locations] = createResource<Location[]>(() => {
    return client
      .query(GET_ALL_LOCATIONS, {})
      .toPromise()
      .then(({ data: { locations } }) => locations);
  });

  const [viewport, setViewport] = createSignal({
    center: [25.4858, 42.7339],
    zoom: 5,
  } as Viewport);

  const [isClicked, setIsClicked] = createSignal(false);

  const navigate = useNavigate();

  function handleCreate() {
    const [event] = createResource(() => {
      return client
        .mutation(CREATE_EVENT, {
          createEventInput: data(),
          clubId: props.clubToCreateIn,
        })
        .toPromise()
        .then(({ data: { createEvent } }) => {
          if (sportsBuddy().role === 'ORG') {
            console.log(createEvent.id);
            socket.emit('send_org_notifs', {
              eventId: createEvent.id,
            });
            socket.emit('new_events', {
              eventId: createEvent.id,
            });
            if (!props.fromGroup) {
              navigate(`/ev/${createEvent.id}`, { replace: true });
              setReRefetch(reRefetch() + 1);
              socket.emit('new_events', {
                eventId: createEvent.id,
              });
            } else {
              props.onClose();
              setReRefetch(reRefetch() + 1);
              socket.emit('new_events', {
                eventId: createEvent.id,
              });
            }
          } else {
            navigate(`/ev/${createEvent.id}`, { replace: true });
            setReRefetch(reRefetch() + 1);
            socket.emit('new_events', {
              eventId: createEvent.id,
            });
          }
        });
    });
  }

  const [groupPhoto, setGroupPhoto] = createSignal(null);

  function toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }

  return (
    <div class="grid grid-cols-12 gap-2">
      <VStack
        as="form"
        ref={form}
        alignItems="stretch"
        mx="auto"
        class="col-span-6"
        spacing="$5"
      >
        <p>{isValid()}</p>

        <FormControl required invalid={!!errors('eventDetails.description')}>
          <FormLabel>Event description</FormLabel>
          <Textarea
            name="eventDetails.description"
            placeholder="Tell us more about your event..."
            maxH={60}
          />
          <Show
            when={errors('eventDetails.description')}
            fallback={
              <FormHelperText w="$full" textAlign="end">
                {data('eventDetails.description')?.length ?? 0}/180
              </FormHelperText>
            }
          >
            <FormErrorMessage>
              {errors('eventDetails.description')[0]}
            </FormErrorMessage>
          </Show>
        </FormControl>

        <div class="overflow-hidden relative  w-46 left-1/4">
          <label class="overflow-hidden relative w-46 cursor-pointer">
            <Show
              when={groupPhoto()}
              fallback={
                <img alt={data().name} src="https://placehold.co/800x200" />
              }
            >
              <img class="rounded-xl" src={groupPhoto()} />
            </Show>
            <Input
              onChange={(e) => {
                setGroupPhoto(URL.createObjectURL(e.target.files[0]));
                toDataURL(
                  URL.createObjectURL(e.target.files[0]),
                  function (dataUrl) {
                    data().eventDetails.eventCoverPhoto = dataUrl;
                  }
                );
              }}
              class="absolute block opacity-0 py-2 px-4 w-full pin-r pin-t"
              type="file"
              accept="image/*"
            ></Input>
          </label>
        </div>
        <div class="grid grid-cols-12 gap-6">
          <VStack
            spacing="$5"
            alignItems="stretch"
            mx="auto"
            class="col-span-6"
          >
            <FormControl
              required
              invalid={!!errors('eventDetails.nameOfTheEvent')}
            >
              <FormLabel>Name of event </FormLabel>
              <Input
                type="text"
                name="eventDetails.nameOfTheEvent"
                placeholder="Come up with a name"
              />
              <FormErrorMessage>
                {errors('eventDetails.nameOfTheEvent')[0]}
              </FormErrorMessage>
            </FormControl>

            <FormControl required invalid={!!errors('sport')}>
              <FormLabel>Sport of the Event</FormLabel>
              <SimpleSelect
                placeholder="Choose a sport"
                onChange={(value) => setFields('sport.id', value)}
              >
                <For each={sports()}>
                  {(item) => (
                    <SimpleOption value={item.id}>{item.name}</SimpleOption>
                  )}
                </For>
              </SimpleSelect>
              <FormErrorMessage>{errors('sport')[0]}</FormErrorMessage>
            </FormControl>
            <FormControl required invalid={!!errors('isPaid')}>
              <Switch value={data().isPaid} name="isPaid">
                Is it paid 💸
              </Switch>
              <FormErrorMessage>{errors('isPaid')[0]}</FormErrorMessage>
            </FormControl>
          </VStack>
          <VStack
            spacing="$5"
            alignItems="stretch"
            mx="auto"
            class="col-span-6"
          >
            <FormControl required invalid={!!errors('maxPpl')}>
              <FormLabel>maxPpl</FormLabel>
              <Input
                type="number"
                name="maxPpl"
                placeholder="contact@hope-ui.com"
              />
              <FormErrorMessage>{errors('maxPpl')[0]}</FormErrorMessage>
            </FormControl>

            <FormControl required invalid={!!errors('location')}>
              <FormLabel>location of the Event</FormLabel>
              <SimpleSelect
                onChange={(value) => {
                  const coords = value.split(',');
                  setViewport({
                    ...viewport(),
                    center: [Number(coords[1]), Number(coords[2])],
                    zoom: 16,
                  });
                  setIsClicked(true);
                  setFields('location.id', coords[0]);
                  setFields('location.name', '');
                  setFields('location.latitude', '');
                  setFields('location.longitude', '');
                }}
                placeholder="Choose a location"
              >
                <For each={locations()}>
                  {(item) => (
                    <SimpleOption
                      value={
                        item.id +
                        ',' +
                        item.longitude +
                        ',' +
                        item.latitude +
                        ',' +
                        item.name
                      }
                    >
                      {item.name}
                    </SimpleOption>
                  )}
                </For>
              </SimpleSelect>
              <FormErrorMessage>{errors('location')[0]}</FormErrorMessage>
            </FormControl>
            <FormControl required invalid={!!errors('isOpen')}>
              <Switch defaultChecked name="isOpen">
                Is it open 🚪
              </Switch>
              <FormErrorMessage>{errors('isOpen')[0]}</FormErrorMessage>
            </FormControl>
          </VStack>
        </div>

        <div class="flex gap-x-4 ">
          <FormControl required invalid={!!errors('date')}>
            <FormLabel>Pick Date</FormLabel>
            <Input
              name="date"
              type="date"
              onBlur={(e) => setFields('date', e.target.value)}
            />
            <FormErrorMessage>{errors('date')[0]}</FormErrorMessage>
          </FormControl>

          <FormControl required invalid={!!errors('time')}>
            <FormLabel>Time</FormLabel>
            <Input
              name="time"
              type="time"
              onInput={(e) => setFields('time', e.target.value)}
            />
            <FormErrorMessage>{errors('time')[0]}</FormErrorMessage>
          </FormControl>
        </div>

        <HStack justifyContent="flex-end">
          <Button type="submit" onClick={() => handleCreate()}>
            Create Event
          </Button>
        </HStack>
      </VStack>

      <div class="col-span-6">
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
          {isClicked() ? (
            <>
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
            </>
          ) : null}
        </MapGL>
      </div>
    </div>
  );
}

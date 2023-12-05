import {
  createEffect,
  createResource,
  createSignal,
  For,
  onMount,
  Show,
  Suspense,
  on,
} from 'solid-js';
import { client } from '../../../../App';
import { GET_ALL_EVENTS } from '../../../../gql/events';
import { useAuthContext } from '../../../../store/auth-context';
import CustomButton from '../../../UI/CustomButton';
import { FaRegularCalendarDays } from 'solid-icons/fa';
import { FaSolidLocationPin } from 'solid-icons/fa';
import { Event } from '../../SideOrganisationFeed/SideOrganisationFeedList';
import EventCard from './EventCard';

import {
  createDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Button,
  Box,
  SkeletonCircle,
  SkeletonText,
} from '@hope-ui/solid';
import { EventCreationModalContent } from '../../../UI/EventCreationModalContent';
import Map from '../../../UI/MyMap';
import { GET_SPORTSBUDDY } from '../../../../gql/user';
import { createQuery } from 'solid-urql';
import { useNotifs } from '../../../../store/notification-context';
import { socket } from '../../../layout/LoggedInLayout/LoggedInLayout';

// type EventInformation = {
//   description: string;
//   eventCoverPhoto: string;
//   nameOfTheEvent: string;
// };

const HomeTab = () => {
  const [authContext] = useAuthContext();
  const { isOpen, onOpen, onClose } = createDisclosure();

  const [locaiton, setLocation] = createSignal('');
  const [modalType, setModalType] = createSignal('create');
  const [geoJson, setGeoJson] = createSignal({
    latitude: 0,
    longitude: 0,
  });

  const { reRefetch } = useNotifs();

  const [events, { refetch }] = createResource<Event[]>(() => {
    return client
      .query(GET_ALL_EVENTS, {
        longitude: geoJson().longitude,
        latitude: geoJson().latitude,
      })
      .toPromise()
      .then(({ data: { events } }) => events);
  });

  createEffect(() => {
    console.log(reRefetch());
    refetch();
    refetch();
  }, [reRefetch()]);

  socket.on('newEvent', (data) => {
    console.log(data);
    refetch();
  });

  createEffect(
    on(
      () => reRefetch(),
      () => refetch()
    )
  );

  createEffect(
    on(
      () => geoJson(),
      () => refetch()
    )
  );

  const success = (position: any) => {
    const longitude = position.coords.longitude;
    const latitude = position.coords.latitude;
    setGeoJson({ ...geoJson, longitude, latitude });

    const apiKey = 'bdc_75f406754bcb4fb9aeaaecfd92c1a396';
    const geoApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode?latitude=${latitude}&longitude=${longitude}&localityLanguage=en&key=${apiKey}`;

    fetch(geoApiUrl)
      .then((res) => res.json())
      .then((data) => {
        setLocation(`${data.city}, ${data.countryName}`);
      })
      .catch(() => {
        console.log('Error while fetching location!');
      });
  };
  const error = () => {
    console.log('Error');
  };

  onMount(() => {
    getLocationPrompt();
  });

  const getLocationPrompt = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  const GetModal = () => {
    if (modalType() == 'currentLocation') {
      return (
        <ModalContent>
          <ModalCloseButton onclick={onClose} />
          <ModalHeader>Current Location </ModalHeader>
          <ModalBody>{/* map */}</ModalBody>
        </ModalContent>
      );
    } else {
      return (
        <ModalContent>
          <ModalCloseButton onclick={onClose} />
          <ModalHeader>Create a new Event </ModalHeader>
          <ModalBody>
            <EventCreationModalContent />
          </ModalBody>
        </ModalContent>
      );
    }
  };

  return (
    <div class="col-span-10 col-start-2 ml-28">
      <h1 class="text-left font-semibold text-5xl">Home</h1>
      <div class="flex gap-x-6">
        <CustomButton
          onClick={() => {
            setModalType('create');
            onOpen();
          }}
          lessMarginTop
          variant="primary"
        >
          <span class="mr-3">
            <FaRegularCalendarDays />
          </span>
          Create a new Event
        </CustomButton>

        <Show when={locaiton()}>
          <CustomButton
            lessMarginTop
            variant="secondary--purple-text"
            onClick={() => {
              setModalType('currentLocation');
              onOpen();
            }}
          >
            <span class="mr-3">
              <FaSolidLocationPin />
            </span>
            {locaiton()}
          </CustomButton>
        </Show>

        <Modal
          centered
          scrollBehavior="inside"
          opened={isOpen()}
          size="8xl"
          onClose={onClose}
        >
          <ModalOverlay css={{ backdropFilter: 'blur(5px) ' }} />
          <GetModal></GetModal>
        </Modal>
      </div>
      <div class="flex flex-col gap-y-4 p-2">
        <Suspense
          fallback={
            <For each={[1, 2, 3, 4]}>
              {(i) => (
                <Box p="$6" boxShadow="$lg" rounded="$sm" bg="$loContrast">
                  <SkeletonCircle size="$10" />
                  <SkeletonText mt="$4" noOfLines={4} spacing="$4" />
                </Box>
              )}
            </For>
          }
        >
          <Show when={events() && geoJson()}>
            <For each={events()}>{(event) => <EventCard event={event} />}</For>
          </Show>
        </Suspense>
      </div>
    </div>
  );
};
export default HomeTab;

import {
  Alert,
  AlertTitle,
  AlertDescription,
  Avatar,
  createDisclosure,
  Modal,
  Button,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Badge,
} from '@hope-ui/solid';
import { Show, For, createResource, createSignal } from 'solid-js';
import { client } from '../../../../App';
import { GET_MY_EVENTS } from '../../../../gql/events';
import { socket } from '../../../layout/LoggedInLayout/LoggedInLayout';
import Chat from '../../../UI/Chat';
import { EventModal } from './EventCard';

function MyEventsPage() {
  const { isOpen, onOpen, onClose } = createDisclosure();
  const [selectedEvent, setSelectedEvent] = createSignal(null);
  const [isChatActive, setIsChatActive] = createSignal(false);
  const [eventData, { refetch }] = createResource(() => {
    return client
      .query(GET_MY_EVENTS, {})
      .toPromise()
      .then(
        ({ data: { eventsUserParticipatesIn } }) => eventsUserParticipatesIn
      );
  });

  function connectToChat() {
    socket.emit('enter_chat', { chatId: selectedEvent()?.id });
    setIsChatActive(!isChatActive());
  }
  return (
    <div class="col-span-10 col-start-2 ml-28">
      <h1 class="text-left font-semibold text-5xl">Events 🛒</h1>

      <Show
        when={eventData()?.length !== 0}
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
              User doesnt participate in any event
            </AlertTitle>
            <AlertDescription maxWidth="$sm">
              Go to the homepage and pray to be accepted in an event. 🙏
            </AlertDescription>
          </Alert>
        }
      >
        <div class=" flex-1 flex flex-col space-y-5 lg:space-y-0 lg:flex-row lg:space-x-10 max-w-6xl sm:p-6 sm:my-2 sm:mx-4 sm:rounded-2xl">
          <div class="flex-1 px-2 sm:px-0">
            <div class="flex items-center gap-y-2 gap-x-4">
              <p class="text-lg leading-6 text-gray-900">
                <strong class="font-semibold">My events</strong>
              </p>
            </div>
            <div class="mb-10 sm:mb-0 mt-10 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
              <For each={eventData()}>
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
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>

        <Modal size={'3xl'} opened={isOpen()} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <Show when={selectedEvent()}>
              <ModalCloseButton />
              <ModalHeader>
                {/* {props.event.EventAdditions?.nameOfTheEvent} */}
              </ModalHeader>
              <ModalBody>
                <Show when={isChatActive()}>
                  <Chat chatId={selectedEvent()?.id} />
                </Show>
                <Show when={!isChatActive()}>
                  <EventModal event={selectedEvent()} />
                </Show>
              </ModalBody>
              <ModalFooter>
                <Button onClick={connectToChat}>
                  {!isChatActive ? 'Chat 💬' : 'Exit Chat'}
                </Button>
              </ModalFooter>
            </Show>
          </ModalContent>
        </Modal>
      </Show>
    </div>
  );
}
export default MyEventsPage;

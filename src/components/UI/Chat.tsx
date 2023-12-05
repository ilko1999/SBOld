import {
  Avatar,
  Badge,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Tag,
} from '@hope-ui/solid';
import dayjs from 'dayjs';
import {
  Show,
  For,
  createSignal,
  createResource,
  createEffect,
  onMount,
} from 'solid-js';
import { client } from '../../App';
import { GET_ALL_MESSAGES } from '../../gql/user';
import { socket } from '../layout/LoggedInLayout/LoggedInLayout';

function Chat(props: any) {
  let messageEl;
  const [value, setValue] = createSignal('');
  const [messages, setMessages] = createSignal(null);
  const handleInput = (event) => setValue(event.target.value);

  const [allMessages, { refetch }] = createResource(() => {
    return client
      .query(GET_ALL_MESSAGES, { eventId: props.chatId })
      .toPromise()
      .then(({ data: { getMessagesOfEvent } }) =>
        setMessages(getMessagesOfEvent)
      );
  });

  const el = document.getElementById('scroll-ref');
  // id of the chat container ---------- ^^^
  if (el) {
    el.scrollTop = el.scrollHeight;
  }

  function sendMessage() {
    socket.emit('send_message', { chatId: props.chatId, text: value() });
    setValue('');
  }

  socket.on('messages', (data) => {
    console.log(data);
    setMessages(data);
  });

  return (
    <div class="max-w-3xl w-full mx-auto z-10">
      <div class="max-w-3xl w-full mx-auto z-10">
        <div class="flex flex-col">
          <div class="bg-white border border-white shadow-lg  rounded-3xl p-4 m-4">
            <div class="flex-none sm:flex">
              <div class="p-4 w-full bg-white rounded-lg border shadow-md sm:p-8">
                <Show
                  when={messages()}
                  fallback={<p>No messages to show 🕸️</p>}
                >
                  <div ref={messageEl} class="flow-root">
                    <ul
                      id="scroll-ref"
                      class=" scrollbar-thin divide-y divide-gray-200 max-h-80 h-80 overflow-y-scroll"
                    >
                      <For each={messages()}>
                        {(item) => {
                          return (
                            <li class="py-3 sm:py-4">
                              <div class="flex items-center space-x-4">
                                <div class="flex-shrink-0">
                                  <Avatar name={item.sentBy.name} />
                                </div>
                                <div class="flex-1 min-w-0">
                                  <p class="text-sm font-medium text-primary-purple truncate">
                                    @{item.sentBy.profileName}
                                  </p>
                                  <Tag
                                    variant={'subtle'}
                                    class="text-sm text-primary-purple-opacity-50 mt-2"
                                  >
                                    {item.text}
                                  </Tag>
                                </div>
                                <Badge
                                  variant={'outline'}
                                  class="inline-flex items-center text-base font-semibold text-primary-purple"
                                >
                                  🗓️ {dayjs().to(dayjs(item.createdAt))}
                                </Badge>
                              </div>
                            </li>
                          );
                        }}
                      </For>
                    </ul>
                  </div>
                </Show>
                <FormControl class="flex justify-between">
                  <Input
                    value={value()}
                    onInput={handleInput}
                    id="text"
                    type="text"
                    class="mr-6"
                  />
                  <Button id="scroll-button" onClick={sendMessage}>
                    Send
                  </Button>
                </FormControl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;

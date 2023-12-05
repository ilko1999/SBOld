import {
  Avatar,
  Badge,
  Button,
  createDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Tag,
} from '@hope-ui/solid';
import {
  createEffect,
  createResource,
  Show,
  Suspense,
  For,
  on,
} from 'solid-js';
import { client } from '../../App';
import { GET_CLUB, JOIN_CLUB } from '../../gql/clubs';
import { EventCreationModalContent } from './EventCreationModalContent';

export function GroupModal(props) {
  const { isOpen, onOpen, onClose } = createDisclosure();

  const [club, { refetch }] = createResource(() => {
    return client
      .query(GET_CLUB, { clubId: props.id })
      .toPromise()
      .then(({ data: { getClub } }) => getClub);
  });

  function joinClub() {
    const [club] = createResource(() => {
      return client
        .mutation(JOIN_CLUB, { clubId: props.id })
        .toPromise()
        .then(({ data: { joinClub } }) => refetch());
    });
  }

  createEffect(
    on(
      () => isOpen(),
      () => refetch()
    )
  );

  createEffect(() => {
    refetch();
    refetch();
  }, club());

  return (
    <Suspense fallback={<Spinner />}>
      <Show when={club()}>
        <section class="bg-blueGray-50 pb-2">
          <Show
            when={club().events.length > 0}
            fallback={
              <div class="relative isolate justify-center flex items-center gap-x-6 overflow-hidden bg-gray-50 py-2.5 px-6 sm:px-3.5 sm:before:flex-1">
                <svg
                  viewBox="0 0 577 310"
                  aria-hidden="true"
                  class="absolute top-1/2 left-[max(-7rem,calc(50%-52rem))] -z-10 w-[36.0625rem] -translate-y-1/2 transform-gpu blur-2xl"
                >
                  <path
                    id="1d77c128-3ec1-4660-a7f6-26c7006705ad"
                    fill="url(#49a52b64-16c6-4eb9-931b-8e24bf34e053)"
                    fill-opacity=".3"
                    d="m142.787 168.697-75.331 62.132L.016 88.702l142.771 79.995 135.671-111.9c-16.495 64.083-23.088 173.257 82.496 97.291C492.935 59.13 494.936-54.366 549.339 30.385c43.523 67.8 24.892 159.548 10.136 196.946l-128.493-95.28-36.628 177.599-251.567-140.953Z"
                  />
                  <defs>
                    <linearGradient
                      id="49a52b64-16c6-4eb9-931b-8e24bf34e053"
                      x1="614.778"
                      x2="-42.453"
                      y1="26.617"
                      y2="96.115"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#FF570A" />
                      <stop offset="1" stop-color="#1B0E3380" />
                    </linearGradient>
                  </defs>
                </svg>
                <svg
                  viewBox="0 0 577 310"
                  aria-hidden="true"
                  class="absolute top-1/2 left-[max(45rem,calc(50%+8rem))] -z-10 w-[36.0625rem] -translate-y-1/2 transform-gpu blur-2xl"
                >
                  <use href="#1d77c128-3ec1-4660-a7f6-26c7006705ad" />
                </svg>
                <div class="flex items-center gap-y-2 gap-x-4">
                  <p class="text-sm leading-6 text-gray-900">
                    <strong class="font-semibold">
                      No event for this group
                    </strong>
                  </p>
                </div>
              </div>
            }
          >
            <div class="relative isolate justify-center  flex items-center gap-x-6 overflow-hidden bg-gray-50 py-2.5 px-6 sm:px-3.5 sm:before:flex-1">
              <svg
                viewBox="0 0 577 310"
                aria-hidden="true"
                class="absolute top-1/2 left-[max(-7rem,calc(50%-52rem))] -z-10 w-[36.0625rem] -translate-y-1/2 transform-gpu blur-2xl"
              >
                <path
                  id="1d77c128-3ec1-4660-a7f6-26c7006705ad"
                  fill="url(#49a52b64-16c6-4eb9-931b-8e24bf34e053)"
                  fill-opacity=".3"
                  d="m142.787 168.697-75.331 62.132L.016 88.702l142.771 79.995 135.671-111.9c-16.495 64.083-23.088 173.257 82.496 97.291C492.935 59.13 494.936-54.366 549.339 30.385c43.523 67.8 24.892 159.548 10.136 196.946l-128.493-95.28-36.628 177.599-251.567-140.953Z"
                />
                <defs>
                  <linearGradient
                    id="49a52b64-16c6-4eb9-931b-8e24bf34e053"
                    x1="614.778"
                    x2="-42.453"
                    y1="26.617"
                    y2="96.115"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#FF570A" />
                    <stop offset="1" stop-color="#1B0E3380" />
                  </linearGradient>
                </defs>
              </svg>
              <svg
                viewBox="0 0 577 310"
                aria-hidden="true"
                class="absolute top-1/2 left-[max(45rem,calc(50%+8rem))] -z-10 w-[36.0625rem] -translate-y-1/2 transform-gpu blur-2xl"
              >
                <use href="#1d77c128-3ec1-4660-a7f6-26c7006705ad" />
              </svg>
              <div class="flex items-center gap-y-2 gap-x-4">
                <p class="text-sm leading-6 text-gray-900">
                  <strong class="font-semibold">Event</strong>
                  <svg
                    viewBox="0 0 2 2"
                    class="mx-2 inline h-0.5 w-0.5 fill-current"
                    aria-hidden="true"
                  >
                    <circle cx="1" cy="1" r="1" />
                  </svg>
                  {club().events[0].EventAdditions.nameOfTheEvent}
                </p>
                <a
                  href="#"
                  class="flex-none rounded-full bg-gray-900 py-1 px-3.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                >
                  View now<span aria-hidden="true">👀</span>
                </a>
              </div>
            </div>
          </Show>

          <div class="w-full py-4 px-4 mx-auto">
            <div class="relative flex flex-col min-w-0 break-words bg-primary-gray-opacity-45 w-full mb-6 shadow-xl rounded-lg mt-16">
              <div class="px-6">
                <div class="flex flex-wrap justify-center">
                  <div class="w-full px-4 flex justify-center">
                    <div class="relative">
                      <Avatar
                        size="2xl"
                        name={club().name}
                        src={club().clubCoverPhoto}
                        class="absolute -m-16 -ml-16 lg:-ml-16 "
                      />
                    </div>
                  </div>
                </div>
                <div class="text-center mt-12">
                  <div class="text-lg leading-normal mt-0 mb-2 text-blueGray-400 font-bold">
                    Group Name &#183; {club().name}
                  </div>
                  <div class="mb-2 text-blueGray-600 mt-10">
                    <div class="text-sm leading-normal mt-0 mb-2 text-blueGray-400">
                      Group Description
                    </div>
                    {club().desc}
                  </div>
                </div>
              </div>
            </div>
            <div class="p-4 w-full bg-white rounded-lg border shadow-md sm:p-8">
              <Show
                when={club().users.length > 0}
                fallback={<p>No participants to show</p>}
              >
                <div class="flow-root">
                  <ul
                    role="list"
                    class="scrollbar-none divide-y divide-gray-200 dark:divide-gray-700 max-h-64 overflow-y-scroll"
                  >
                    <For each={club().users}>
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

            <Show
              when={
                props.isUser &&
                club().users.some((e) => e.id === props.userId) === false
              }
            >
              <Button
                class="my-2"
                borderRadius={'$xl'}
                backgroundColor={'#D9D9D973'}
                color={'#FF570A'}
                _hover={{
                  backgroundColor: '#D9D9D9CC',
                }}
                onClick={() => joinClub()}
              >
                Join the flock 🦆
              </Button>
            </Show>

            <Show
              when={
                props.isUser &&
                club().users.some((e) => e.id === props.userId) === true
              }
            >
              <Tag
                class="my-2 hover:cursor-none"
                borderRadius={'$xl'}
                backgroundColor={'#D9D9D973'}
                color={'#FF570A'}
                _hover={{
                  backgroundColor: '#D9D9D9CC',
                }}
              >
                You are in the flock 🦆
              </Tag>
            </Show>

            <Show
              when={
                !props.isUser &&
                club().events.length <= 0 &&
                props.userId === club()?.organization.id
              }
            >
              <Button
                class="my-2"
                borderRadius={'$xl'}
                backgroundColor={'#D9D9D973'}
                color={'#FF570A'}
                _hover={{
                  backgroundColor: '#D9D9D9CC',
                }}
                onClick={onOpen}
              >
                Create a Group Event 🆕
              </Button>

              <Modal
                centered
                scrollBehavior="inside"
                opened={isOpen()}
                onClose={onClose}
                size="full"
              >
                <ModalOverlay css={{ backdropFilter: 'blur(5px) ' }} />
                <ModalContent>
                  <ModalCloseButton />
                  <ModalHeader>Create a new Event </ModalHeader>
                  <ModalBody>
                    <EventCreationModalContent
                      clubToCreateIn={props.id}
                      onClose={onClose}
                      fromGroup={true}
                    />
                  </ModalBody>
                </ModalContent>
              </Modal>
            </Show>
          </div>
        </section>
      </Show>
    </Suspense>
  );
}

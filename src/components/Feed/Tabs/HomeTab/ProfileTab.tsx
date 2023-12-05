import { createForm } from '@felte/solid';
import MultiSelect from '../../../UI/MultiSelect';
import { validator } from '@felte/validator-yup';
import {
  Avatar,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  createDisclosure,
  ModalCloseButton,
  ModalFooter,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverCloseButton,
  PopoverBody,
  Box,
  Divider,
  Badge,
  Tag,
  Tooltip,
  IconButton,
  InputRightElement,
  InputGroup,
  Spinner,
} from '@hope-ui/solid';
import { useParams } from '@solidjs/router';
import Cookies from 'js-cookie';
import {
  FaBrandsInstagram,
  FaBrandsYoutube,
  FaSolidAt,
  FaSolidBuilding,
  FaSolidCircleInfo,
  FaSolidEnvelope,
  FaSolidHeart,
  FaSolidInfo,
  FaSolidLink,
  FaSolidPhone,
  FaSolidUser,
  FaSolidX,
  FaSolidXmark,
} from 'solid-icons/fa';
import { IoCloseSharp } from 'solid-icons/io';
import { VsChromeClose } from 'solid-icons/vs';
import {
  createResource,
  Suspense,
  createEffect,
  onMount,
  createSignal,
  onCleanup,
  Show,
  For,
  Switch,
  Match,
} from 'solid-js';
import { boolean, date, InferType, number, object, array, string } from 'yup';
import { client } from '../../../../App';
import { GET_ALL_SPORTS } from '../../../../gql/events';
import {
  GET_SEARCHED_INPUTS,
  GET_SPORTSBUDDY,
  UPDATE_BUDDY,
} from '../../../../gql/user';
import { useAuthContext } from '../../../../store/auth-context';
import { parseJwt, reinitializeUser } from '../../../../utils/authentication';
import { CreateGroup } from '../../../UI/CreateGroup';
import { useNotifs } from '../../../../store/notification-context';
import { GroupModal } from '../../../UI/GroupModal';
import {
  RatingGroup,
  RatingGroupLabel,
  RatingGroupControl,
  Rating,
} from '@ark-ui/solid';

import {
  FaSolidStar,
  FaRegularStar,
  FaSolidStarHalfStroke,
} from 'solid-icons/fa';

const [isSearchOpen, setIsSearchOpen] = createSignal(false);
const [rerender, setRerender] = createSignal(false);
const [focus, setFocus] = createSignal(false);

const [isCreateGroupOpen, setIsCreateGroupOpen] = createSignal(false);
const [isSelectedGroupOpen, setIsSelectedGroupOpen] = createSignal(false);
const [selectedGroup, setSelectedGroup] = createSignal(null);

const schema = object({
  bio: string(),
  email: string(),
  id: string(),
  igTag: string(),
  interests: array(),
  name: string(),
  profileName: string(),
  website: string(),
  ytTag: string(),
  usersOrganization: object({
    id: string(),
    name: string(),
  }),
});

function ProfileTab() {
  const params = useParams();

  const [count, setRefetch] = createSignal(0);
  const { reRefetch, setReRefetch } = useNotifs();

  const [sportBuddyData, setSportBuddyData] = createSignal(null);
  const [searchResults, setSearchResults] = createSignal({
    users: [],
    orgs: [],
  });
  const [isEditable, setisEditable] = createSignal(false);
  const { isOpen, onOpen, onClose } = createDisclosure();

  createEffect(() => {
    setSportBuddyData(sportsBuddy());

    // refetch();
  }, [isEditable()]);

  const [sportsBuddy, { refetch }] = createResource(() => {
    return client
      .query(GET_SPORTSBUDDY, {})
      .toPromise()
      .then(({ data: { sportbuddy } }) => sportbuddy);
  });

  createEffect(() => {
    console.log(reRefetch());
    refetch();
    setIsCreateGroupOpen(false);
    refetch();
  }, [reRefetch()]);

  const [sports] = createResource(() => {
    return client
      .query(GET_ALL_SPORTS, {})
      .toPromise()
      .then(({ data: { sports } }) => sports);
  });

  let initialValues = {
    bio: '',
    email: '',
    id: '',
    igTag: '',
    interests: [],
    name: '',
    profileName: '',
    website: '',
    ytTag: '',
    usersOrganization: {
      id: '',
      name: '',
    },
  };

  const { form, errors, data, isValid, setFields, setData } = createForm<
    InferType<typeof schema>
  >({
    extend: validator({ schema }),
    initialValues,
  });

  function handleUpdateFields() {
    initialValues = sportBuddyData();
    setData(initialValues);
    console.log(sportBuddyData());
    setisEditable(!isEditable());
  }

  function handleSelect(item: any) {
    data()['usersOrganization'] = item;
    sportBuddyData()['usersOrganization'] = {
      id: item.id,
      name: item.name,
    };
    setRerender(true);
    setRerender(false);

    setIsSearchOpen(false);
  }

  function getSearchInputs(dataToSearch: string) {
    const [results, { refetch }] = createResource(() => {
      return client
        .query(GET_SEARCHED_INPUTS, { text: dataToSearch })
        .toPromise()
        .then(({ data: { findBuddy } }) =>
          setSearchResults({ users: findBuddy?.users, orgs: findBuddy?.orgs })
        );
    });
  }

  function handleUpdateBuddy() {
    console.log(data());
    const [club] = createResource(() => {
      return client
        .mutation(UPDATE_BUDDY, {
          updateSportbuddyInput: {
            bio: data().bio,
            email: data().email,
            igTag: data().igTag,
            interests: data().interests,
            name: data().name,
            organization: data().usersOrganization,
            profileName: data().profileName,
            website: data().website,
            ytTag: data().ytTag,
          },
        })
        .toPromise()
        .then(({ data: { updateSportbuddy } }) => updateSportbuddy);
    });
    setisEditable(!isEditable());
    setReRefetch(reRefetch() + 1);
  }

  return (
    <Suspense fallback={<Spinner />}>
      <Show when={sportBuddyData() && sportBuddyData()?.role !== 'ORG'}>
        <div class="col-span-10 col-start-2 ml-28">
          <h1 class="text-left font-semibold text-5xl mb-6">
            {sportBuddyData()?.profileName}`s profile
          </h1>

          <Avatar size="2xl" name={sportBuddyData().name} />

          <div class="grid grid-cols-12 col-start-2 mt-2">
            <div class="col-span-12 mt-2">
              <div class="grid grid-cols-12 mt-2 gap-x-4">
                <VStack as="form" spacing={'$8'} class="col-span-6">
                  <FormControl class="flex flex-col">
                    <p class="flex flex-row items-center mb-1 ml-3">
                      <FaSolidAt />
                      <FormLabel class="ml-2">
                        <div class="font-semibold">Username</div>
                      </FormLabel>
                    </p>
                    <Input
                      _focus={{
                        boxShadow: 'none',
                        outline: 'none',
                      }}
                      border="none"
                      disabled={!isEditable()}
                      onInput={(e) => (data()['profileName'] = e.target.value)}
                      borderRadius={'$xl'}
                      backgroundColor={'#D1CFD6'}
                      borderColor={'#1B0E3380'}
                      type="profileName"
                      name="profileName"
                      variant="outline"
                      value={sportBuddyData().profileName}
                    />
                  </FormControl>

                  <FormControl class="flex flex-col">
                    <p class="flex flex-row items-center mb-1 ml-3">
                      <FaSolidUser />
                      <FormLabel class="ml-2">
                        <div class="font-semibold">name</div>
                      </FormLabel>
                    </p>
                    <Input
                      _focus={{
                        boxShadow: 'none',
                        outline: 'none',
                      }}
                      border="none"
                      disabled={!isEditable()}
                      borderRadius={'$xl'}
                      backgroundColor={'#D1CFD6'}
                      onInput={(e) => (data()['name'] = e.target.value)}
                      borderColor={'#1B0E3380'}
                      type="name"
                      name="name"
                      variant="outline"
                      value={sportBuddyData().name}
                    />
                  </FormControl>
                </VStack>

                <VStack as="form" spacing="$8" class="col-span-6">
                  <FormControl class="flex flex-col">
                    <p class="flex flex-row items-center mb-1 ml-3">
                      <FaSolidEnvelope />
                      <FormLabel class="ml-2">
                        <div class="font-semibold">Email</div>
                      </FormLabel>
                    </p>
                    <Input
                      _focus={{
                        boxShadow: 'none',
                        outline: 'none',
                      }}
                      border="none"
                      variant="outline"
                      disabled={!isEditable()}
                      borderRadius={'$xl'}
                      backgroundColor={'#D1CFD6'}
                      onInput={(e) => (data()['email'] = e.target.value)}
                      borderColor={'#1B0E3380'}
                      type="email"
                      name="email"
                      value={sportBuddyData().email}
                    />
                  </FormControl>

                  <FormControl class="flex flex-col">
                    <p class="flex flex-row items-center mb-1 ml-3">
                      <FaSolidBuilding />
                      <FormLabel class="ml-2">
                        <div class="font-semibold">Organization</div>
                      </FormLabel>
                    </p>
                    <Switch>
                      <Match when={isEditable()}>
                        <Show
                          when={sportBuddyData()?.usersOrganization}
                          fallback={
                            <MultiSelect
                              options={searchResults()?.orgs}
                              disable={false}
                              emptyRecordMsg="No records currently 📪"
                              loadingMessage="Fetching organizations ⌛"
                              isObject
                              placeholder="Find an organization 🕵️"
                              displayValue="name"
                              showArrow={false}
                              onSelect={(company) =>
                                (data()['usersOrganization'] = {
                                  id: company[0]?.id,
                                  name: company[0]?.name,
                                })
                              }
                              onRemove={(company) =>
                                (data()['usersOrganization'] = {
                                  id: '',
                                  name: '',
                                })
                              }
                              onSearch={(company) => {
                                getSearchInputs(company);
                              }}
                              selectionLimit={1}
                            ></MultiSelect>
                          }
                        >
                          <MultiSelect
                            options={searchResults()?.orgs}
                            disable={false}
                            selectedValues={[
                              sportBuddyData()?.usersOrganization,
                            ]}
                            emptyRecordMsg="No records currently 📪"
                            loadingMessage="Fetching organizations ⌛"
                            isObject
                            placeholder="Find an organization 🕵️"
                            displayValue="name"
                            showArrow={false}
                            onSelect={(company) =>
                              (data()['usersOrganization'] = {
                                id: company[0]?.id,
                                name: company[0]?.name,
                              })
                            }
                            onRemove={(company) =>
                              (data()['usersOrganization'] = {
                                id: '',
                                name: '',
                              })
                            }
                            onSearch={(company) => {
                              getSearchInputs(company);
                            }}
                            selectionLimit={1}
                          ></MultiSelect>
                        </Show>
                      </Match>
                      <Match when={!isEditable()}>
                        <Show
                          when={sportBuddyData()?.usersOrganization}
                          fallback={
                            <MultiSelect
                              options={searchResults()?.orgs}
                              disable={true}
                              emptyRecordMsg="No records currently 📪"
                              loadingMessage="Fetching organizations ⌛"
                              isObject
                              placeholder="Find an organization 🕵️"
                              displayValue="name"
                              customCloseIcon={
                                <FaSolidXmark class="cursor-pointer" />
                              }
                              showArrow={false}
                              onSelect={console.log}
                              onRemove={console.log}
                              onSearch={(company) => {
                                getSearchInputs(company);
                              }}
                              selectionLimit={1}
                            ></MultiSelect>
                          }
                        >
                          <MultiSelect
                            options={searchResults()?.orgs}
                            selectedValues={[
                              sportBuddyData()?.usersOrganization,
                            ]}
                            disable={true}
                            emptyRecordMsg="No records currently 📪"
                            loadingMessage="Fetching organizations ⌛"
                            isObject
                            placeholder="Find an organization 🕵️"
                            displayValue="name"
                            customCloseIcon={
                              <FaSolidXmark class="cursor-pointer" />
                            }
                            showArrow={false}
                            onSelect={console.log}
                            onRemove={console.log}
                            onSearch={(company) => {
                              getSearchInputs(company);
                            }}
                            selectionLimit={1}
                          ></MultiSelect>
                        </Show>
                      </Match>
                    </Switch>
                  </FormControl>
                </VStack>
              </div>
              <div class="grid grid-cols-12 mt-2 gap-x-4">
                <VStack as="form" spacing="$8" class="col-span-12">
                  <FormControl class="flex flex-col">
                    <p class="flex flex-row items-center mb-1 ml-3">
                      <FaSolidCircleInfo />
                      <FormLabel class="ml-2">
                        <div class="font-semibold">Bio</div>
                      </FormLabel>
                    </p>
                    <Textarea
                      _focus={{
                        boxShadow: 'none',
                        outline: 'none',
                      }}
                      border="none"
                      disabled={!isEditable()}
                      maxH={'$32'}
                      borderRadius={'$xl'}
                      backgroundColor={'#D1CFD6'}
                      onInput={(e) => (data()['bio'] = e.target.value)}
                      borderColor={'#1B0E3380'}
                      color={'#1B0E33CC'}
                      type="bio"
                      name="bio"
                      value={sportBuddyData().bio}
                    />
                  </FormControl>
                </VStack>
              </div>

              <div class="grid grid-cols-12 mt-2 gap-x-4">
                <VStack as="form" spacing={'$8'} class="col-span-6">
                  <FormControl class="flex flex-col">
                    <p class="flex flex-row items-center mb-1 ml-3">
                      <FaSolidLink />
                      <FormLabel class="ml-2">
                        <div class="font-semibold">Website</div>
                      </FormLabel>
                    </p>
                    <Input
                      _focus={{
                        boxShadow: 'none',
                        outline: 'none',
                      }}
                      border="none"
                      disabled={!isEditable()}
                      borderRadius={'$xl'}
                      onInput={(e) => (data()['website'] = e.target.value)}
                      backgroundColor={'#D1CFD6'}
                      borderColor={'#1B0E3380'}
                      type="website"
                      name="website"
                      variant="outline"
                      value={sportBuddyData().website}
                    />
                  </FormControl>

                  <FormControl class="flex flex-col">
                    <p class="flex flex-row items-center mb-1 ml-3">
                      <FaBrandsYoutube />
                      <FormLabel class="ml-2">
                        <div class="font-semibold">Youtube</div>
                      </FormLabel>
                    </p>
                    <Input
                      _focus={{
                        boxShadow: 'none',
                        outline: 'none',
                      }}
                      border="none"
                      disabled={!isEditable()}
                      borderRadius={'$xl'}
                      onInput={(e) => (data()['ytTag'] = e.target.value)}
                      backgroundColor={'#D1CFD6'}
                      borderColor={'#1B0E3380'}
                      type="ytTag"
                      name="ytTag"
                      variant="outline"
                      value={sportBuddyData().ytTag}
                    />
                  </FormControl>
                </VStack>

                <VStack as="form" spacing="$8" class="col-span-6">
                  <FormControl class="flex flex-col">
                    <p class="flex flex-row items-center mb-1 ml-3">
                      <FaBrandsInstagram />
                      <FormLabel class="ml-2">
                        <div class="font-semibold">Instagram</div>
                      </FormLabel>
                    </p>
                    <Input
                      _focus={{
                        boxShadow: 'none',
                        outline: 'none',
                      }}
                      border="none"
                      disabled={!isEditable()}
                      borderRadius={'$xl'}
                      onInput={(e) => (data()['igTag'] = e.target.value)}
                      backgroundColor={'#D1CFD6'}
                      borderColor={'#1B0E3380'}
                      color={'#1B0E33CC'}
                      type="igTag"
                      name="igTag"
                      value={sportBuddyData().igTag}
                    />
                  </FormControl>

                  <FormControl class="flex flex-col">
                    <p class="flex flex-row items-center mb-1 ml-3">
                      <FaSolidHeart />
                      <FormLabel class="ml-2">
                        <div class="font-semibold">Interests</div>
                      </FormLabel>
                    </p>
                    <Suspense fallback={<p>Loading...</p>}>
                      <Show when={sports()}>
                        <Switch>
                          <Match when={isEditable()}>
                            <MultiSelect
                              options={sports()}
                              disable={false}
                              isObject
                              displayValue="name"
                              onSelect={(sport) =>
                                (data()['interests'] = sport)
                              }
                              onRemove={(sport) =>
                                (data()['interests'] = sport)
                              }
                              selectedValues={sportBuddyData().interests}
                            ></MultiSelect>
                          </Match>
                          <Match when={!isEditable()}>
                            <MultiSelect
                              options={sports()}
                              disable={true}
                              isObject
                              displayValue="name"
                              selectedValues={sportBuddyData().interests}
                            ></MultiSelect>
                          </Match>
                        </Switch>
                      </Show>
                    </Suspense>
                  </FormControl>
                </VStack>
              </div>
              <div class="col-span-2 col-start-9 mt-6">
                <Show
                  when={!isEditable()}
                  fallback={
                    <div class="flex flex-row justify-start">
                      <Button
                        class="mr-2"
                        borderRadius={'$xl'}
                        backgroundColor={'#D9D9D973'}
                        color={'#FF570A'}
                        _hover={{
                          backgroundColor: '#D9D9D9CC',
                        }}
                        onClick={onOpen}
                      >
                        Save ✅
                      </Button>
                      <Button
                        borderRadius={'$xl'}
                        backgroundColor={'#D9D9D973'}
                        color={'#FF570A'}
                        _hover={{
                          backgroundColor: '#D9D9D9CC',
                        }}
                        onClick={() => handleUpdateFields()}
                      >
                        Cancel ❌
                      </Button>
                    </div>
                  }
                >
                  <Button
                    borderRadius={'$xl'}
                    backgroundColor={'#D9D9D973'}
                    color={'#FF570A'}
                    _hover={{
                      backgroundColor: '#D9D9D9CC',
                    }}
                    onClick={() => handleUpdateFields()}
                  >
                    Edit Profile ✍️
                  </Button>

                  <section class="flex flex-col w-full pb-12 pt-4">
                    <h1 class="text-xl border-primary-orange border-b-2 text-primary-purple pb-1 self-start mb-12">
                      More User Info ℹ️
                    </h1>
                    <RatingGroup
                      class="flex flex-col"
                      max={5}
                      value={2.5}
                      readOnly
                      allowHalf
                    >
                      <RatingGroupControl class="flex flex-row">
                        {(context) =>
                          context().sizeArray.map((index) => (
                            <Rating index={index}>
                              {({ isHalf, isHighlighted }) => {
                                if (isHalf)
                                  return (
                                    <FaSolidStarHalfStroke
                                      color="#FF570A"
                                      size={24}
                                    />
                                  );
                                if (isHighlighted)
                                  return (
                                    <FaSolidStar color="#FF570A" size={24} />
                                  );
                                return (
                                  <FaRegularStar color="#FF570A33" size={24} />
                                );
                              }}
                            </Rating>
                          ))
                        }
                      </RatingGroupControl>
                    </RatingGroup>

                    <div class="max-w-2xl m-auto">
                      <div
                        id="default-carousel"
                        class="relative mb-4 mt-4 ml-4"
                        data-carousel="static"
                      >
                        <div class="overflow-hidden relative h-56 rounded-lg sm:h-64 xl:h-80 2xl:h-96">
                          <div
                            class="hidden duration-700 ease-in-out"
                            data-carousel-item
                          >
                            <span class="absolute top-1/2 left-1/2 text-2xl font-semibold text-white -translate-x-1/2 -translate-y-1/2 sm:text-3xl dark:text-gray-800">
                              First Slide
                            </span>
                            <img
                              src="https://flowbite.com/docs/images/carousel/carousel-1.svg"
                              class="block absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2"
                              alt="..."
                            />
                          </div>
                          <div
                            class="hidden duration-700 ease-in-out"
                            data-carousel-item
                          >
                            <img
                              src="https://flowbite.com/docs/images/carousel/carousel-2.svg"
                              class="block absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2"
                              alt="..."
                            />
                          </div>
                          <div
                            class="hidden duration-700 ease-in-out"
                            data-carousel-item
                          >
                            <img
                              src="https://flowbite.com/docs/images/carousel/carousel-3.svg"
                              class="block absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2"
                              alt="..."
                            />
                          </div>
                        </div>
                        <div class="flex absolute bottom-5 left-1/2 z-30 space-x-3 -translate-x-1/2">
                          <button
                            type="button"
                            class="w-3 h-3 rounded-full"
                            aria-current="false"
                            aria-label="Slide 1"
                            data-carousel-slide-to="0"
                          ></button>
                          <button
                            type="button"
                            class="w-3 h-3 rounded-full"
                            aria-current="false"
                            aria-label="Slide 2"
                            data-carousel-slide-to="1"
                          ></button>
                          <button
                            type="button"
                            class="w-3 h-3 rounded-full"
                            aria-current="false"
                            aria-label="Slide 3"
                            data-carousel-slide-to="2"
                          ></button>
                        </div>
                        <button
                          type="button"
                          class="flex absolute top-0 left-0 z-30 justify-center items-center px-4 h-full cursor-pointer group focus:outline-none"
                          data-carousel-prev
                        >
                          <span class="inline-flex justify-center items-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                            <svg
                              class="w-5 h-5 text-white sm:w-6 sm:h-6 dark:text-gray-800"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M15 19l-7-7 7-7"
                              ></path>
                            </svg>
                            <span class="hidden">Previous</span>
                          </span>
                        </button>
                        <button
                          type="button"
                          class="flex absolute top-0 right-0 z-30 justify-center items-center px-4 h-full cursor-pointer group focus:outline-none"
                          data-carousel-next
                        >
                          <span class="inline-flex justify-center items-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                            <svg
                              class="w-5 h-5 text-white sm:w-6 sm:h-6 dark:text-gray-800"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 5l7 7-7 7"
                              ></path>
                            </svg>
                            <span class="hidden">Next</span>
                          </span>
                        </button>
                      </div>
                      <p class="ml-4">
                        This carousel component is part of the{' '}
                        <a
                          class="text-blue-600 hover:underline"
                          href="https://flowbite.com/docs/components/carousel/"
                          target="_blank"
                        >
                          Flowbite component library.
                        </a>
                      </p>
                    </div>
                  </section>
                </Show>
              </div>
            </div>
          </div>
        </div>

        <Modal
          centered
          scrollBehavior="inside"
          opened={isOpen()}
          size="xl"
          onClose={onClose}
        >
          <ModalOverlay
            css={{
              backdropFilter: 'blur(5px)',
            }}
          />
          <ModalContent>
            <ModalCloseButton
              _focus={{
                boxShadow: '0 0 0 3px #FF570A33',
              }}
            />
            <ModalHeader>Update your Profile ❓</ModalHeader>
            <ModalBody>
              Are you sure you want to update your profile information.
            </ModalBody>
            <ModalFooter>
              <Button
                class="mr-4"
                onClick={() => {
                  handleUpdateBuddy();
                  onClose();
                }}
              >
                Update
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Show>
      <Show when={sportBuddyData() && sportBuddyData()?.role === 'ORG'}>
        <div class="col-span-10 col-start-2 ml-28">
          <h1 class="text-left font-semibold text-5xl mb-6">
            {sportBuddyData()?.profileName}`s profile
          </h1>

          <Avatar size="2xl" name={sportBuddyData().name} />
          <VStack as="form" spacing={'$8'} class="col-span-6 mt-2">
            <FormControl class="flex flex-col">
              <p class="flex flex-row items-center mb-1 ml-3">
                <FaSolidAt />
                <FormLabel class="ml-2">
                  <div class="font-semibold">Username</div>
                </FormLabel>
              </p>
              <Input
                _focus={{
                  boxShadow: 'none',
                  outline: 'none',
                }}
                border="none"
                disabled={!isEditable()}
                onInput={(e) => (data()['profileName'] = e.target.value)}
                borderRadius={'$xl'}
                backgroundColor={'#D1CFD6'}
                borderColor={'#1B0E3380'}
                type="profileName"
                name="profileName"
                variant="outline"
                value={sportBuddyData().profileName}
              />
            </FormControl>

            <FormControl class="flex flex-col">
              <p class="flex flex-row items-center mb-1 ml-3">
                <FaSolidUser />
                <FormLabel class="ml-2">
                  <div class="font-semibold">name</div>
                </FormLabel>
              </p>
              <Input
                _focus={{
                  boxShadow: 'none',
                  outline: 'none',
                }}
                border="none"
                disabled={!isEditable()}
                borderRadius={'$xl'}
                backgroundColor={'#D1CFD6'}
                onInput={(e) => (data()['name'] = e.target.value)}
                borderColor={'#1B0E3380'}
                type="name"
                name="name"
                variant="outline"
                value={sportBuddyData().name}
              />
            </FormControl>

            <FormControl class="flex flex-col">
              <p class="flex flex-row items-center mb-1 ml-3">
                <FaSolidEnvelope />
                <FormLabel class="ml-2">
                  <div class="font-semibold">Email</div>
                </FormLabel>
              </p>
              <Input
                _focus={{
                  boxShadow: 'none',
                  outline: 'none',
                }}
                border="none"
                variant="outline"
                disabled={!isEditable()}
                borderRadius={'$xl'}
                backgroundColor={'#D1CFD6'}
                onInput={(e) => (data()['email'] = e.target.value)}
                borderColor={'#1B0E3380'}
                type="email"
                name="email"
                value={sportBuddyData().email}
              />
            </FormControl>

            <FormControl class="flex flex-col">
              <p class="flex flex-row items-center mb-1 ml-3">
                <FaSolidCircleInfo />
                <FormLabel class="ml-2">
                  <div class="font-semibold">Bio</div>
                </FormLabel>
              </p>
              <Textarea
                _focus={{
                  boxShadow: 'none',
                  outline: 'none',
                }}
                border="none"
                disabled={!isEditable()}
                maxH={'$32'}
                borderRadius={'$xl'}
                backgroundColor={'#D1CFD6'}
                onInput={(e) => (data()['bio'] = e.target.value)}
                borderColor={'#1B0E3380'}
                color={'#1B0E33CC'}
                type="bio"
                name="bio"
                value={sportBuddyData().bio}
              />
            </FormControl>
          </VStack>

          <div class="col-span-2 col-start-9 mt-6">
            <Show
              when={!isEditable()}
              fallback={
                <div class="flex flex-row justify-start">
                  <Button
                    class="mr-2"
                    borderRadius={'$xl'}
                    backgroundColor={'#D9D9D973'}
                    color={'#FF570A'}
                    _hover={{
                      backgroundColor: '#D9D9D9CC',
                    }}
                    onClick={onOpen}
                  >
                    Save ✅
                  </Button>
                  <Button
                    borderRadius={'$xl'}
                    backgroundColor={'#D9D9D973'}
                    color={'#FF570A'}
                    _hover={{
                      backgroundColor: '#D9D9D9CC',
                    }}
                    onClick={() => handleUpdateFields()}
                  >
                    Cancel ❌
                  </Button>
                </div>
              }
            >
              <Button
                borderRadius={'$xl'}
                backgroundColor={'#D9D9D973'}
                color={'#FF570A'}
                _hover={{
                  backgroundColor: '#D9D9D9CC',
                }}
                onClick={() => handleUpdateFields()}
              >
                Edit Profile ✍️
              </Button>
            </Show>
          </div>

          <Modal
            centered
            scrollBehavior="inside"
            opened={isOpen()}
            size="xl"
            onClose={onClose}
          >
            <ModalOverlay
              css={{
                backdropFilter: 'blur(5px)',
              }}
            />
            <ModalContent>
              <ModalCloseButton
                _focus={{
                  boxShadow: '0 0 0 3px #FF570A33',
                }}
              />
              <ModalHeader>Update your Profile ❓</ModalHeader>
              <ModalBody>
                Are you sure you want to update your profile information.
              </ModalBody>
              <ModalFooter>
                <Button
                  class="mr-4"
                  onClick={() => {
                    console.log(data());
                    onClose();
                  }}
                >
                  Update
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <div class=" flex-1 flex flex-col space-y-5 lg:space-y-0 lg:flex-row lg:space-x-10 max-w-6xl sm:p-6 sm:my-2 sm:mx-4 sm:rounded-2xl">
            <div class="flex-1 px-2 sm:px-0">
              <div class="mb-10 sm:mb-0 mt-10 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4">
                <div
                  onClick={() => setIsCreateGroupOpen(true)}
                  class="group bg-primary-purple-opacity-50 py-20 px-4 flex flex-col space-y-2 items-center cursor-pointer rounded-md hover:bg-primary-purple-opacity-15 hover:smooth-hover"
                >
                  <a
                    class=" bg-primary-purple-opacity-50 text-primary-gray-opacity-80 group-hover:text-white group-hover:scale-110 transform 
                    transition duration-500 group-hover:smooth-hover flex w-20 h-20 rounded-full items-center justify-center"
                    href="#"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-10 w-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </a>
                  <a
                    class=" text-primary-gray-opacity-80 group-hover:text-white group-hover:smooth-hover text-center group-hover:scale-110 transform 
                    transition duration-500"
                    href="#"
                  >
                    Create group
                  </a>
                </div>

                <Modal
                  centered
                  scrollBehavior="inside"
                  opened={isCreateGroupOpen()}
                  size="xl"
                  onClose={() => setIsCreateGroupOpen(false)}
                >
                  <ModalOverlay
                    css={{
                      backdropFilter: 'blur(5px)',
                    }}
                  />
                  <ModalContent>
                    <ModalCloseButton
                      _focus={{
                        boxShadow: '0 0 0 3px #FF570A33',
                      }}
                    />
                    <ModalHeader>Create a new Group 👯</ModalHeader>
                    <CreateGroup />
                  </ModalContent>
                </Modal>

                <Modal
                  centered
                  scrollBehavior="outside"
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
                        userId={sportBuddyData().id}
                        id={selectedGroup()}
                      />
                    </Show>
                  </ModalContent>
                </Modal>

                <For each={sportBuddyData().clubs.reverse()}>
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
                        class="w-20 h-20 object-cover object-center rounded-full"
                        src={club.clubCoverPhoto}
                        alt={club.name}
                      />
                      <h4 class="text-white text-2xl font-bold capitalize text-center">
                        {club.name}
                      </h4>

                      {/* <Badge>22 &bull; members</Badge> */}
                    </div>
                  )}
                </For>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </Suspense>
  );
}

export default ProfileTab;

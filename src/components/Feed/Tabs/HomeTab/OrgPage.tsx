import {
  Avatar,
  Button,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Tag,
  Tooltip,
} from '@hope-ui/solid';
import { useParams } from '@solidjs/router';
import {
  Component,
  createResource,
  Show,
  Suspense,
  onMount,
  createEffect,
  on,
} from 'solid-js';
import { client } from '../../../../App';
import { GET_ORGANIZATION } from '../../../../gql/user';
import MultiSelect from '../../../UI/MultiSelect';

export const OrgPage: Component<{}> = (props) => {
  const params = useParams();

  const [sportsBuddy, { refetch }] = createResource(() => {
    return client
      .query(GET_ORGANIZATION, { org: params.name })
      .toPromise()
      .then(({ data: { getOrg } }) => getOrg);
  });

  createEffect(() => {
    refetch();
  });

  createEffect(
    on(
      () => params.name,
      () => refetch()
    )
  );

  return (
    <Suspense fallback={<Spinner class="col-span-10 col-start-2 ml-28" />}>
      <Show when={sportsBuddy()}>
        <div class="col-span-10 col-start-2 ml-28">
          <div class="max-w-3xl w-full mx-auto z-10">
            <div class="flex flex-col">
              <div class="bg-white border border-white shadow-lg  rounded-3xl p-4 m-4">
                <div class="flex-none sm:flex">
                  <div class=" relative h-32 w-32   sm:mb-0">
                    <Avatar size="xl" name={sportsBuddy().name} />
                  </div>
                  <div class="flex-auto sm:ml-5 justify-evenly">
                    <div class="flex items-center justify-between sm:mt-2">
                      <div class="flex items-center">
                        <div class="flex flex-col">
                          <div class="w-full flex-none text-lg text-gray-800 font-bold leading-none">
                            Organization - {sportsBuddy().name}
                          </div>
                          <div class="flex-auto text-gray-500 my-1">
                            <span class="mr-3 ">
                              @{sportsBuddy().profileName}
                            </span>
                            <span class="mr-3 border-r border-gray-200  max-h-0"></span>
                            <span>{sportsBuddy().email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="flex flex-row items-center">
                      <div class="flex-auto text-gray-500 my-1">
                        <span class="flex-auto text-primary-purple mr-2">
                          Bio:
                        </span>
                        {sportsBuddy().bio.length > 0
                          ? sportsBuddy().bio
                          : 'No bio for this Organization🥲'}
                      </div>
                    </div>
                    <div class="flex pt-2  text-sm text-gray-500 justify-start">
                      <div class="flex-1 inline-flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"></path>
                        </svg>
                        <p class="">{sportsBuddy().Users.length} Users</p>
                      </div>

                      <div class="flex-1 inline-flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                        <Tooltip label="Events by the org.">
                          <p class="">
                            {sportsBuddy().orgCreatedEvent.length} Events
                          </p>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Tabs alignment={'apart'}>
            <TabList>
              <Tab>Followers</Tab>
              <Tab>Following</Tab>
              <Tab>Events Participating In</Tab>
            </TabList>
            <TabPanel>1</TabPanel>
            <TabPanel>2</TabPanel>
            <TabPanel>3</TabPanel>
          </Tabs>
        </div>
      </Show>
    </Suspense>
  );
};

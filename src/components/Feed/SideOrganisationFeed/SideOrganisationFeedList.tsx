import { For } from 'solid-js';
import Dot from './Dot';

import SideOrganisationFeedItem from './SideOrganisationFeedItem';
export type Event = {
  title: string;
  place: string;
  time: string;
  description: string;
  people: string;
  EventAdditions?: {
    description: string;
    nameOfTheEvent: string;
    eventCoverPhoto: string;
  };
  createdBy: {
    name: string;
    id: string;
    profileName: string;
  };
  sport: {
    id: string;
    name: string;
  };
  usersRequestingToJoin: [{ id: string }];
  User: [{ id: string }];
  hasFinished: Boolean;
  Organization: {
    name: string;
    id: string;
    profileName: string;
  };
};

const mockedEvents: Event[] = [
  {
    title: 'Champions league final watch party',
    description:
      'Lets watch one of the most emblematic finals in champions league ever and share some 🍿 and drinks some 🍺 ...',
    place: 'Accedia 10th floor',
    time: '22:30',
    people: '2/20',
  },
  {
    title: 'Champions league final watch party',
    description:
      'Lets watch one of the most emblematic finals in champions league ever and share some 🍿 and drinks some 🍺 ...',
    place: 'Accedia 10th floor',
    time: '22:30',
    people: '2/20',
  },
];

const SideOrganisationFeedList = () => {
  return (
    <div class="bg-primary-purple-opacity-5 border border-primary-purple-opacity-50 rounded-2xl mt-2 p-2 overflow-hidden">
      <ul class="overflow-y-hidden flex flex-col gap-5">
        <h1 class="text-xl">Organisation Events 🏢</h1>
        <For each={mockedEvents}>
          {(event) => {
            return <SideOrganisationFeedItem event={event} />;
          }}
        </For>
      </ul>
    </div>
  );
};

export default SideOrganisationFeedList;

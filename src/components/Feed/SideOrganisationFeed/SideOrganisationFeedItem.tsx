import Profile from '../Profile/Profile';
import { Event } from './SideOrganisationFeedList';
import { FaSolidLocationPin } from 'solid-icons/fa';
import { IoTime } from 'solid-icons/io';
import { IoPeople } from 'solid-icons/io';
import { truncateString } from '../../../utils/utils';
//extract into Card component

interface SideOrganisationFeedItemProps {
  event: Event;
}

const SideOrganisationFeedItem = (props: SideOrganisationFeedItemProps) => {
  const { description, people, place, time, title } = props.event;
  return (
    <li
      class="flex flex-col gap-3 rounded-2xl px-4 cursor-pointer xl:gap-0
     hover:border-primary-orange hover:bg-primary-orange-opacity-20
     bg-primary-purple-opacity-15 border border-primary-purple-opacity-80"
    >
      <Profile />
      {/* {truncateString(title, 23) add this for laptop ...} */}
      <h2 class="font-bold">{truncateString(title, 23)}</h2>
      <p class="collapse sm:collapse md:visible lg:visible xl:visible 2xl:visible">
        {description}
      </p>
      <div class="flex justify-between mb-2">
        <p class="text-xs flex">
          <FaSolidLocationPin size="15px" />
          {place}
        </p>
        <p class="text-xs flex">
          <IoTime size="15px" />
          {time}
        </p>
        <p class="text-xs flex">
          <IoPeople size="15px" />
          {people}
        </p>
      </div>
    </li>
  );
};

export default SideOrganisationFeedItem;

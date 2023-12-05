import { createResource, createSignal, onCleanup } from 'solid-js';
import { client } from '../../../App';
import { GET_SEARCHED_INPUTS } from '../../../gql/user';
import SearchBox from '../../SearchBox/SearchBox';
import MultiSelect from '../../UI/MultiSelect';
import SideOrganisationFeedList from './SideOrganisationFeedList';
import { Option } from '../../UI/MultiSelect/Option';
import { useNavigate } from '@solidjs/router';
import {
  Button,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from '@hope-ui/solid';
import { FaSolidMagnifyingGlass } from 'solid-icons/fa';

const SideOrganisationFeed = () => {
  const [searchResults, setSearchResults] = createSignal<Option[]>([]);

  const navigation = useNavigate();

  function getSearchInputs(dataToSearch: string) {
    const [results] = createResource(() => {
      return client
        .query(GET_SEARCHED_INPUTS, { text: dataToSearch })
        .toPromise()
        .then(({ data: { findBuddy } }) => {
          let newUsers = findBuddy.users.map(function (ele) {
            return { ...ele, group: 'Users' };
          });

          let newOrgs = findBuddy.orgs.map(function (ele) {
            return { ...ele, group: 'Orgs' };
          });

          setSearchResults([...newOrgs, ...newUsers]);
        });
    });
  }

  function handleSelect(item) {
    if (item.group === 'Orgs') {
      navigation(`/org/${item.profileName}`);
    } else {
      navigation(`/user/${item.profileName}`);
    }
  }

  return (
    <div class="fixed bottom-20">
      <Popover placement="top-start">
        <PopoverTrigger
          as={IconButton}
          icon={<FaSolidMagnifyingGlass />}
          aria-label="trigger"
        />
        <PopoverContent class="bg-transparent">
          <PopoverBody class="bg-transparent">
            <MultiSelect
              options={searchResults()}
              disable={false}
              emptyRecordMsg="No records currently 📪"
              loadingMessage="Fetching organizations ⌛"
              isObject
              placeholder="Search🔍..."
              displayValue="name"
              showArrow={false}
              groupBy="group"
              onSelect={(entry) => handleSelect(entry[0])}
              onSearch={(company) => {
                getSearchInputs(company);
              }}
              selectionLimit={1}
            ></MultiSelect>
          </PopoverBody>
        </PopoverContent>
      </Popover>
      {/* <span class="w-min z-50 ">
        
      </span> */}
      {/* <span class="fixed top-20 w-min">
        <SideOrganisationFeedList />
      </span> */}
    </div>
  );
};

export default SideOrganisationFeed;

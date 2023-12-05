import { Avatar } from '@hope-ui/solid';
import { useAuthContext } from '../../../store/auth-context';
import { getDataFromLocalStorage } from '../../../utils/localStorage';

interface ProfileProps {
  removeMarginTop?: boolean;
}
//fix hardcoded margin to customisable
const Profile = (props: any) => {
  const user = getDataFromLocalStorage();
  return (
    <div
      class="flex items-center gap-2 md:items-start"
      classList={{
        'mt-6': !props.removeMarginTop,
      }}
    >
      <Avatar size="md" name={props.data?.name}></Avatar>
      <div>
        <p class=" lg:flex xl:flex 2xl:flex ">{props.data?.name}</p>
        <p class="text-primary-purple-opacity-50   lg:flex xl:flex 2xl:flex ">
          @{props.data?.profileName}
        </p>
      </div>
    </div>
  );
};

export default Profile;

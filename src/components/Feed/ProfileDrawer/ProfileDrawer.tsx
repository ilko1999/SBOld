import {
  Avatar,
  Button,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from '@hope-ui/solid';
import { useNavigate } from '@solidjs/router';
import Cookies from 'js-cookie';
import { createResource, onMount } from 'solid-js';
import toast from 'solid-toast';
import { client } from '../../../App';
import { LOGOUT } from '../../../gql/user';
import { useNotifs } from '../../../store/notification-context';
import { socket } from '../../layout/LoggedInLayout/LoggedInLayout';
import Logo from '../../UI/Logo';
import DrawerNavigationList from '../DrawerNavigation/DrawerNavigationList';
import Profile from '../Profile/Profile';
import styles from './ProfileDrawer.module.css';

const ProfileDrawer = (props) => {
  const navigate = useNavigate();
  const { notifs, setNotifs, reRefetch, setReRefetch, follows, setFollows } =
    useNotifs();

  onMount(() => {
    socket.off('user_queue');
    socket.on('user_queue', (data) => {
      toast('You`ve got a new notification. 🛎️');

      setNotifs(data);
    });
    socket.off('grant_access');

    socket.on('grant_access', (data) => {
      toast.success('You were granted access to the event. 🎉');
      setReRefetch(reRefetch() + 1);
      console.log(data);
    });
    socket.off('updated_notif');

    socket.on('updated_notif', (data) => {
      setReRefetch(reRefetch() + 1);
      setNotifs(data);
      console.log(data);
    });
    socket.off('deny_access');

    socket.on('deny_access', (data) => {
      toast.error('You were denied access to the event. 🥲');
      setReRefetch(reRefetch() + 1);
      setNotifs(data);
    });
    socket.off('followers_queue');

    socket.on('followers_queue', (data) => {
      toast('You got a new follower. 🫂');
      setFollows([...follows(), data]);
    });
    socket.off('recieve_org_notifs');

    socket.on('recieve_org_notifs', (data) => {
      toast(`Org. ${data.org.name} has created a new event`);
    });
  });

  function logout() {
    const [event] = createResource(() => {
      return client
        .mutation(LOGOUT, {})
        .toPromise()
        .then(({ data: { logoutSportsBuddy } }) => {
          Cookies.remove('refresh_token', { path: '' });
          Cookies.remove('access_token', { path: '' });
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');

          socket.disconnect();

          navigate(`/`, { replace: true });
        });
    });
  }

  return (
    <div class={`fixed col-span-1 ml-6 flex flex-col `}>
      <div class="flex flex-col sm:items-start">
        <Logo size="xs" />
        <span class="group">
          <Popover triggerMode="hover" placement="right">
            <PopoverTrigger variant="subtle" colorScheme="neutral">
              <div
                class="group-hover:scale-110 transform 
                                transition duration-500"
              >
                <Profile data={props.data} />
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverHeader>Are you sure you want to Logout?</PopoverHeader>
              <PopoverBody>
                <Button onClick={() => logout()}>Logout 🙋‍♂️</Button>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </span>
        <DrawerNavigationList />
      </div>
    </div>
  );
};

export default ProfileDrawer;

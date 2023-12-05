import { A, useLocation, useNavigate } from '@solidjs/router';
import Cookies from 'js-cookie';
import { IconTypes } from 'solid-icons';
import { JSX } from 'solid-js';
import { TABS, useTab } from '../../../store/tabs-context';
import { parseJwt } from '../../../utils/authentication';

interface DrawerNavigationProps {
  icon: IconTypes | JSX.FunctionElement;
  header: string;
}

const DrawerNavigationItem = (props: DrawerNavigationProps) => {
  const Icon = props.icon as JSX.FunctionElement;
  const [authContext, { changeTab }] = useTab();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const changeTabHandler = (url: string): any => {
    navigate('/' + url, { replace: true });
    // if (url === 'profile') {
    //   const token = Cookies.get('access_token');
    //   const { payload } = parseJwt(token);
    //   navigate('/profile' + '/' + payload.sub);
    // }
  };

  return (
    <li
      onClick={() => {
        changeTabHandler(props.header.toLowerCase());
      }}
      class={`flex gap-x-8 items-center my-0 lg:mt-2 cursor-pointer group  `}
    >
      <p
        class={`text-2xl select-none ${
          pathname.includes(props.header.toLowerCase())
            ? 'text-primary-purple'
            : 'text-primary-purple-opacity-30'
        } group-hover:text-primary-purple ease-in-out  transition-all`}
      >
        <Icon />
      </p>
      <p
        class={`text-md hidden sm:hidden md:hidden lg:flex xl:flex 2xl:flex select-none ${
          pathname.includes(props.header.toLowerCase())
            ? 'text-primary-purple'
            : 'text-primary-purple-opacity-30'
        } group-hover:text-primary-purple ease-in-out transition-all`}
      >
        {props.header}
      </p>
    </li>
  );
};

export default DrawerNavigationItem;

import { AiFillHome } from 'solid-icons/ai';
import {
  FaRegularAddressCard,
  FaSolidBoxArchive,
  FaSolidBuilding,
  FaSolidPersonWalking,
} from 'solid-icons/fa';
import { IoNotificationsOutline } from 'solid-icons/io';
import { CgProfile } from 'solid-icons/cg';
import { RiSystemMoreFill } from 'solid-icons/ri';
import { IoChatbox } from 'solid-icons/io';
import { Component, JSX, JSXElement } from 'solid-js';
import { IconTypes } from 'solid-icons';
import { TABS, useTab } from '../../../store/tabs-context';

export type DrawerNavigationItem = {
  icon: Component;
  header: string;
};

export const drawerNavigationItems: DrawerNavigationItem[] = [
  {
    icon: AiFillHome,
    header: 'Feed',
  },
  {
    icon: IoNotificationsOutline,
    header: 'Notifications',
  },
  {
    icon: FaSolidBoxArchive,
    header: 'Events',
  },
  {
    icon: FaRegularAddressCard,
    header: 'Profile',
  },
];

export const drawerNavigationItemsOrg: DrawerNavigationItem[] = [
  {
    icon: AiFillHome,
    header: 'Feed',
  },
  {
    icon: IoNotificationsOutline,
    header: 'Notifications',
  },
  {
    icon: FaRegularAddressCard,
    header: 'Profile',
  },
  {
    icon: FaSolidBoxArchive,
    header: 'Events',
  },
  {
    icon: FaSolidBuilding,
    header: 'Organization',
  },
];

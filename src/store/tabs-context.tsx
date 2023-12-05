import {
  createSignal,
  createContext,
  useContext,
  JSX,
  JSXElement,
  Setter,
  Accessor,
  ParentComponent,
} from 'solid-js';
import { createStore } from 'solid-js/store';

export enum TABS {
  FEED = 'feed',
  EXPLORE = 'explore',
  NOTIFICATIONS = 'notifications',
  PROFILE = 'profile',
  MORE = 'more',
  CHATS = 'chats',
  USER = 'user',
  ORG = 'org',
  EVENT = 'ev',
  ORGANIZATION = 'organization',
}

interface TabsProviderProps {
  children: JSXElement;
}

// export type Tab = Accessor<TABS>;

type TabSwitcher = {
  selectedTab: TABS;
  changeTab: (tab: TABS) => void;
};

export interface TabsState {
  selectedTab: TABS;
}

export interface TabsActions {
  changeTab: (tab: TABS) => void;
}

const initialTabData: TabSwitcher = {
  selectedTab: TABS.HOME,
  changeTab: (tab: TABS) => {},
};

export type TabsContextValue = [state: TabsState, actions: TabsActions];

const TabsContext = createContext<TabsContextValue>([
  initialTabData,
  {
    changeTab: (tab: TABS) => {},
  },
]);

const TabProvider = (props: TabsProviderProps) => {
  const [tabsContext, setTabsContext] = createStore(initialTabData);

  const changeTab = (tab: TABS) => {
    setTabsContext('selectedTab', tab);
  };

  return (
    <TabsContext.Provider value={[tabsContext, { changeTab }]}>
      {props.children}
    </TabsContext.Provider>
  );
};

export const useTab = () => useContext(TabsContext);
export default TabProvider;

import {
  createSignal,
  createContext,
  useContext,
  Accessor,
  Setter,
} from 'solid-js';
import { EventType, UserType } from '../constants/global';

const NotifContext = createContext();

export function NotificationProvider(props: any) {
  const [notifs, setNotifs] = createSignal([]);
  const [follows, setFollows] = createSignal([]);
  const [reRefetch, setReRefetch] = createSignal(0);

  return (
    <NotifContext.Provider
      value={{
        notifs,
        setNotifs,
        reRefetch,
        setReRefetch,
        follows,
        setFollows,
      }}
    >
      {props.children}
    </NotifContext.Provider>
  );
}

export function useNotifs() {
  return useContext(NotifContext);
}

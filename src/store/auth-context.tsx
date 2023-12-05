import { createStore } from 'solid-js/store';
import { createContext, ParentComponent, useContext } from 'solid-js';
import {
  getDataFromLocalStorage,
  removeFromLocalStorage,
} from '../utils/localStorage';

type PasswordData = {
  password: string;
  rePassword: string;
};

interface AuthStateActions {
  login: () => void;
  logout: () => void;
  setUserPlan: (isOrganization: boolean) => void;
  setUserData: (data: UserData) => void;
  setPassword: (data: PasswordData) => void;
  setTokens: (tokens: AuthToken) => void;
  setRefreshFailed: (data: boolean) => void;
}

type AuthToken = { access_token: string; refresh_token: string };

export interface AuthState {
  readonly email: string;
  readonly name: string;
  readonly profileName: string;
  readonly password: string;
  readonly rePassword: string;
  readonly authTokens: AuthToken;
  readonly isOrganization: boolean;
  readonly isAuthenticated: boolean;
  readonly refreshFailed: boolean;
  readonly organization?: string;
  readonly bio?: string;
}

export type AuthContextValue = [state: AuthState, actions: AuthStateActions];

export type UserData = Omit<
  AuthState,
  | 'isOrganization'
  | 'isAuthenticated'
  | 'organization'
  | 'bio'
  | 'password'
  | 'rePassword'
  | 'authTokens'
  | 'refreshFailed'
>;

const defaultAuthContext: AuthState = {
  email: '',
  name: '',
  profileName: '',
  password: '',
  rePassword: '',
  authTokens: { refresh_token: '', access_token: '' },
  isOrganization: false,
  isAuthenticated: false,
  refreshFailed: false,
};

const AuthContext = createContext<AuthContextValue>([
  defaultAuthContext,
  {
    login: () => {},
    logout: () => {},
    setUserPlan: (isOrganization: boolean) => {},
    setUserData: (data: UserData) => {},
    setPassword: (data: PasswordData) => {},
    setTokens: (tokens: AuthToken) => {},
    setRefreshFailed: (data: boolean) => {},
  },
]);

const AuthProvider: ParentComponent = (props) => {
  const [authContext, setAuthContext] = createStore(defaultAuthContext);
  const login = () => {
    setAuthContext('isAuthenticated', true);
  };

  const setRefreshFailed = (data: boolean) => {
    setAuthContext('refreshFailed', data);
  };

  const logout = () => {
    setAuthContext('isAuthenticated', false);
    removeFromLocalStorage();
  };

  const setUserPlan = (isOrganization: boolean) => {
    setAuthContext('isOrganization', isOrganization);
  };

  const setUserData = (userData: UserData) => {
    const { email, name, profileName } = userData;
    setAuthContext('name', name);
    setAuthContext('profileName', profileName);
    setAuthContext('email', email);
  };

  const setPassword = (data: PasswordData) => {
    const { password, rePassword } = data;
    setAuthContext('password', password);
    setAuthContext('rePassword', rePassword);
  };

  const setTokens = (tokens: AuthToken) => {
    const { access_token, refresh_token } = tokens;
    console.log(tokens);
    setAuthContext('authTokens', { access_token, refresh_token });
  };

  return (
    <AuthContext.Provider
      value={[
        authContext,
        {
          login,
          logout,
          setUserPlan,
          setUserData,
          setPassword,
          setTokens,
          setRefreshFailed,
        },
      ]}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
export default AuthProvider;

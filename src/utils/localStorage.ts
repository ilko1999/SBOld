import Cookies from 'js-cookie';
import { UserData } from '../store/auth-context';
import { createResource } from 'solid-js';
import { client } from '../App';
import { GET_SPORTSBUDDY } from '../gql/user';

const saveDataToLocalStorage = (data: UserData) => {
  localStorage.setItem('userData', JSON.stringify(data));
};

const getDataFromLocalStorage = () => {
  const [sportsBuddy, { refetch }] = createResource(() => {
    return client
      .query(GET_SPORTSBUDDY, {})
      .toPromise()
      .then(({ data: { sportbuddy } }) => sportbuddy);
  });
  return sportsBuddy;
};

const removeFromLocalStorage = () => {
  localStorage.removeItem('userData');
  Cookies.remove('access_token', { path: '' });
  console.log('removed');
  Cookies.remove('refresh_token', { path: '' });
};

export {
  saveDataToLocalStorage,
  getDataFromLocalStorage,
  removeFromLocalStorage,
};

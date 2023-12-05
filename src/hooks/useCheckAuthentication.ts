import { useNavigate } from '@solidjs/router';
import { createEffect, createResource } from 'solid-js';
import { ENDPOINTS } from '../constants/global';
import { getDataFromLocalStorage } from '../utils/localStorage';
import { client } from '../App';
import { GET_SPORTSBUDDY } from '../gql/user';

const useCheckAuthentication = () => {
  const [sportsBuddy, { refetch }] = createResource(() => {
    return client
      .query(GET_SPORTSBUDDY, {})
      .toPromise()
      .then(({ data: { sportbuddy } }) => sportbuddy);
  });
  const navigate = useNavigate();
  createEffect(() => {
    if (!sportsBuddy) {
      navigate(ENDPOINTS.HOME);
    }
  });
};
export default useCheckAuthentication;

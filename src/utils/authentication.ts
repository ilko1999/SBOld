import Cookies from 'js-cookie';
import { createClient } from 'solid-urql';
import { client } from '../App';
import { BASE_URL } from '../constants/global';
import { GET_NEW_RT_ANT_AT } from '../gql/user';
import { useAuthContext } from '../store/auth-context';

const [authContext, { setTokens }] = useAuthContext();

async function reinitializeUser() {
  console.log('here');
  const {
    data: {
      rtSportsBuddy: { refresh_token, acces_token },
    },
  } = await client.mutation(GET_NEW_RT_ANT_AT, {}).toPromise();
  Cookies.remove('refresh_token', { path: '' });
  Cookies.set('refresh_token', refresh_token);
  Cookies.set('access_token', acces_token);

  return [
    createClient({
      url: BASE_URL + '/graphql',
      fetchOptions: () => {
        console.log(refresh_token);
        return {
          headers: {
            Authorization: `Bearer ${
              acces_token ? acces_token : refresh_token ? refresh_token : ''
            }`,
          },
        };
      },
    }),
    refresh_token,
    acces_token,
  ];
}
function parseJwt(t: any) {
  let token: any = {};
  console.log(Object.keys(token).length);
  if (Object.keys(token).length > 0) {
    token.raw = t;
    token.header = JSON.parse(window.atob(t.split('.')[0]));
    token.payload = JSON.parse(window.atob(t.split('.')[1]));
    return token;
  }
  return null;
}

export { reinitializeUser, parseJwt };

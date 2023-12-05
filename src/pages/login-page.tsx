import { AuthState, useAuthContext } from '../store/auth-context';
import { client } from '../App';
import { ENDPOINTS } from '../constants/global';
import { GET_USER_LOGIN_DATA } from '../gql/user';
import { saveDataToLocalStorage } from '../utils/localStorage';

import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
} from '@hope-ui/solid';
import { useNavigate } from '@solidjs/router';
import { createSignal } from 'solid-js';
import toast from 'solid-toast';

import Cookies from 'js-cookie';
import { socket } from '../components/layout/LoggedInLayout/LoggedInLayout';
export interface LoginSportsBuddyInput {
  email: string;
  password: string;
}

const LoginPage = () => {
  const [authContext, { login, setTokens, setUserData, setPassword }] =
    useAuthContext();
  const navigate = useNavigate();
  const [formEmail, setFormEmail] = createSignal('');
  const [formPassword, setFormPassword] = createSignal('');
  let invalidInfo = true;

  const handleInput = () => (event: Event) => {
    const inputElement = event.currentTarget as HTMLInputElement;
    if (inputElement.id == 'email') {
      setFormEmail(inputElement.value);
    }

    if (inputElement.id == 'password') {
      setFormPassword(inputElement.value);
    }
  };

  const validateField = () => {
    if (formPassword() == '') {
      toast.error('Please enter a password!');
    }
    if (formEmail() == '') {
      toast.error('Please enter a valid email!');
    }
    if (!(formEmail() == '') && !(formPassword() == '')) {
      invalidInfo = false;
    } else {
      invalidInfo = true;
    }
  };

  const submited = (e: any) => {
    e.preventDefault();
    validateField();
    console.log(invalidInfo);

    if (invalidInfo) {
      setFormEmail('');
      setFormPassword('');
      return;
    } else {
      const email = formEmail();
      const name = formEmail();
      const profileName = '';
      setUserData({ email, name, profileName });

      const password = formPassword();
      const rePassword = '';
      setPassword({ password, rePassword });

      console.log(authContext);
      addUser(authContext);
    }
  };

  const addUser = async (user: AuthState) => {
    const { email, password, name, profileName } = user;
    const loginSportsBuddyPayload = { email, password };
    try {
      const {
        data: {
          //do we need more data?
          loginSportsBuddy: { refresh_token, acces_token },
        },
      } = await client
        .mutation(GET_USER_LOGIN_DATA, {
          loginSportsBuddyInput: loginSportsBuddyPayload,
        })
        .toPromise();
      login();

      saveDataToLocalStorage({ email, name, profileName });
      setTokens({ refresh_token: refresh_token, access_token: acces_token });
      Cookies.set('refresh_token', refresh_token);
      Cookies.set('access_token', acces_token);
      toast.success('Successfully Logged In!');
      navigate(ENDPOINTS.FEED);
      socket.connect();
    } catch (err) {
      console.log(err);
      toast.error('Email and password combination did not match! Try again!');
    }
  };

  return (
    <>
      <Center h={'$sm'} mt="$10">
        <Box
          h={'inherit'}
          display={'flex'}
          justifyContent={'center'}
          borderRadius={'$3xl'}
        >
          <Box
            h={'$sm'}
            as="form"
            display="flex"
            flexDirection="column"
            justifyContent={'space-between'}
            alignItems={'center'}
            onSubmit={submited}
          >
            <Center mt={'$7'} fontSize={'$2xl'}>
              {' '}
              Login{' '}
            </Center>
            <FormControl p={'$4'} pb={'0'} w={'$lg'}>
              <FormLabel>Email address</FormLabel>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={formEmail() || authContext.email}
                onInput={handleInput()}
              />
            </FormControl>
            <FormControl p={'$4'} w={'$lg'}>
              <FormLabel>Password</FormLabel>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={formPassword() || authContext.password}
                onInput={handleInput()}
              />
            </FormControl>
            {/* forgot password option */}
            <FormControl w={'$lg'}>
              <Center>
                <Button
                  w={'$36'}
                  colorScheme={'primary'}
                  mb={'$10'}
                  size={'md'}
                  type="submit"
                >
                  {' '}
                  Login{' '}
                </Button>
              </Center>
            </FormControl>
            {/* login with google */}
          </Box>
        </Box>
      </Center>
    </>
  );
};

export default LoginPage;

import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightAddon,
  Tooltip,
  VStack,
} from '@hope-ui/solid';
import Logo from '../components/UI/Logo';
import { createForm } from '@felte/solid';
import { validator } from '@felte/validator-yup';
import { InferType, boolean, object, ref, string } from 'yup';
import Card from '../components/Home/Card/Card';
import { createSignal } from 'solid-js';
import { client } from '../App';
import { CREATE_SPORTBUDDY_USER } from '../gql/user';
import Cookies from 'js-cookie';
import toast from 'solid-toast';
import { STEP_NUMBER } from '../components/RegisterForm/registerFormTypes';
import { socket } from '../components/layout/LoggedInLayout/LoggedInLayout';
import { ENDPOINTS } from '../constants/global';
import { saveDataToLocalStorage } from '../utils/localStorage';
import { useAuthContext } from '../store/auth-context';
import { useNavigate } from '@solidjs/router';

const schema = object({
  email: string().email().required('Please fill out this field.'),
  profileName: string().required('Please fill out this field.'),
  name: string().required('Please fill out this field.'),
  password: string().required('Password is required'),
  confirmPassword: string().oneOf(
    [ref('password'), null],
    'Passwords must match'
  ),
  isOrg: boolean(),
});

const RegisterPage = () => {
  let initialValues = {
    isOrg: false,
  };

  const [authContext, { login, setTokens }] = useAuthContext();
  const navigate = useNavigate();

  const [isSelected, setIsSelected] = createSignal(false);
  const [showPass, setShowPass] = createSignal(false);
  const [showPass2, setShowPass2] = createSignal(false);

  const { form, errors, data, isValid, setFields } = createForm<
    InferType<typeof schema>
  >({
    extend: validator({ schema }),
    initialValues,
    onSubmit: async (values) => {
      const clonedVals = (({ confirmPassword, ...rest }) => rest)(values);
      const {
        data: {
          createSportbuddy: { refresh_token, acces_token },
        },
      } = await client
        .mutation(CREATE_SPORTBUDDY_USER, {
          createSportbuddyInput: clonedVals,
        })
        .toPromise();
      Cookies.set('refresh_token', refresh_token);
      Cookies.set('access_token', acces_token);
      login();
      setTokens({ refresh_token, access_token: acces_token });
      toast.success('Successfully registered');
      navigate(ENDPOINTS.FEED);
      socket.connect();
    },
  });

  return (
    <div class="w-full h-screen pattern-dots pattern-orange-100 pattern-bg-white pattern-opacity-100 pattern-size-8">
      <div class="flex items-center justify-center">
        <div class="w-full py-8">
          <div class="flex items-center justify-center flex-col space-x-2">
            <a href="#">
              <Logo />
            </a>
          </div>

          <div
            class=" bg-purple-100 rounded-lg bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border border-gray-100
            w-5/6 md:w-3/4 lg:w-2/3 xl:w-[550px] 2xl:w-[550px] mt-8 mx-auto px-6 py-8 shadow-2xl "
          >
            <VStack
              as="form"
              ref={form}
              spacing="$5"
              alignItems="stretch"
              mx="auto"
            >
              <FormControl required invalid={!!errors('name')}>
                <FormLabel>Name</FormLabel>
                <Tooltip
                  placement="bottom-start"
                  opened={!!errors('name')}
                  label={errors('name')[0]}
                >
                  <Input
                    autocomplete="off"
                    type="text"
                    name="name"
                    placeholder="Name"
                  />
                </Tooltip>
              </FormControl>
              <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-5">
                <FormControl required invalid={!!errors('email')}>
                  <FormLabel>Email</FormLabel>
                  <Tooltip
                    placement="bottom-start"
                    opened={!!errors('email')}
                    label={errors('email')[0]}
                  >
                    <Input
                      type="email"
                      autocomplete="off"
                      name="email"
                      placeholder="E-mail address"
                    />
                  </Tooltip>
                </FormControl>
                <FormControl required invalid={!!errors('profileName')}>
                  <FormLabel>Profile Name</FormLabel>
                  <Tooltip
                    placement="bottom-start"
                    opened={!!errors('profileName')}
                    label={errors('profileName')[0]}
                  >
                    <Input
                      type="text"
                      autocomplete="off"
                      name="profileName"
                      placeholder="@ProfileName"
                    />
                  </Tooltip>
                </FormControl>
              </div>

              <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-5">
                <FormControl required invalid={!!errors('password')}>
                  <FormLabel>Password</FormLabel>
                  <Tooltip
                    placement="bottom-start"
                    opened={!!errors('password')}
                    label={errors('password')[0]}
                  >
                    <InputGroup size="md">
                      <Input
                        type={showPass() ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                      />
                      <InputRightAddon
                        onClick={() => setShowPass(!showPass())}
                        class="cursor-pointer select-none"
                      >
                        {showPass() ? '📖' : '📘'}
                      </InputRightAddon>
                    </InputGroup>
                  </Tooltip>
                </FormControl>
                <FormControl required invalid={!!errors('confirmPassword')}>
                  <FormLabel>Confirm Password</FormLabel>
                  <Tooltip
                    placement="bottom-start"
                    opened={!!errors('confirmPassword')}
                    label={errors('confirmPassword')[0]}
                  >
                    <InputGroup size="md">
                      <Input
                        type={showPass2() ? 'text' : 'password'}
                        name="confirmPassword"
                        placeholder="Password"
                      />
                      <InputRightAddon
                        onClick={() => setShowPass2(!showPass2())}
                        class="cursor-pointer select-none"
                      >
                        {showPass2() ? '📖' : '📘'}
                      </InputRightAddon>
                    </InputGroup>
                  </Tooltip>
                </FormControl>
              </div>

              <FormControl>
                <FormLabel>Profile Type</FormLabel>

                <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-5">
                  <span
                    onClick={() => {
                      data().isOrg = false;
                      setIsSelected(false);
                    }}
                  >
                    <Card
                      vibrantBackground={!isSelected()}
                      hasPopup={true}
                      isSelected={!isSelected()}
                      isCheckbox={true}
                      title="User Plan 👤"
                    >
                      <p class="text-gray-700 text-base">Plan fit for users.</p>
                    </Card>
                  </span>
                  <span
                    onClick={() => {
                      data().isOrg = true;
                      setIsSelected(true);
                    }}
                  >
                    <Card
                      vibrantBackground={isSelected()}
                      hasPopup={true}
                      isSelected={isSelected()}
                      isCheckbox={true}
                      title="Org. Plan 👥"
                    >
                      <p class="text-gray-700 text-base select-none">
                        Plan fit for orgs.
                      </p>
                    </Card>
                  </span>
                </div>
              </FormControl>

              <HStack justifyContent="flex-end">
                <Button type="submit" disabled={!isValid()}>
                  Submit
                </Button>
              </HStack>
            </VStack>
            <div class=" mt-5 text-center">
              <h1 class="font-Lexend text-sm text-primary-purple">
                Already have an account
                <span
                  onClick={() => navigate(ENDPOINTS.LOGIN)}
                  class="text-primary-orange opacity-100 tracking-wide hover:underline cursor-pointer"
                >
                  &nbsp;Log In
                </span>
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

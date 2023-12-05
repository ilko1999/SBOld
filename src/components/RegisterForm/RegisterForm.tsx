import { Match, Switch } from 'solid-js';
import { Step, useStepper } from '../../store/stepper-context';
import FirstStepRegisterForm from './FirstStepRegisterForm';
import SecondStepRegisterForm from './SecondStepRegisterForm';
import ThirdStepRegisterForm from './ThirdStepRegisterForm';
import { STEP_NUMBER } from './registerFormTypes';
import { AuthState, useAuthContext } from '../../store/auth-context';
import { client } from '../../App';
import { CREATE_SPORTBUDDY_USER } from '../../gql/user';
import { useNavigate } from '@solidjs/router';
import { ENDPOINTS } from '../../constants/global';
import { saveDataToLocalStorage } from '../../utils/localStorage';
import toast from 'solid-toast';
import Cookies from 'js-cookie';
import { socket } from '../layout/LoggedInLayout/LoggedInLayout';

export interface CreateSportbuddyInput {
  email: string;
  password: string;
  name: string;
  profileName: string;
  userPhoto?: string;
}

interface RegisterFormProps {
  step: Step;
  changeStep: (step: STEP_NUMBER) => void;
  createStepForward: () => void;
  createStepBack: () => void;
}

const RegisterForm = (props: RegisterFormProps) => {
  const [authContext, { login, setTokens }] = useAuthContext();
  const navigate = useNavigate();
  const addUser = async (user: AuthState) => {
    const { email, name, password, profileName } = user;
    const createSportBuddyPayload = {
      isOrg: authContext.isOrganization,
      email,
      name,
      password,
      profileName,
    };
    if (!email || !name || !password || !profileName) {
      toast.error('Please fill all the required information');
      return;
    }
    try {
      const {
        data: {
          createSportbuddy: { refresh_token, acces_token },
        },
      } = await client
        .mutation(CREATE_SPORTBUDDY_USER, {
          createSportbuddyInput: createSportBuddyPayload,
        })
        .toPromise();
      Cookies.set('refresh_token', refresh_token);
      Cookies.set('access_token', acces_token);
      login();
      setTokens({ refresh_token, access_token: acces_token });
      saveDataToLocalStorage({ email, name, profileName });
      toast.success('Successfully registered');
      props.changeStep(STEP_NUMBER.FIRST);
      navigate(ENDPOINTS.FEED);
      socket.connect();
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    addUser(authContext);
  };
  return (
    <form onSubmit={handleSubmit} class="flex mt-20 z-10">
      {/* <Switch
        fallback={
          <FirstStepRegisterForm createStepForward={props.createStepForward} />
        }
      >
        <Match when={props.step() === STEP_NUMBER.SECOND}>
          <SecondStepRegisterForm createStepForward={props.createStepForward} />
        </Match>
        <Match when={props.step() === STEP_NUMBER.THIRD}>
          <ThirdStepRegisterForm createStepBack={props.createStepBack} />
        </Match>
      </Switch> */}
    </form>
  );
};

export default RegisterForm;

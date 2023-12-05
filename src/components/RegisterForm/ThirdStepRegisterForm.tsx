import { FaSolidArrowRight } from 'solid-icons/fa';
import { AiFillCheckCircle } from 'solid-icons/ai';
import { VsCircleLargeFilled } from 'solid-icons/vs';
import { createSignal } from 'solid-js';

import { RegisterStepFormProps, USER_PLAN } from './registerFormTypes';
import CustomButton from '../UI/CustomButton';
import useForm from '../../hooks/useForm';
import Input from '../UI/Input';
import { useAuthContext } from '../../store/auth-context';
import { Center } from '@hope-ui/solid';

const ThirdStepRegisterForm = (props: RegisterStepFormProps) => {
  const [authContext, { setUserPlan }] = useAuthContext();
  console.log(authContext.isOrganization);

  const [checked, setChecked] = createSignal(
    {
      organizationInputChecked: false,
      individualInputChecked: true,
    },
    { equals: false }
  );

  const changeHandler = (type: USER_PLAN) => {
    switch (type) {
      case USER_PLAN.ORGANIZATION:
        setUserPlan(true);
        setChecked((current) => {
          current.organizationInputChecked = !current.organizationInputChecked;
          current.individualInputChecked = !current.individualInputChecked;
          return current;
        });
        break;
      case USER_PLAN.INDIVIDUAL:
        setUserPlan(false);
        setChecked((current) => {
          current.individualInputChecked = !current.individualInputChecked;
          current.organizationInputChecked = !current.organizationInputChecked;
          return current;
        });
        break;
      default:
        return authContext.isOrganization
          ? USER_PLAN.ORGANIZATION
          : USER_PLAN.INDIVIDUAL;
    }
  };
  return (
    <div class="flex flex-col items-center">
      <h1 class="text-3xl border-primary-orange border-b-2 text-primary-purple pb-1 self-start mb-12">
        Choose your user plan
      </h1>
      <fieldset class="flex flex-col gap-8">
        <article
          class="relative py-4 px-2 flex items-center border rounded-2xl"
          classList={{
            'border-primary-orange bg-primary-orange-opacity-20':
              checked().organizationInputChecked,
            'bg-primary-gray-opacity-50 border-primary-gray-opacity-80':
              checked().individualInputChecked,
          }}
        >
          {checked().organizationInputChecked ? (
            <AiFillCheckCircle fill="#FF570A" size="45" />
          ) : (
            <VsCircleLargeFilled fill="#FF570A" size="45" />
          )}
          <Input
            class="opacity-0 left-2 w-11 h-11 cursor-pointer absolute top-8"
            onChange={() => changeHandler(USER_PLAN.ORGANIZATION)}
            type="radio"
            id="Organisation"
            value="Organisation"
            checked={checked().organizationInputChecked}
          />
          <div class="ml-6">
            <label for="Organisation" class="text-2xl text-primary-purple">
              Organisation Plan
            </label>
            <p>
              this is a plan that suits organisations that would want to create
              events and be the center of major sports happenings
            </p>
          </div>
        </article>
        <article
          class="relative py-4 px-2 flex items-center border rounded-2xl"
          classList={{
            'border-primary-orange bg-primary-orange-opacity-20':
              checked().individualInputChecked,
            'bg-primary-gray-opacity-50 border-primary-gray-opacity-80':
              checked().organizationInputChecked,
          }}
        >
          {checked().individualInputChecked ? (
            <AiFillCheckCircle fill="#FF570A" size="45" />
          ) : (
            <VsCircleLargeFilled fill="#FF570A" size="45" />
          )}
          <Input
            class="opacity-0 left-2 w-11 h-11 cursor-pointer absolute top-8"
            type="radio"
            id="Individual"
            value="Individual"
            onChange={() => changeHandler(USER_PLAN.INDIVIDUAL)}
            checked={checked().individualInputChecked}
          />
          <div class="ml-6">
            <label class="text-2xl text-primary-purple" for="Individual">
              Individual Plan
            </label>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Voluptates neque soluta tempore.
            </p>
          </div>
        </article>
      </fieldset>
      <Center>
        <CustomButton variant="primary">
          Send
          <FaSolidArrowRight class="ml-2" />
        </CustomButton>
      </Center>
    </div>
  );
};

export default ThirdStepRegisterForm;

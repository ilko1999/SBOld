import { FirstAndSecondStepRegisterFormProps } from './registerFormTypes';
import { FaSolidArrowRight } from 'solid-icons/fa';

import CustomButton from '../UI/CustomButton';
import { useAuthContext } from '../../store/auth-context';
import useForm from '../../hooks/useForm';
import { isValidEmail } from '../../utils/validations';
import toast from 'solid-toast';
import { Center, Input } from '@hope-ui/solid';

const FirstStepRegisterForm = (props: FirstAndSecondStepRegisterFormProps) => {
  const [authContext, { setUserData }] = useAuthContext();
  const { form, updateFormField } = useForm();
  const onStepChange = () => {
    const { name, profileName, email } = form;
    const emailIsValid = isValidEmail(email) || isValidEmail(authContext.email);
    if (!emailIsValid) {
      toast.error('Invalid email');
      return;
    }
    setUserData({ name, profileName, email });
    props.createStepForward();
  };

  return (
    <section class="flex flex-col items-center w-full">
      <h1 class="text-3xl border-primary-orange border-b-2 text-primary-purple pb-1 self-start mb-12">
        Fill in your basic account information
      </h1>
      <article class="flex flex-col w-3/4 gap-6">
        <Input
          value={form.name || authContext.name}
          onChange={updateFormField('name')}
          type="text"
          id="name"
          placeholder="Name"
        />
        <Input
          value={form.profileName || authContext.profileName}
          onChange={updateFormField('profileName')}
          type="text"
          id="profileName"
          placeholder="Profile Name"
        />
        <Input
          value={form.email || authContext.email}
          onChange={updateFormField('email')}
          type="email"
          id="email"
          placeholder="Email"
        />
      </article>
      <Center>
        <CustomButton type="button" variant="primary" onClick={onStepChange}>
          Proceed
          <FaSolidArrowRight class="ml-2" />
        </CustomButton>
      </Center>
    </section>
  );
};

export default FirstStepRegisterForm;

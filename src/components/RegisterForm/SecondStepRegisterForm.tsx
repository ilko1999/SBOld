import { FaSolidArrowRight } from 'solid-icons/fa';

import {
  FirstAndSecondStepRegisterFormProps,
  RegisterStepFormProps,
} from './registerFormTypes';
import CustomButton from '../UI/CustomButton';
import useForm from '../../hooks/useForm';
import { useAuthContext } from '../../store/auth-context';
import toast from 'solid-toast';
import { Center, Input } from '@hope-ui/solid';

const SecondStepRegisterForm = (props: FirstAndSecondStepRegisterFormProps) => {
  const { form, updateFormField } = useForm();
  const [authContext, { setPassword }] = useAuthContext();

  const onStepChange = () => {
    const { password, rePassword } = form;
    if (password !== rePassword) {
      toast.error('Your passwords missmatch');
      return;
    }
    setPassword({ password, rePassword });
    props.createStepForward();
  };

  return (
    <section class="flex flex-col items-center w-full">
      <h1 class="text-3xl border-primary-orange border-b-2 text-primary-purple pb-1 self-start mb-12">
        Input your Password
      </h1>
      <article class="flex w-3/4  flex-col gap-6">
        {/* CREATE COMPONENT FOR INPUT */}
        <Input
          type="password"
          onChange={updateFormField('password')}
          id="password"
          placeholder="Password"
          value={form.password || authContext.password}
        />
        <Input
          type="password"
          onChange={updateFormField('rePassword')}
          id="rePassword"
          placeholder="Repeat password"
          value={form.rePassword || authContext.rePassword}
        />
      </article>
      <Center>
        <CustomButton variant="primary" onClick={onStepChange}>
          Proceed
          <FaSolidArrowRight class="ml-2" />
        </CustomButton>
      </Center>
    </section>
  );
};

export default SecondStepRegisterForm;

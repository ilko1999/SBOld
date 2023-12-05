import axios, { AxiosResponse } from 'axios';
import { createStore } from 'solid-js/store';
import { AuthState } from '../store/auth-context';

type FormFields = {
  name: string;
  profileName: string;
  email: string;
  password: string;
  rePassword: string;
  isOrganization: boolean;
};

const useForm = () => {
  const [form, setForm] = createStore<FormFields>({
    name: '',
    profileName: '',
    email: '',
    password: '',
    rePassword: '',
    isOrganization: false,
  });

  const clearField = (fieldName: string) => {
    setForm({
      [fieldName]: '',
    });
  };

  const updateFormField = (fieldName: string) => (event: Event) => {
    const inputElement = event.currentTarget as HTMLInputElement;
    if (inputElement.type === 'radio') {
      setForm({
        [fieldName]: !!inputElement.checked,
      });
    } else {
      setForm({
        [fieldName]: inputElement.value,
      });
    }
  };

  return { form, updateFormField, clearField };
};

export default useForm;

import { createForm } from '@felte/solid';
import { validator } from '@felte/validator-yup';
import {
  Avatar,
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Image,
  Input,
  Radio,
  RadioGroup,
  SimpleOption,
  SimpleSelect,
  Textarea,
  VStack,
} from '@hope-ui/solid';
import { createResource, createSignal, For, Show } from 'solid-js';
import type { InferType } from 'yup';
import { boolean, mixed, object, string } from 'yup';
import { client } from '../../App';
import { CREATE_CLUB } from '../../gql/clubs';
import { useNotifs } from '../../store/notification-context';

const schema = object({
  clubCoverPhoto: string().default(''),
  name: string().required('Group Name is required.'),
  desc: string().max(180).required('Group Description is required.'),
});

export function CreateGroup() {
  const { reRefetch, setReRefetch } = useNotifs();
  const { form, errors, data, isValid, setFields } = createForm<
    InferType<typeof schema>
  >({
    extend: validator({ schema }),
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const [groupPhoto, setGroupPhoto] = createSignal(null);

  function toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }

  function handleCreateGroup() {
    const [club] = createResource(() => {
      return client
        .mutation(CREATE_CLUB, { createClubInput: data() })
        .toPromise()
        .then(({ data: { createClub } }) => setReRefetch(reRefetch() + 1));
    });
  }

  return (
    <VStack
      as="form"
      ref={form}
      spacing="$5"
      alignItems="stretch"
      width={'$full'}
      mx="auto"
      p={'$10'}
    >
      <div class="overflow-hidden relative  w-46 left-1/3">
        <label class="overflow-hidden relative w-46 cursor-pointer">
          <Show
            when={groupPhoto()}
            fallback={
              <Avatar name={data().name} src="broken-link" size={'2xl'} />
            }
          >
            <Avatar src={groupPhoto()} size={'2xl'} />
          </Show>
          <Input
            onChange={(e) => {
              setGroupPhoto(URL.createObjectURL(e.target.files[0]));
              toDataURL(
                URL.createObjectURL(e.target.files[0]),
                function (dataUrl) {
                  data().clubCoverPhoto = dataUrl;
                }
              );
            }}
            class="absolute block opacity-0 py-2 px-4 w-full pin-r pin-t"
            type="file"
            accept="image/*"
          ></Input>
        </label>
      </div>
      <FormControl required invalid={!!errors('name')}>
        <FormLabel>Group Name</FormLabel>
        <Input type="name" name="name" placeholder="Group Name" />
        <FormErrorMessage>{errors('name')[0]}</FormErrorMessage>
      </FormControl>

      <FormControl invalid={!!errors('desc ')}>
        <FormLabel>Bio</FormLabel>
        <Textarea name="desc" placeholder="Tell us something about yourself" />
        <Show
          when={errors('desc ')}
          fallback={
            <FormHelperText w="$full" textAlign="end">
              {data('desc ')?.length ?? 0}/30
            </FormHelperText>
          }
        >
          <FormErrorMessage>{errors('desc ')[0]}</FormErrorMessage>
        </Show>
      </FormControl>

      <Button
        class=""
        borderRadius={'$xl'}
        backgroundColor={'#FF570A'}
        color={'# D9D9D973'}
        _hover={{
          backgroundColor: '#FF570A80',
        }}
        onClick={(e) => {
          handleCreateGroup();
          e.stopPropagation();
        }}
      >
        Create Group
      </Button>
    </VStack>
  );
}

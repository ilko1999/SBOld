import { Component } from 'solid-js';

const NewUserRegister: Component<{}> = (props) => {
  return (
    <section class="flex flex-col items-center">
      <h1 class="text-md font-bold text-stone-500 font-Work_Sans self-start">
        START FOR FREE
      </h1>
      {/* <Input
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
      </Center> */}
    </section>
  );
};

export default NewUserRegister;

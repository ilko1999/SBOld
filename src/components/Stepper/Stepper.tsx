import { useStepper } from '../../store/stepper-context';
import { STEP_NUMBER } from '../RegisterForm/registerFormTypes';
import FirstStep from './FirstStep';
import SecondStep from './SecondStep';
import { StepperComponentProps } from './stepperComponentProps';
import ThirdStep from './ThirdStep';

const Stepper = (props: StepperComponentProps) => {
  return (
    <div class="">
      <h2 class="sr-only">Steps</h2>
      <ol class="relative z-10 flex justify-between text-sm font-medium">
        <div
          classList={{
            'after:bg-primary-orange': props.step() !== STEP_NUMBER.FIRST,
            'after:bg-primary-orange-opacity-50':
              props.step() === STEP_NUMBER.FIRST,
          }}
          class="relative w-40 2xl:w-47 xl:w-46 lg:w-45 md:w-44 sm:w-45 before:absolute after:inset-x-0 after:top-1/2 after:block after:h-0.5 after:-translate-y-1/2 after:rounded-lg after:bg-primary-orange"
        >
          <FirstStep
            changeStep={props.changeStep}
            isAtCurrentStep={props.step() === STEP_NUMBER.FIRST}
          />
        </div>
        <SecondStep
          changeStep={props.changeStep}
          isAtCurrentStep={props.step() === STEP_NUMBER.SECOND}
        />
        <div
          classList={{
            'after:bg-primary-orange': props.step() === STEP_NUMBER.THIRD,
            'after:bg-primary-orange-opacity-50':
              props.step() !== STEP_NUMBER.THIRD,
          }}
          class="relative w-40 2xl:w-47 xl:w-46 lg:w-45 md:w-44 sm:w-42 before:absolute after:inset-x-0 after:top-1/2 after:block after:h-0.5 after:-translate-y-1/2 after:rounded-lg after:bg-primary-orange"
        >
          <ThirdStep
            changeStep={props.changeStep}
            isAtCurrentStep={props.step() === STEP_NUMBER.THIRD}
          />
        </div>
      </ol>
    </div>
  );
};

export default Stepper;

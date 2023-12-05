import {
  createSignal,
  createContext,
  useContext,
  JSX,
  JSXElement,
  Setter,
  Accessor,
} from "solid-js";
import { STEP_NUMBER } from "../components/RegisterForm/registerFormTypes";

//onHere : false
// past - already been there?
// validated? : false
interface StepperProviderProps {
  children: JSXElement;
  step: number;
}

export type Step = Accessor<number>;

type Stepper = {
  step: Step;
  changeStep(step: STEP_NUMBER): void;
  createStepForward(): void;
  createStepBack(): void;
};

const initialStepperData: Stepper = {
  step: () => STEP_NUMBER.FIRST,
  changeStep: (step: number) => {},
  createStepForward: () => {},
  createStepBack: () => {},
};

const StepperContext = createContext<Stepper>(initialStepperData);

export const StepperProvider = (props: StepperProviderProps) => {
  const [step, setStep] = createSignal<STEP_NUMBER>(
      props.step || STEP_NUMBER.FIRST
    ),
    stepper: Stepper = {
      step,
      changeStep(step: STEP_NUMBER) {
        setStep(step);
      },
      createStepForward() {
        setStep((prevStep) => prevStep + 1);
      },
      createStepBack() {
        setStep((prevStep) => prevStep + -1);
      },
    };

  return (
    <StepperContext.Provider value={stepper}>
      {props.children}
    </StepperContext.Provider>
  );
};

export const useStepper = () => useContext(StepperContext);

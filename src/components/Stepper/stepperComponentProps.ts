import { Accessor } from "solid-js";
import { STEP_NUMBER } from "../RegisterForm/registerFormTypes";

type STEP_CHANGE_FN = (step: STEP_NUMBER) => void;

export interface StepperComponentProps {
  step: Accessor<number>;
  changeStep: STEP_CHANGE_FN;
}

export interface StepProps {
  isAtCurrentStep: boolean;
  changeStep: STEP_CHANGE_FN;
}

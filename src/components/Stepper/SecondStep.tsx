import { createEffect, Show } from "solid-js";
import { StepProps } from "./stepperComponentProps";
import { STEP_NUMBER } from "../RegisterForm/registerFormTypes";
import { AiFillCheckCircle } from "solid-icons/ai";
import { Bs2Circle } from "solid-icons/bs";
import { useStepper } from "../../store/stepper-context";

const SecondStep = (props: StepProps) => {
  const fillCircleColor = () =>
    props.isAtCurrentStep ? "#FF570A" : "#FF570A50";
  // create state for completed/not completed step
  return (
    <li class="flex items-center p-2">
      <Show
        when={props.isAtCurrentStep} //TODO - Add if the user has already completed that step from future context to the when conditions
        fallback={
          <span class="absolute left-1/2 -top-10px -translate-x-1/2 rounded-full text-white">
            <div
              onClick={() => props.changeStep(STEP_NUMBER.SECOND)}
              class="cursor-pointer"
            >
              <p class="absolute w-24 -left-4 -top-6 text-primary-purple">
                Crucial Data
              </p>
              <Bs2Circle fill={fillCircleColor()} size="45" />
            </div>
          </span>
        }
      >
        <span class="absolute left-1/2 -top-10px -translate-x-1/2 rounded-full text-white">
          <div
            onClick={() => props.changeStep(STEP_NUMBER.SECOND)}
            class="cursor-pointer"
          >
            <p class="absolute w-24 -left-3 -top-6 text-primary-purple">
              Crucial Data
            </p>
            <AiFillCheckCircle fill={fillCircleColor()} size="50" />
          </div>
        </span>
      </Show>
    </li>
  );
};

export default SecondStep;

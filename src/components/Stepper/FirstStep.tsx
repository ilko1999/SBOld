import { AiFillCheckCircle } from "solid-icons/ai";
import { createEffect, Show } from "solid-js";
import { useStepper } from "../../store/stepper-context";
import { STEP_NUMBER } from "../RegisterForm/registerFormTypes";
import { StepProps } from "./stepperComponentProps";

const FirstStep = (props: StepProps) => {
  return (
    <li class="flex items-center p-2">
      <div
        onClick={() => props.changeStep(STEP_NUMBER.FIRST)}
        class="cursor-pointer"
      >
        <p class="absolute -left-14 -top-8 xl:-left-12 text-primary-purple">
          Personal Info
        </p>
        <span class="absolute -left-11 -top-10px rounded-full text-white">
          <AiFillCheckCircle fill="#FF570A" size="50" />
        </span>
      </div>
    </li>
  );
};

export default FirstStep;

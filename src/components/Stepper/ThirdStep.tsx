import { AiFillCheckCircle } from "solid-icons/ai";
import { VsCircleLargeFilled } from "solid-icons/vs";
import { Show } from "solid-js";
import { STEP_NUMBER } from "../RegisterForm/registerFormTypes";
import { StepProps } from "./stepperComponentProps";
import { Bs3Circle } from "solid-icons/bs";

const ThirdStep = (props: StepProps) => {
  const fillCircleColor = () =>
    props.isAtCurrentStep ? "#FF570A" : "#FF570A50";

  return (
    <li class="flex items-center p-2">
      <Show
        when={props.isAtCurrentStep}
        fallback={
          <span class="absolute -right-16 -top-10px -translate-x-1/2 rounded-full text-white">
            <div
              onClick={() => props.changeStep(STEP_NUMBER.THIRD)}
              class="cursor-pointer"
            >
              <p class="absolute w-24 -left-2 -top-6 text-primary-purple">
                User Plan
              </p>
              <Bs3Circle fill={fillCircleColor()} size="45" />
            </div>
          </span>
        }
      >
        <span class="absolute -right-16 -top-10px -translate-x-1/2 rounded-full text-white">
          <div
            onClick={() => props.changeStep(STEP_NUMBER.THIRD)}
            class="cursor-pointer"
          >
            <p class="absolute w-24 -left-2 -top-6 text-primary-purple">
              User Plan
            </p>
            <AiFillCheckCircle fill={fillCircleColor()} size="45" />
          </div>
        </span>
      </Show>
    </li>
  );
};

export default ThirdStep;

export interface RegisterStepFormProps {
  changeStep?: (step: STEP_NUMBER) => void;
  createStepForward?: () => void;
  createStepBack?: () => void;
}

export interface FirstAndSecondStepRegisterFormProps {
  createStepForward: () => void;
}

export enum STEP_NUMBER {
  "FIRST" = 1,
  "SECOND" = 2,
  "THIRD" = 3,
}

export enum USER_PLAN {
  ORGANIZATION = "organization",
  INDIVIDUAL = "individual",
}

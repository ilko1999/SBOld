import { JSX, Show } from "solid-js";

interface ToggleSwitchProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const ToggleSwitch = (props: ToggleSwitchProps) => {
  return (
    <label class="inline-flex relative items-center">
      <input type="checkbox" class="sr-only peer" />
      <div class="w-11 h-6 cursor-pointer bg-primary-purple-opacity-30 peer-checked:bg-primary-orange-opacity-50 transition-colors rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-primary-purple after:rounded-full after:h-5 after:w-5 peer-checked:after:translate-x-full after:transition-transform"></div>
      <Show when={props.label}>
        <span class="ml-3 text-sm font-medium text-gray-900">
          {props.label}
        </span>
      </Show>
    </label>
  )
}

export default ToggleSwitch;
import { JSX, Show } from "solid-js";

interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "search"
    | "tel"
    | "hidden"
    | "radio";
  label?: string;
}

const Input = (props: InputProps) => {
  return (
    <div class="flex flex-col gap-1">
      <Show when={props.label}>
        <label for={props.id} class="block text-s font-medium text-gray-700">
          {props.label}
        </label>
      </Show>
      <input
        class="text-primary-purple-opacity-80 bg-primary-purple-opacity-20 border border-primary-purple-opacity-50 rounded-lg px-2 py-1 w-full outline-none"
        {...props}
      />
    </div>
  );
};

export default Input;

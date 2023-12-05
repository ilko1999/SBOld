import { JSX } from 'solid-js';

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary' | 'secondary--purple-text';
  lessMarginTop?: boolean;
  noMarginTop?: boolean;
  displayInline?: boolean;
  small?: boolean;
}

const CustomButton = (props: ButtonProps) => {
  return (
    <button
      class={
        'rounded-2xl font-semibold py-2 px-6 m-2 flex items-center self-end mt-20'
      }
      classList={{
        ['bg-primary-orange text-white']:
          props.variant === 'primary' && !props.disabled,
        ['bg-primary-gray-opacity-45 text-primary-purple']:
          props.variant === 'secondary--purple-text',
        ['bg-primary-gray-opacity-45 text-primary-orange']:
          props.variant === 'secondary' && !props.disabled,
        ['bg-primary-orange-opacity-50 text-primary-purple-opacity-30']:
          props.disabled,
        ['mt-10']: props.lessMarginTop,
        ['mt-0']: props.noMarginTop,
        ['inline']: props.displayInline,
        ['py-1 px-3 m-0']: props.small,
      }}
      {...props}
    >
      {props.children}
    </button>
  );
};

export default CustomButton;

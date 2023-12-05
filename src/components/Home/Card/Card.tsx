import { Tag } from '@hope-ui/solid';
import { FaSolidEye } from 'solid-icons/fa';
import { JSX, Show } from 'solid-js';

interface CardProps {
  title: string;
  children?: JSX.Element;
  vibrantBackground: boolean;
  isCheckbox: boolean;
  isSelected: boolean;
  hasPopup: boolean;
}

const Card = (props: CardProps) => {
  return (
    <div
      class={`${
        props.vibrantBackground
          ? 'bg-primary-orange-opacity-10'
          : 'bg-primary-gray-opacity-40'
      } 
      ${
        props.isSelected
          ? ' bg-primary-orange-opacity-20 rounded-lg bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border border-primary-orange-opacity-50'
          : ''
      } 
      ${
        props.isCheckbox ? 'cursor-pointer' : 'cursor-help'
      } max-w-sm select-none transition-all ease-in-out hover:bg-primary-white hover:scale-105 hover:shadow-none rounded overflow-hidden shadow-lg"`}
    >
      <Show
        fallback={
          <span class="relative left-2 top-2 flex h-3 w-3">
            <span class=" absolute inline-flex h-full w-full rounded-full bg-gray-600 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-gray-600"></span>
          </span>
        }
        when={props.isCheckbox && props.isSelected}
      >
        <span class="relative left-2 top-2 flex h-3 w-3">
          <span class="absolute inline-flex h-full w-full rounded-full bg-primary-orange-opacity-50 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-primary-orange-opacity-50"></span>
        </span>
      </Show>

      <div class="px-10 py-6 select-none flex flex-col">
        <div class="font-bold text-xl mb-6 text-center select-none">
          {props.title}
        </div>
        {props.children}
      </div>
    </div>
  );
};

export default Card;

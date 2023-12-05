import { AiOutlineSearch } from "solid-icons/ai";
const SearchBox = () => {
  return (
    <div class="relative flex items-center">
      <input class="w-full relative text-primary-purple-opacity-80 bg-primary-purple-opacity-20 border border-primary-purple-opacity-50 rounded-lg px-2 py-1 outline-none" />
      <button class="absolute right-0 pr-2">
        <AiOutlineSearch size="25px" />
      </button>
    </div>
  );
};

export default SearchBox;

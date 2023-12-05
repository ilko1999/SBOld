interface DotProps {
  bgColorOpacity: string;
}

const Dot = (props: DotProps) => {
  const finalClass = `w-5 h-5 rounded-full flex bg-primary-purple-opacity-40`;
  return <span class={finalClass}></span>;
};

export default Dot;

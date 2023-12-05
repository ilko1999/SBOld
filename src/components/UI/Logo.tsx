export type LogoSizeType = 'small' | 'medium' | 'large' | 'xs';
interface LogoProps {
  size?: LogoSizeType;
}

// fix this and do it better with some util function etc...

const Logo = (props: LogoProps) => {
  const classes =
    props.size === 'medium'
      ? 'w-3/5 my-0 flex'
      : 'small'
      ? 'w-20 my-0'
      : 'xs'
      ? 'w-1/10'
      : '';
  return <img class={classes} src="../../src/assets/SB Logo.svg" />;
};

export default Logo;

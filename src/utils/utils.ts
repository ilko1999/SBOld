const truncateString = (text: string, lastIndex: number) => {
  if (text.length <= lastIndex) {
    return text;
  }
  return text.slice(0, lastIndex) + "...";
};

export { truncateString };

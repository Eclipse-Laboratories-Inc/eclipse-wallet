const clipboard = {
  copy: value => navigator.clipboard.writeText(value),
};

export default clipboard;

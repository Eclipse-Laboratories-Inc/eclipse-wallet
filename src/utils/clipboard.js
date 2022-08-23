const clipboard = {
  copy: value => navigator.clipboard.writeText(value),
  paste: () => navigator.clipboard.readText(),
};

export default clipboard;

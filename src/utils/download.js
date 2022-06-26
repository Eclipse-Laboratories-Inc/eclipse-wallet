const download = (content, filename) => {
  // eslint-disable-next-line no-undef
  const url = window.URL.createObjectURL(new Blob([content]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default download;

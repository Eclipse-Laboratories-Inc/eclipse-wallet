export const utf8 = {
  parse(text) {
    const byteString = encodeURI(text);
    const out = new Uint8Array(byteString.length);
    // Treat each character as a byte, except for %XX escape sequences:
    let di = 0; // Destination index
    for (let i = 0; i < byteString.length; ++i) {
      const c = byteString.charCodeAt(i);
      if (c === 0x25) {
        out[di++] = parseInt(byteString.slice(i + 1, i + 3), 16);
        i += 2;
      } else {
        out[di++] = c;
      }
    }
    // Trim any over-allocated space (zero-copy):
    return out.subarray(0, di);
  },

  stringify(data) {
    // Create a %XX escape sequence for each input byte:
    let byteString = '';
    for (let i = 0; i < data.length; ++i) {
      const byte = data[i];
      // eslint-disable-next-line no-bitwise
      byteString += '%' + (byte >> 4).toString(16) + (byte & 0xf).toString(16);
    }

    return decodeURIComponent(byteString);
  },
};

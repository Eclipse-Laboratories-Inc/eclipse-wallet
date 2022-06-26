import Clipboard from '@react-native-clipboard/clipboard';

const clipboard = {
  copy: value => Clipboard.setString(value),
};

export default clipboard;

import Clipboard from '@react-native-clipboard/clipboard';

const clipboard = {
  copy: value => Clipboard.setString(value),
  paste: () => Clipboard.getString(),
};

export default clipboard;

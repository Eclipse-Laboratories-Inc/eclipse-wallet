import React from 'react';
import QRCode from 'react-native-qrcode-svg';

const QRImage = ({ address }) => <QRCode value={address} />;

export default QRImage;

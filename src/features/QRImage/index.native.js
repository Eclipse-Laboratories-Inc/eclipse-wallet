import React from 'react';
import QRCode from 'react-native-qrcode-svg';

const QRImage = ({ address, size }) => <QRCode value={address} size={size} />;

export default QRImage;

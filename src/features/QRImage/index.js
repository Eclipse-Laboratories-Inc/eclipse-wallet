import React from 'react';
import QRCode from 'qrcode.react';

const QRImage = ({ address, size }) => <QRCode value={address} size={size} />;

export default QRImage;

import React from 'react';
import QRCode from 'qrcode.react';

const QRImage = ({ address }) => <QRCode value={address} />;

export default QRImage;

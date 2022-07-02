import { pbkdf2 } from 'crypto-browserify';
import { randomBytes, secretbox } from 'tweetnacl';
import bs58 from 'bs58';

const deriveEncryptionKey = async (password, salt, iterations, digest) => {
  return new Promise((resolve, reject) =>
    pbkdf2(
      password,
      salt,
      iterations,
      secretbox.keyLength,
      digest,
      (err, key) => (err ? reject(err) : resolve(key)),
    ),
  );
};
export const lock = async (unlocked, password) => {
  const salt = randomBytes(16);
  const kdf = 'pbkdf2';
  const iterations = 100000;
  const digest = 'sha256';
  const key = await deriveEncryptionKey(password, salt, iterations, digest);
  const nonce = randomBytes(secretbox.nonceLength);
  const encrypted = secretbox(
    // eslint-disable-next-line no-undef
    Buffer.from(JSON.stringify(unlocked)),
    nonce,
    key,
  );
  const locked = {
    encrypted: bs58.encode(encrypted),
    nonce: bs58.encode(nonce),
    kdf,
    salt: bs58.encode(salt),
    iterations,
    digest,
  };
  return locked;
};

export const unlock = async (locked, password) => {
  const {
    encrypted: encodedEncrypted,
    nonce: encodedNonce,
    salt: encodedSalt,
    iterations,
    digest,
  } = locked;
  const encrypted = bs58.decode(encodedEncrypted);
  const nonce = bs58.decode(encodedNonce);
  const salt = bs58.decode(encodedSalt);
  const key = await deriveEncryptionKey(password, salt, iterations, digest);
  const plaintext = secretbox.open(encrypted, nonce, key);
  if (!plaintext) {
    throw new Error('Incorrect password');
  }
  // eslint-disable-next-line no-undef
  const decodedPlaintext = Buffer.from(plaintext).toString();
  return JSON.parse(decodedPlaintext);
};

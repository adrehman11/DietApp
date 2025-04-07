const config = require("../../config");
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const AesKey = config.AES_Key_creditCard_apiSide; //should be 32 bytes; //crypto.randomBytes(32).toString('hex').slice(0, 32))
const AesIV = config.AES_iv_creditCard_apiSide; //should be 16 bytes; //crypto.randomBytes(16).toString('hex').slice(0, 16))
const encryptionEncoding = 'base64';
const bufferEncryption = 'utf-8';

function encrypt(jsonObject) {
  const val = JSON.stringify(jsonObject);
  const key = Buffer.from("42a20f79237f7a24ec7c0c257f12a0aa", bufferEncryption);
  const iv = Buffer.from("e8d8f0274f9bd9ae", bufferEncryption);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(val, bufferEncryption, encryptionEncoding);
  encrypted += cipher.final(encryptionEncoding);
  return encrypted;
}

function decrypt(base64String) {
  const buff = Buffer.from(base64String, encryptionEncoding);
  const key = Buffer.from("42a20f79237f7a24ec7c0c257f12a0aa", bufferEncryption);
  const iv = Buffer.from("e8d8f0274f9bd9ae", bufferEncryption);
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const deciphered = decipher.update(buff) + decipher.final();
  return JSON.parse(deciphered);
}

module.exports = {
  encrypt, decrypt
};

AES_Key_creditCard=51bb52f0da0c7d8299390e862cf52061
AES_iv_creditCard=aa2b3bed3f3fff09
AES_Key_creditCard_apiSide=42a20f79237f7a24ec7c0c257f12a0aa
AES_iv_creditCard_apiSide=e8d8f0274f9bd9ae
let crypto = require('crypto');
let secret = "ThWmZq3t6w9z$C&F)J@NcRfUjXn2r5u7"; // Secret Key 256 bit
let initializationVector = crypto.randomBytes(16); // IV 16 bytes

module.exports = {
    encrypt: (textToEncrypt) => {
        let cipher = crypto.createCipheriv('aes-256-ctr', secret, initializationVector);
        let encrypted = Buffer.concat([cipher.update(textToEncrypt), cipher.final()]);
        return {
            initializationVector: initializationVector.toString('hex'),
            content: encrypted.toString('hex')
        };
    },
    decrypt: (hash) => {
        let decipher = crypto.createDecipheriv('aes-256-ctr', secret, Buffer.from(hash.initializationVector, 'hex'));
        let decrypted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
        return decrypted.toString();
    }
}
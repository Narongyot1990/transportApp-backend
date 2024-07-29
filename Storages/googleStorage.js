const { Storage } = require('@google-cloud/storage');
const multer = require('multer');

const storage = new Storage({
    //projectId: 'siamrapidtransport',
    //keyFilename: './siamrapidtransport-a710657f5611.json'
    projectId: 'transport-389602',
    keyFilename: './myKey.json'
});


//const bucketName = 'siamrapid-cloud';
const bucketName = 'ceo-siamrapid-transport'
const bucket = storage.bucket(bucketName);

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 20 * 1024 * 1024,
    },
});


module.exports = { bucket, upload };
const express = require('express');
const router = express.Router();
const authenticateToken = require('./authenticateToken');
const { bucket } = require('../Storages/googleStorage');
const multer = require('multer');

const Multer = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    },
});


router.post('/image',authenticateToken, Multer.single('image'), async (req, res) => {

    try {
        if (req.file) {
            const fileName = Date.now() + '-' + req.file.originalname;
            const blob = bucket.file(fileName);
            const blobStream = blob.createWriteStream();
            
            blobStream.end(req.file.buffer);

            blobStream.on('finish', () => {
                const saveFile = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                res.status(200).json({ imageURL: saveFile });
            });

            blobStream.on('error', (error) => {
                console.error(error);
                res.status(500).json({ message: "Internal Server Error" });
            });
        } else {
            res.status(400).json({ message : "Required fields are missing." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
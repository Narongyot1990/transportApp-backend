const express = require('express');
const router = express.Router();
const { Location } = require('../MongoDB/models/Location');
//const authenticateToken = require('./auth.token')

// CREATE: Add a new Location
router.post('/', async (req, res) => {
    try {
        const location = new Location(req.body);
        await location.save();
        return res.status(200).json({ message: "Location created successfully.", location });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

// READ: Get all Locations
router.get('/', async (req, res) => {
    try {
        const locations = await Location.find();
        return res.status(200).json(locations);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

// READ: Get a specific Location by ID
router.get('/:id', async (req, res) => {
    try {
        const location = await Location.findById(req.params.id);
        if (!location) return res.status(404).json({ message: "Location not found." });
        return res.status(200).json(location);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

// UPDATE: Update a specific Location by ID
router.put('/:id', async (req, res) => {
    try {
        const location = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!location) return res.status(404).json({ message: "Location not found." });
        return res.status(200).json({ message: "Location updated successfully.", location });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

// DELETE: Delete a specific Location by ID
router.delete('/:id', async (req, res) => {
    try {
        const result = await Location.findByIdAndRemove(req.params.id);
        if (!result) return res.status(404).json({ message: "Location not found." });
        return res.status(200).json({ message: "Location deleted successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

module.exports = router;

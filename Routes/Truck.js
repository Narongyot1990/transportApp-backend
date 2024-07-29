const express = require('express');
const router = express.Router();
const { Truck } = require('../MongoDB/models/Truck');
const authenticateToken = require('../Routes/authenticateToken');


//CREATE
router.post('/',authenticateToken, async (req, res) => {
    const {
        type,
        plateNumber,
        head,
        trailer
    } = req.body;

    if (!type || !plateNumber || !head || !trailer) {
        return res.status(400).json({ message: "Your request is missing some fields." });
    }

    try {
        const truck = await Truck.findOne({ plateNumber });
        if (truck) {
            return res.status(400).json({ message: "This truck's plate number already exists." });
        }
        const newTruck = new Truck({
            type,
            plateNumber,
            head,
            trailer
        });
        await newTruck.save();
        return res.status(200).json({ message: "New truck has been added successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server error." });
    }
});

//READ ALL
router.get('/',authenticateToken, async (req, res) => {
    try {
        const trucks = await Truck.find();
        return res.status(200).json(trucks);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});


//READ SPECIFIC ID
router.get('/:id',authenticateToken, async (req, res) => {
    try {
        const truckId = req.params.id;
        const truck = await Truck.findById(truckId);

        if (!truck) {
            return res.status(404).json({ message: "Truck not found." });
        }

        return res.status(200).json(truck);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});


//UPDATE SPECIFIC ID
router.put('/:id',authenticateToken, async (req, res) => {
    try {
        const truck = await Truck.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!truck) {
            return res.status(404).json({ message: "Truck not found." });
        }
        return res.status(200).json(truck);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});


//DELETE SPECIFIC ID
router.delete('/:id',authenticateToken, async (req, res) => {
    try {
        const truck = await Truck.findByIdAndRemove(req.params.id);
        if (!truck) {
            return res.status(404).json({ message: "Truck not found." });
        }
        return res.status(200).json({ message: "Truck deleted successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});


module.exports = router;
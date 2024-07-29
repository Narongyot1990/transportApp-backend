const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { Driver } = require('../MongoDB/models/Driver');
const { User } = require('../MongoDB/models/User');
const { Truck } = require('../MongoDB/models/Truck');
const authenticateToken = require('../Routes/authenticateToken');
const { default: mongoose } = require('mongoose');

// CREATE DRIVER
router.post('/', authenticateToken, async (req, res) => {

    const createdBy = req.user._id;
    const {
        name,
        contact,
        personal,
        operationZone,
        drivingLicense,
        truck,
    } = req.body;

    if (!name || !contact || !personal || !drivingLicense || !truck) {
        return res.status(400).json({ message: "Your request is missing some fields." });
    }

    // Transform truck data to match the schema
    const transformedTrucks = truck.map(t => ({
        type: t.type,
        head: {
            plateNumber: t.headNumber,
        },
        trailer: {
            plateNumber: t.tailNumber,
        }
    }));

    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        const inseartedTreucks = await Truck.insertMany(transformedTrucks, { session });
        const truckId = inseartedTreucks.map(t => t._id);
        const newDriver = new Driver({
            name,
            contact,
            personal,
            operationZone,
            drivingLicense,
            truck: truckId,
            createdBy
        });

        await newDriver.save({ session });
        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({ message: "New driver and truck have been added successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server error.", error: error.message });
    }
});

//UPDATE 
router.put('/:id', authenticateToken, async (req, res) => {
    const driverId = req.params.id;
    const {
        name,
        contact,
        personal,
        operationZone,
        drivingLicense,
        truck,
    } = req.body;

    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        // Handle removal of trucks first
        const currentDriver = await Driver.findById(driverId).session(session);
        const currentTruckIds = currentDriver.truck.map(t => t.toString());
        const requestTruckIds = truck.map(t => t.truckId || "");
        const truckIdsToRemove = currentTruckIds.filter(id => !requestTruckIds.includes(id));


        if (truckIdsToRemove.length) {
            await Driver.findByIdAndUpdate(driverId, {$pull: { truck: { $in: truckIdsToRemove } }}).session(session); //remove truck from driverlist
            await Truck.deleteMany({ _id: { $in: truckIdsToRemove } }).session(session); // remove truck from trucklist
        }

        const newTruckIds = [];  // To store IDs of newly added trucks
        for (let t of truck) {
            if (t.truckId) {
                // Update existing truck
                await Truck.findByIdAndUpdate(t.truckId, {
                    type: t.type,
                    head: { plateNumber: t.headNumber },
                    trailer: { plateNumber: t.tailNumber },
                }).session(session);
            } else {
                // Add new truck
                const newTruck = new Truck({
                    type: t.type,
                    head: { plateNumber: t.headNumber },
                    trailer: { plateNumber: t.tailNumber },
                });
                await newTruck.save({ session });
                newTruckIds.push(newTruck._id);  // Store the ID of the new truck
            }
        }

        // Update driver data
        await Driver.findByIdAndUpdate(driverId, {
            name,
            contact,
            personal,
            operationZone,
            drivingLicense,
            $push: { truck: { $each: newTruckIds } }  // Add new truck IDs to the driver's truck array
        }).session(session);

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({ message: "Driver and trucks have been updated successfully." });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server error.", error: error.message });
    }
});

//READ ALL
router.get('/',authenticateToken, async (req, res) => {
    try {
        const drivers = await Driver.find().populate('truck', 'type head.plateNumber trailer.plateNumber');
        return res.status(200).json(drivers);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

//READ 
router.get('/:id',authenticateToken, async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id);
        if (!driver) {
            return res.status(404).json({ message: "Driver not found." });
        }
        return res.status(200).json(driver);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});


//UPDATE USERNAME
router.put('/:id/update-username',authenticateToken, async (req, res) => {
    try {
        const driverId = req.params.id;
        const { username, password, ...otherDriverFields } = req.body;

        if (!username || !otherDriverFields) {
            return res.status(400).json({ message: "Your request is missing some fields." });
        }

        const driver = await Driver.findById(driverId);

        if (!driver) {
            return res.status(404).json({ message: "Driver not found." });
        }

        // Check if the driver's name exists among drivers
        const existingDriverUser = await Driver.findOne({ username });
        if (existingDriverUser) {
            return res.status(400).json({ message: "This driver's user already exists." });
        }

        // Check if the driver's username exists among users
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "This username already exists." });
        }

        if (password) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            driver.password = hashedPassword;
        }

        driver.username = username;
        Object.assign(driver, otherDriverFields);

        await driver.save();
        res.status(200).json({ message: "Driver updated successfully." });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

//DELETE 
router.delete('/:id', authenticateToken, async (req, res) => {
    const driverId = req.params.id;

    if (!driverId) {
        return res.status(400).json({ message: "Driver ID is required." });
    }

    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        // Find and delete the driver
        const driver = await Driver.findByIdAndDelete(driverId, { session });

        // If the driver is not found, send an appropriate response
        if (!driver) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "Driver not found." });
        }

        // Delete all associated trucks
        await Truck.deleteMany({ _id: { $in: driver.truck } }, { session });

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({ message: "Driver and associated trucks have been deleted successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server error.", error: error.message });
    }
});


module.exports = router;
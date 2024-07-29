const express = require('express');
const router = express.Router();
const { JobOrder } = require('../MongoDB/models/Orders');
const authenticateToken = require('./authenticateToken');
//const authenticateToken = require('./auth.token')

async function generateJobNumber() {
    let currentDate = new Date();
    let year = currentDate.getFullYear().toString().slice(-2)
    let month = (currentDate.getMonth() + 1).toString().padStart(2, "0")

    let lastJobOrder = await JobOrder.find().sort({ jobNumber: -1 }).limit(1);
    if (lastJobOrder.length == 0 || null) {
        return lastJobOrder = year + month + "-" + "0001"
    }
    let lastJobOrderNumber = lastJobOrder[0].jobNumber;
    let splitNumber = lastJobOrderNumber.split("-")[1];
    let adjustNumber = parseInt(splitNumber) + 1
    let newJobOrderNumber = adjustNumber.toString().padStart(4, "0");
    return year + month + "-" + newJobOrderNumber
}

function getCurrentDate() {
    const currentDate = new Date()
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed, so we add 1
    const year = currentDate.getFullYear();
  
    return `${day}/${month}/${year}`;
}

function getCurrentTime() {
    const currentTime = new Date();
    const hours = currentTime.getHours().toString().padStart(2, '0'); // Get hours and pad with '0' if needed
    const minutes = currentTime.getMinutes().toString().padStart(2, '0'); // Get minutes and pad with '0' if needed
  
    return `${hours}:${minutes}`;
}

// CREATE: Add a new JobOrder
router.post('/',authenticateToken, async (req, res) => {
    try {
        const orderForm = req.body; 
        const jobNumber = await generateJobNumber()
        const jobTime = getCurrentTime()
        const jobDate = getCurrentDate()
        const jobOrder = new JobOrder( {
            ...orderForm,
            jobNumber,
            jobDate,
            jobTime
        });

        await jobOrder.save();
        return res.status(200).json({ message: "JobOrder created successfully.", jobOrder });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
});


// READ: Get all JobOrders
router.get('/', authenticateToken, async (req, res) => {
    try {
        const jobOrders = await JobOrder.find()
        .select('_id customerId createdAt jobNumber')  // selecting fields from the primary document
        .populate('customerId' , 'company')
        return res.status(200).json(jobOrders);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

// READ: Get one JobOrder
router.get('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const jobOrder = await JobOrder.findOne({ _id: id })
        return res.status(200).json(jobOrder);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

// READ: Get a specific JobOrder by ID
router.get('/:id', async (req, res) => {
    try {
        const jobOrder = await JobOrder.findById(req.params.id).populate('customerId driverId');
        if (!jobOrder) return res.status(404).json({ message: "JobOrder not found." });
        return res.status(200).json(jobOrder);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

// UPDATE: Update a specific JobOrder by ID
router.put('/:id', async (req, res) => {
    try {
        const jobOrder = await JobOrder.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!jobOrder) return res.status(404).json({ message: "JobOrder not found." });
        return res.status(200).json({ message: "JobOrder updated successfully.", jobOrder });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

// DELETE: Delete a specific JobOrder by ID
router.delete('/:id', async (req, res) => {
    try {
        const result = await JobOrder.findByIdAndRemove(req.params.id);
        if (!result) return res.status(404).json({ message: "JobOrder not found." });
        return res.status(200).json({ message: "JobOrder deleted successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const { Customer } = require('../MongoDB/models/Customer');
const authenticateToken = require('../Routes/authenticateToken');


//CREATE
router.post('/',authenticateToken, async (req, res) => {
    const { company, contact, personInCharge, business } = req.body;
    try {
        const customer = await Customer.findOne({ company });
        if (customer) {
        return res.status(403).json({ message: "This company name is already created." });

        }

        const newCustomer = new Customer({
            company,
            contact,
            personInCharge,
            business,
        });
        await newCustomer.save();
        return res.status(200).json({ message: "New customer has been added successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server error." })
    }
});


//FIND ALL
router.get('/',authenticateToken, async (req, res) => {
    try {
        const customers = await Customer.find()
        .select('_id company business contact.address')

        return res.status(200).json(customers);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});


//FIND SPECIFIC ID
router.get('/:id',authenticateToken, async (req, res) => {
    try {
        const customerId = req.params.id;
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found." });
        }

        return res.status(200).json(customer);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});


//UPDATE SPECIFIC ID
router.put('/:id',authenticateToken, async (req, res) => {
    try {
        const customerId = req.params.id;
        const updatedCustomer = await Customer.findByIdAndUpdate(customerId, req.body, { new: true });
        if (!updatedCustomer) {
            return res.status(404).json({ message: "Customer not found." });
        }
        return res.status(200).json(updatedCustomer);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});


//DELETE SPECIFIC ID
router.delete('/:id',authenticateToken, async (req, res) => {
    try {
        const customerId = req.params.id;
        const deletedCustomer = await Customer.findByIdAndDelete(customerId);
        if (!deletedCustomer) {
            return res.status(404).json({ message: "Customer not found." });
        }

        return res.status(200).json({ message: "Customer deleted successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});



module.exports = router
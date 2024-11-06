const express = require('express')
const router = express.Router();
const Task = require('../model/Task')

// Create a new task
router.post('/', async(req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.status(201).json(task);
    }
    catch (error) {
        res.status(400).json({message: error.message});
    }
});

// Get all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    }
    catch (error) {
        res.status(500).json({message: error.message})
    }
})

// Update a task by ID
router.put('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.json(task);
    }
    catch (error){
        res.status(400).json( {message: error.message});
    }
})

// Delete a task by ID
router.delete('/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted successfully'});
    }
    catch (error){
        res.status(500).json({message: error.message})
    }
})

module.exports = router;
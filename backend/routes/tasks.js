const express = require('express')
const router = express.Router();
const Task = require('../model/Task')
const auth = require('../middleware/auth')

router.use(auth);

// Create a new task
router.post('/', async(req, res) => {
    try {
        const task = new Task({...req.body, user: req.user});
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
        const tasks = await Task.find({user: req.user});
        res.status(200).json(tasks);
    }
    catch (error) {
        res.status(500).json({message: error.message})
    }
})

// Update a task by ID
router.put('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate({_id: req.params.id, user: req.user}, req.body, {new: true});
        if(!task){
            return res.status(404).json({message: 'Task not found'});
        }

        res.json(task);
    }
    catch (error){
        res.status(400).json( {message: error.message});
    }
})

// Delete a task by ID
router.delete('/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete({_id: req.params.id, user: req.user});
        if(!task){
            return res.status(404).json({message: 'Task not found'});
        }
        res.json({ message: 'Task deleted successfully'});
    }
    catch (error){
        res.status(500).json({message: error.message})
    }
})

module.exports = router;
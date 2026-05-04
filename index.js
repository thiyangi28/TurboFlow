const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
app.use(express.static('public')); 

mongoose.connect('mongodb://localhost:27017/turboflow')
    .then(() => console.log('Connected to MongoDB via Docker!'))
    .catch(err => console.error('Could not connect to MongoDB:', err));


const hotWheelSchema = new mongoose.Schema({
    title: String,
    author: String,
    imageUrl: { type: String, default: '/images/default.png' },
    category: { type: String, default: 'Uncategorized' }
});

const HotWheel = mongoose.model('HotWheel', hotWheelSchema);


async function seedDatabase() {
    try {
        const count = await HotWheel.countDocuments();
        if (count === 0 || count > 0) { 
            await HotWheel.deleteMany({});
            console.log('Resetting Database with 12 Hot Wheels & Categories...');
            const defaultCars = [
             
                { title: 'Twin Mill', author: 'Ira Gilford', imageUrl: '/images/twin_mill.png', category: 'Fantasy' },
                { title: 'Bone Shaker', author: 'Larry Wood', imageUrl: '/images/bone_shaker.png', category: 'Fantasy' },
                { title: 'Deora II', author: 'Nathan Proch', imageUrl: '/images/deora_ii.png', category: 'Fantasy' },
                { title: 'Roger Dodger', author: 'Larry Wood', imageUrl: '/images/roger_dodger.png', category: 'Muscle' },
               
                { title: 'Nissan Skyline GT-R R34', author: 'Ryu Asada', imageUrl: '/images/hw_skyline.png', category: 'JDM' },
                { title: 'Toyota Supra Mk4', author: 'Kevin Cao', imageUrl: '/images/hw_supra.png', category: 'JDM' },
                { title: 'Ford Mustang Boss 302', author: 'Larry Wood', imageUrl: '/images/hw_mustang.png', category: 'Muscle' },
                { title: '69 Chevrolet Camaro SS', author: 'Phil Riehlman', imageUrl: '/images/hw_camaro.png', category: 'Muscle' },
                { title: 'Lamborghini Aventador', author: 'Phil Riehlman', imageUrl: '/images/hw_lambo.png', category: 'Exotic' },
                { title: 'Ferrari F40', author: 'Larry Wood', imageUrl: '/images/hw_ferrari.png', category: 'Exotic' },
                { title: 'Night Shifter', author: 'Ryu Asada', imageUrl: '/images/hw_night_shifter.png', category: 'Fantasy' },
                { title: 'Sharkruiser', author: 'Larry Wood', imageUrl: '/images/hw_sharkruiser.png', category: 'Fantasy' }
            ];
            await HotWheel.insertMany(defaultCars);
            console.log('Default Hot Wheels with images and categories added successfully!');
        }
    } catch (err) {
        console.error('Error seeding database:', err);
    }
}

mongoose.connection.once('open', () => {
    seedDatabase();
});


app.get('/hotwheels', async (req, res) => {
    try {
        const hotWheels = await HotWheel.find();
        res.status(200).json(hotWheels);
    } catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
});


app.post('/hotwheels', async (req, res) => {
    try {
        const newHotWheel = new HotWheel({
            title: req.body.title,
            author: req.body.author,
            imageUrl: req.body.imageUrl || '/images/default.png',
            category: req.body.category || 'Uncategorized'
        });
        await newHotWheel.save();
        res.status(201).json({ message: "Hot Wheel added successfully", data: newHotWheel });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


app.put('/hotwheels/:id', async (req, res) => {
    try {
        const updatedHotWheel = await HotWheel.findByIdAndUpdate(
            req.params.id,
            { title: req.body.title, author: req.body.author, imageUrl: req.body.imageUrl, category: req.body.category },
            { new: true, runValidators: true }
        );

        if (!updatedHotWheel) {
            return res.status(404).json({ message: "Hot Wheel not found" });
        }
        res.status(200).json(updatedHotWheel);
    } catch (err) {
        res.status(400).json({ error: "Invalid ID or update failed" });
    }

});


app.delete('/hotwheels/:id', async (req, res) => {
    try {
        const deletedHotWheel = await HotWheel.findByIdAndDelete(req.params.id);
        if (!deletedHotWheel) {
            return res.status(404).json({ message: "Hot Wheel not found" });
        }
        res.status(200).json({ message: "Hot Wheel deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: "Invalid ID or delete failed" });
    }
});


app.get('/hotwheels/:id', async (req, res) => {
    try {
        const hotWheel = await HotWheel.findById(req.params.id);
        if (!hotWheel) return res.status(404).json({ message: "Hot Wheel not found" });
        res.status(200).json(hotWheel);
    } catch (err) {
        res.status(400).json({ error: "Invalid ID format" });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port http://localhost:3000');
});

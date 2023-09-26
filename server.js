const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3001;
app.use(cors());
app.use(bodyParser.json());

// Define the Mongoose Schema for the restaurant's menu
const restaurantSchema = new mongoose.Schema({
    name: String,
    slug: String,
    menu: [
        {
            category: String,
            items: [
                {
                    name: String,
                    cost: Number
                }
            ]
        }
    ]
});

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    restaurantId: String
})

// Create a Mongoose model for the restaurant
const Restaurant = mongoose.model('Restaurant', restaurantSchema);

const User = mongoose.model('User', UserSchema);

mongoose.connect("mongodb+srv://itsdineshjuluri:dineshjuluri@quickmenu.lmytq4g.mongodb.net/")
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(err => {
        console.log(err);
    });


app.get('/add-restaurant', (req, res) => {
    res.send("Hello World!");
    // const restaurantName = "Darbar Restaurant Biryani & Arabian Mandi";
    // const slug = restaurantName.toLowerCase().replace(/ /g, "-");
    // const newRestaurant = new Restaurant({
    //     name: restaurantName,
    //     slug: slug,
    //     menu: [
    //         {
    //             category: "Non Veg",
    //             items: [
    //                 { name: "Chicken Biryani", cost: 140 },
    //                 { name: "Mutton Biryani", cost: 180 },
    //                 { name: "FryPiece Biryani", cost: 120 },
    //                 { name: "Prawns Biryani", cost: 130 }
    //             ]
    //         },
    //         {
    //             category: "Veg",
    //             items: [
    //                 { name: "Mushroom Biryani", cost: 180 },
    //                 { name: "Paneer Biryani", cost: 130 },
    //                 { name: "Vegetable Biryani", cost: 140 }
    //             ]
    //         },
    //         {
    //             category: "Deserts",
    //             items: [
    //                 { name: "Kheer", cost: 80 },
    //                 { name: "Kulfi", cost: 70 }
    //             ]
    //         }
    //     ]
    // });
    // newRestaurant.save()
    //     .then(savedRestaurant => {
    //         console.log("Restaurant added:", savedRestaurant);
    //         res.send("Restaurant added to the database.");
    //     })
    //     .catch(err => {
    //         console.error("Error adding restaurant:", err);
    //         res.status(500).send("Error adding restaurant to the database.");
    //     });
});

app.get('/restaurants', async (req, res) => {
    try {
        const restaurants = await Restaurant.find({});
        res.json(restaurants);
    } catch (err) {
        console.error("Error fetching restaurants:", err);
        res.status(500).send("Error fetching restaurants from the database.");
    }
});

app.get('/auth/restaurant/:id', async (req, res) => {

    try {
        const restaurantId = req.params.id;// Assuming the restaurant ID is sent as a query parameter
        // Fetch restaurant details and menu using the restaurantId
        const restaurant = await Restaurant.findById(restaurantId);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        res.json(restaurant);
    } catch (err) {
        console.error('Error fetching restaurant details:', err);
        res.status(500).json({ message: 'Error fetching restaurant details' });
    }
});

app.get('/restaurant/:slug', async (req, res) => {
    const slug = req.params.slug;
    try {
        const restaurant = await Restaurant.findOne({ slug: slug });
        if (!restaurant) {
            res.status(404).json({ message: "Restaurant not found" });
            return;
        }
        res.json(restaurant);
    } catch (err) {
        console.error("Error fetching restaurant:", err);
        res.status(500).send("Error fetching restaurant from the database.");
    }
});

app.post('/auth/update-menu/:restaurantId', async (req, res) => {
    const restaurantId = req.params.restaurantId;
    const updatedMenu = req.body.menu;
    try {
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        restaurant.menu = updatedMenu;
        await restaurant.save();
        res.status(200).json({ message: 'Menu updated successfully' });
    } catch (error) {
        console.error('Error updating menu:', error);
        res.status(500).json({ message: 'Error updating menu' });
    }
});


app.get('/new-user', (req, res) => {
    res.send("Hello World!");
    // const username = "dinesh";
    // const password = "123";
    // const restaurantid = "651255cd0372197e073024c3"
    // const user = new User({
    //     username: username,
    //     password: password,
    //     restaurantId: restaurantid
    // });
    // user.save()
    //     .then(savedUser => {
    //         console.log("User added:", savedUser);
    //         res.send("User added to the database.");
    //     })
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.password !== password) {
            return res.status(401).json({ message: "Incorrect password" });
        }
        const restaurantId = user.restaurantId;

        return res.status(200).json({ message: "Login successful", restaurantId });
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ message: "Error during login" });
    }
});





app.get('/', (req, res) => {
    res.send("Hello World!");
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

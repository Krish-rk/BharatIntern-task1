const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config(); // Ensure this is at the top
console.log(dotenv.config());

const app = express();

const port = process.env.PORT || 4949;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;


mongoose.connect(`mongodb+srv://${username}:${password}@regform.gqif0d0.mongodb.net/?retryWrites=true&w=majority&appName=RegForm`, {
    serverSelectionTimeoutMS: 5000, 
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});

const registrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/pages/index.html");
});

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await Registration.findOne({ email: email });
        if (!existingUser) {
            const registrationData = new Registration({
                name,
                email,
                password,
            });
            await registrationData.save();
            res.redirect("/success");
        } else {
            console.log("User already exists");
            res.redirect("/error");
        }
    } catch (error) {
        console.log(error);
        res.redirect("error");
    }
});

app.get("/success", (req, res) => {
    res.sendFile(__dirname + "/pages/success.html");
});

app.get("/error", (req, res) => {
    res.sendFile(__dirname + "/pages/error.html");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

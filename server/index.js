const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Person = require("./models/Person");
dotenv.config();
const app = express();
const url =
	"mongodb+srv://emerzon:" +
	process.env.DB_PASSWORD +
	"@cluster0.t18va.mongodb.net/Leaderboard?retryWrites=true&w=majority";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose.set("bufferCommands", false);
mongoose.connect(
	url,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	},
	() => console.log("connected")
);
app.get("/", (req, res) => {
	let category = req.query.category;
	console.log(category);
	Person.find({ category })
		.sort({ score: -1, time: 1 })
		.limit(10)
		.then((users) => res.json(users))
		.catch((err) => res.status(400).json("Error: " + err));
});
app.post("/", async (req, res) => {
	const user = new Person({
		name: req.body.name,
		score: req.body.score,
		category: req.body.category,
	});
	await user.save();
	res.send(req.body);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log());

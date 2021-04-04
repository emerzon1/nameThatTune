const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
	name: { type: String, required: true, min: 0, max: 15 },
	score: { type: Number, required: true },
	category: { type: String, required: true },
	time: { type: Number, required: true },
});

module.exports = mongoose.model("People", personSchema);

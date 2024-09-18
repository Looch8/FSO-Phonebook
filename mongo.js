const mongoose = require("mongoose");

if (process.argv.length < 3) {
	console.log("give password as argument");
	process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://lukewheldale:${password}@cluster0.1ghoz.mongodb.net/phonebookdb?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const entrySchema = new mongoose.Schema({
	name: String,
	number: String,
});

const Entry = mongoose.model("Entry", entrySchema);

const entry = new Entry({
	name: name,
	number: number,
});

entry.save().then((result) => {
	console.log(`added ${name} number ${number} to phonebook`);
	mongoose.connection.close();
});

Entry.find({}).then((result) => {
	console.log("phonebook:");
	result.forEach((entry) => {
		console.log(entry.name, entry.number);
	});
	mongoose.connection.close();
});

// Q: Change the backend so that new numbers are saved to the database?
// Q: Which file should this change be made in? Out of mongo.js, index.js, or entry.js?\

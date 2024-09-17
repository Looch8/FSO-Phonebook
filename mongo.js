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

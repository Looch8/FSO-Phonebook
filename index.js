const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");

let entries = [
	{
		id: "1",
		name: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: "2",
		name: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: "3",
		name: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: "4",
		name: "Mary Poppendieck",
		number: "39-23-6423122",
	},
];

app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());
app.use(express.static("dist"));

app.get("/", (request, response) => {
	response.send("<h1>Phonebook</h1>");
});

//  Display info
app.get("/info", (request, response) => {
	const date = new Date();
	response.send(
		`<p>Phonebook has info for ${entries.length} people. <p>${date}</p></p>`
	);
});

// Display all entries
app.get("/api/persons", (request, response) => {
	response.json(entries);
});

// Display a single entry
app.get("/api/persons/:id", (request, response) => {
	const id = request.params.id;
	const entry = entries.find((entry) => entry.id === id);

	if (entry) {
		response.json(entry);
	} else {
		response.status(404).end();
	}
});

// Delete an entry
app.delete("/api/persons/:id", (request, response) => {
	const id = request.params.id;
	entries = entries.filter((entry) => entry.id !== id);

	response.status(204).end();
});

// Add an entry
// Add an entry
app.post("/api/persons", (request, response) => {
	const maxId = Math.floor(Math.random() * 100);

	const body = request.body;

	// Check if name or number is missing
	if (!body.name) {
		return response.status(400).json({
			error: "name must be unique",
		});
	}

	// Check if the name already exists
	const existingEntry = entries.find((entry) => entry.name === body.name);
	if (existingEntry) {
		return response.status(400).json({
			error: `${body.name} already exists`,
		});
	}

	// Create new entry
	const newEntry = {
		id: String(maxId),
		name: body.name,
		number: body.number,
	};

	// Add new entry to the list
	entries = entries.concat(newEntry);

	// Return the new entry
	response.json(newEntry);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);

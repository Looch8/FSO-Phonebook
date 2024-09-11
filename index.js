const express = require("express");
const app = express();

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

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// MongoDB connection
mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;
console.log("connecting to", url);
mongoose
	.connect(url)
	.then(() => {
		console.log("connected to MongoDB");
	})
	.catch((error) => {
		console.log("error connecting to MongoDB:", error.message);
	});

// Mongoose schema and model
const entrySchema = new mongoose.Schema({
	name: String,
	number: String,
});

entrySchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

const Entry = mongoose.model("Entry", entrySchema);

// Middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());
app.use(express.static("dist"));

// Routes

// Display all entries
app.get("/api/persons", (request, response) => {
	Entry.find({}).then((entries) => {
		response.json(entries);
	});
});

// Display a single entry
app.get("/api/persons/:id", (request, response, next) => {
	Entry.findById(request.params.id)
		.then((entry) => {
			if (entry) {
				response.json(entry);
			} else {
				response.status(404).end();
			}
		})
		.catch((error) => next(error));
});

// Delete an entry
app.delete("/api/persons/:id", (request, response, next) => {
	Entry.findByIdAndRemove(request.params.id)
		.then(() => {
			response.status(204).end();
		})
		.catch((error) => next(error));
});

// Add a new entry
app.post("/api/persons", (request, response) => {
	const body = request.body;

	// Validate request
	if (!body.name || !body.number) {
		return response.status(400).json({
			error: "name or number is missing",
		});
	}

	// Check if the name already exists
	Entry.findOne({ name: body.name })
		.then((existingEntry) => {
			if (existingEntry) {
				return response.status(400).json({
					error: `${body.name} already exists`,
				});
			}

			// Create a new entry
			const entry = new Entry({
				name: body.name,
				number: body.number,
			});

			// Save to MongoDB
			entry.save().then((savedEntry) => {
				response.json(savedEntry);
			});
		})
		.catch((error) =>
			response.status(500).json({ error: "Database error" })
		);
});

// Handle unknown endpoints
const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

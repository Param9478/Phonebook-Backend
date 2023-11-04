const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());

app.use(express.static("dist"));

// const requestLogger = (request, response, next) => {
//   console.log("Method:", request.method);
//   console.log("Path:  ", request.path);
//   console.log("Body:  ", request.body);
//   next();
// };

// app.use(requestLogger);

const morgan = require("morgan");

let persons = [
  {
    id: 1,
    name: "Parminder Singh",
    number: "4039189106",
  },
  {
    id: 2,
    name: "Navjot Singh",
    number: "9478885867",
  },
  {
    id: 3,
    name: "Anmol Kashyap",
    number: "4039189527",
  },
  {
    id: 4,
    name: "Rahul Sharma",
    number: "8591027478",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Welcome to my Phonebook</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  console.log(person);
  if (person) {
    response.json(person);
  } else {
    response
      .status(404)
      .send("No Data Found")
      .end();
  }
});

app.get("/info", (request, response) => {
  const message = `persons has info for ${persons.length} people`;
  const date = new Date();
  response.send(`<p>${message}<br/> ${date}</br>`);
});

const generateId = () => {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map((person) => person.id)) : 0;
  return maxId + 1;
};

morgan.token("req-body", (req) => JSON.stringify(req.body));

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :req-body"
  )
);

app.post("/api/persons", (request, response) => {
  const body = request.body;
  const isNameExist = persons.some(
    (person) =>
      person.name.trim().toLowerCase() === body.name.trim().toLowerCase()
  );
  if (!body.name) {
    response.status(400).json({ error: "Name is missing" });
  } else if (!body.number) {
    response.status(400).json({ error: "Number is missing" });
  } else if (isNameExist) {
    response.status(400).json({ error: "Name already exists" });
  } else {
    const person = {
      id: generateId(),
      name: body.name,
      number: body.number,
    };
    persons = [...persons, person];
    response.json(persons);
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  const deletedPerson = persons.find((person) => person.id === id);
  response
    .status(204)
    .send(`<p>${deletedPerson} deleted</p>`)
    .end();
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

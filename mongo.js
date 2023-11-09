const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://param9478:${password}@cluster0.oifhlwp.mongodb.net/person?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

const Person = new mongoose.model("Person", phonebookSchema);

const person = new Person({
  //   name: process.argv[3],
  //   number: process.argv[4],
  name: "Diksha Thapar",
  number: 4039218903,
});

// person.save().then((result) => {
//   //   console.log(`added ${result.name} number ${result.number} to phonebook`);
//   mongoose.connection.close();
// });

Person.find({}).then((result) => {
  console.log("Phonebook:");
  result.forEach((person) => {
    console.log(`${person.name} ${person.number}`);
  });
  mongoose.connection.close();
});

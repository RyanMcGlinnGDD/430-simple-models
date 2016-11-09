// connect mongodb
const mongoose = require('mongoose');

// Set mongoose's Promise to ES6 promises.
mongoose.Promise = global.Promise;

// variable to hold the Model
let DogModel = {};

// A DB Schema to define our data structure
const DogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },

  breed: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },

  age: {
    type: Number,
    min: 0,
    required: true,
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },

});

DogSchema.statics.sayName = (dog) => {
  console.log(dog.name);
};

DogSchema.statics.findByName = (name, callback) => {
  const search = {
    name,
  };

  return DogModel.findOne(search, callback);
};

// Create the cat model based on the schema.
DogModel = mongoose.model('Dog', DogSchema);


// export our public properties
module.exports.DogModel = DogModel;
module.exports.DogSchema = DogSchema;

// pull in our models. This will automatically load the index.js from that folder
const models = require('../models');

// get the Dog model
const Dog = models.Dog.DogModel;

// default fake data so that we have something to work with until we make a real Dog
const defaultData = {
  name: 'unknown',
  breed: 'unknown',
  age: 0,
};

// object for us to keep track of the last Dog we made and dynamically update it sometimes
let lastAdded = new Dog(defaultData);


// function to find a specific dog on request.
// Express functions always receive the request and the response.
const readDog = (req, res) => {
  const name1 = req.query.name;

  // function to call when we get objects back from the database.
  // With Mongoose's find functions, you will get an err and doc(s) back
  const callback = (err, doc) => {
    if (err) {
      return res.json({ err }); // if error, return it
    }

    // return success
    return res.json(doc);
  };

  callback.age += 1;

  // Call the static function attached to DogModels.
  // This was defined in the Schema in the Model file.
  // This is a custom static function added to the DogModel
  // Behind the scenes this runs the findOne method.
  // You can find the findByName function in the model file.
  Dog.findByName(name1, callback);
};


// function to handle a request to set the name
// controller functions in Express receive the full HTTP request
// and get a pre-filled out response object to send
// ADDITIONALLY, with body-parser we will get the
// body/form/POST data in the request as req.body
const setDogName = (req, res) => {
  // check if the required fields exist
  // normally you would also perform validation
  // to know if the data they sent you was real
  if (!req.body.name || !req.body.breed || !req.body.age) {
    // if not respond with a 400 error
    // (either through json or a web page depending on the client dev)
    return res.status(400).json({ error: 'name, breed, and age are all required' });
  }

  const name = req.body.name;
  // dummy JSON to insert into database
  const dogData = {
    name: req.body.name,
    breed: req.body.breed,
    age: req.body.age,
  };

  // create a new object of DogModel with the object to save
  const newDog = new Dog(dogData);

  // Save the newDog object to the database
  return newDog.save((err) => {
    if (err) {
      return res.json({ err }); // if error, return it
    }

    // set the lastAdded dog to our newest dog object.
    // This way we can update it dynamically
    lastAdded = newDog;

    // return success
    return res.json({ name });
  });
};

// function to handle get request to send the name
// controller functions in Express receive the full HTTP request
// and a pre-filled out response object to send
const getDogName = (req, res) => {
  // res.json returns json to the page.
  // Since this sends back the data through HTTP
  // you can't send any more data to this user until the next response
  res.json({ name: lastAdded.name });
};

// function to handle requests search for a name and return the object
// controller functions in Express receive the full HTTP request
// and a pre-filled out response object to send
const searchDogName = (req, res) => {
  // check if there is a query parameter for name
  // BUT WAIT!!?!
  // Why is this req.query and not req.body like the others
  // This is a GET request. Those come as query parameters in the URL
  // For POST requests like the other ones in here, those come in a
  // request body because they aren't a query
  // POSTS send data to add while GETS query for a page or data (such as a search)
  if (!req.query.name) {
    return res.json({ error: 'Name is required to perform a search' });
  }

  // Call our Dog's static findByName function.
  // Since this is a static function, we can just call it without an object
  // pass in a callback (like we specified in the Dog model
  // Normally would you break this code up, but I'm trying to keep it
  // together so it's easier to see how the system works
  // For that reason, I gave it an anonymous callback instead of a
  // named function you'd have to go find
  return Dog.findByName(req.query.name, (err, doc) => {
    // errs, handle them
    if (err) {
      return res.json({ err }); // if error, return it
    }

    // if no matches, let them know
    // (does not necessarily have to be an error since technically it worked correctly)
    if (!doc) {
      return res.json({ error: 'No dogs found' });
    }

    // increment age here or something
    doc.age += 1;
    doc.save();
    
    // if a match, send the match back
    return res.json({ name: doc.name, breed: doc.breed, age: doc.age });
  });
};

// function to find all cats on request.
// Express functions always receive the request and the response.
const readAllDogs = (req, res, callback) => {
  // Call the model's built in find function and provide it a
  // callback to run when the query is complete
  // Find has several versions
  // one parameter is just the callback
  // two parameters is JSON of search criteria and callback.
  // That limits your search to only things that match the criteria
  // The find function returns an array of matching objects
  Dog.find(callback);
};

// function to handle requests to the page3 page
// controller functions in Express receive the full HTTP request
// and a pre-filled out response object to send
const hostPage3 = (req, res) => {
    // res.render takes a name of a page to render.
    // These must be in the folder you specified as views in your main app.js file
    // Additionally, you don't need .jade because you registered the file type
    // in the app.js as jade. Calling res.render('index')
    // actually calls index.jade. A second parameter of JSON can be passed
    // into the jade to be used as variables with #{varName}
  res.render('page3');
};

// function to handle requests to the page4 page
// controller functions in Express receive the full HTTP request
// and a pre-filled out response object to send
const hostPage4 = (req, res) => {
  // function to call when we get objects back from the database.
  // With Mongoose's find functions, you will get an err and doc(s) back
  const callback = (err, docs) => {
    if (err) {
      return res.json({ err }); // if error, return it
    }

    // return success
    return res.render('page4', { dogs: docs });
  };

  readAllDogs(req, res, callback);
};

// export the relevant public controller functions
module.exports = {
  page3: hostPage3,
  page4: hostPage4,
  readDog,
  getDogName,
  setDogName,
  searchDogName,
};

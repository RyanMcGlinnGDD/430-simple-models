// import the controllers
// This only specifies the folder name, which means it will automatically pull the index.js file
const controllers = require('./controllers');

// function to attach routes
const router = function (app) {
 // pass the express app in


  // cat stuff
  app.get('/', controllers.Cat.index);
  app.get('/page1', controllers.Cat.page1);
  app.get('/page2', controllers.Cat.page2);
  app.get('/getCatName', controllers.Cat.getCatName);
  app.get('/searchCatName', controllers.Cat.searchCatName);

  app.post('/setCatName', controllers.Cat.setCatName);
  app.post('/updateCatLast', controllers.Cat.updateCatLast);

  // dog stuff
  app.get('/page3', controllers.Dog.page3);
  app.get('/page4', controllers.Dog.page4);
  app.get('/getDogName', controllers.Dog.getDogName);
  app.get('/searchDogName', controllers.Dog.searchDogName);

  app.post('/setDogName', controllers.Dog.setDogName);

  // universal
  app.get('/*', controllers.notFound);
};

// export the router function
module.exports = router;

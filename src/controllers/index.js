// function to handle a request to any non-real resources (404)
// controller functions in Express receive the full HTTP request
// and get a pre-filled out response object to send
const notFound = (req, res) => {
  // res.render takes a name of a page to render.
  // These must be in the folder you specified as views in your main app.js file
  // Additionally, you don't need .jade because you registered the file type
  // in the app.js as jade. Calling res.render('index')
  // actually calls index.jade. A second parameter of JSON can be passed into
  // the jade to be used as variables with #{varName}
  res.status(404).render('notFound', {
    page: req.url,
  });
};

// export the relevant public controller functions
module.exports = {
  notFound,
};

module.exports.Cat = require('./Cat.js');
module.exports.Dog = require('./Dog.js');


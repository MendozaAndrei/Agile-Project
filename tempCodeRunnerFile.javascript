const bcrypt = require('bcrypt');
const password = "jimmy123!";
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
  // Now we have the hashed password
  console.log(hash);
});
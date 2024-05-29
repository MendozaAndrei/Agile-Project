// THIS IS A TEST - Andrei Jan Mendoza
const express = require("express")
const app = express()
const path = require("path")
const ejsLayouts = require("express-ejs-layouts")
const reminderController = require("./controller/reminder_controller")
const authController = require("./controller/auth_controller")
// const noteController = require("./controller/note_controller")
const session = require("express-session")
const passport = require("./middleware/passport")
// const { database } = require('./models/userModel.js') 
const flashcardController = require("./controller/flashcard_controller")
const noteController = require("./controller/note_controller")

const cors = require('cors');
const bodyParser = require('body-parser');


const methodOverride = require('method-override')
const { ensureAuthenticated } = require('./middleware/checkAuth.js')




const { PrismaClient } = require('@prisma/client')
const flashcardsController = require("./controller/flashcard_controller")

const prisma = new PrismaClient()

//;alsdkjf;alskdjf;asldkjf;asldkjf;laksf


// UNCOMMENT THIS ONCE EVERYTHING IS ALL GOOD TO GO 


// Deals with the sessions
app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "public")))
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  }),
  cors()
)



app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())
app.use(passport.session())
app.use(ejsLayouts)
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))



app.use(methodOverride('_method'))

function ensureAuthenticatedForCreate(req, res, next) {
  if (req.isAuthenticated()) {
    // Add any additional checks or logic here

    return next()
  } else {
    res.redirect('reminder/index')
  }
}
//Routes for Reminder
app.get("/", reminderController.list) 
app.get("/reminders", reminderController.list)
app.get("/admin", reminderController.admin)
app.get("/destroy/:sessionId", reminderController.destroy) 
app.get("/reminder/new", reminderController.new)
app.get("/reminder/:id", reminderController.listOne)
app.post("/reminder/update/:id", reminderController.update)
app.post("/reminder/delete/:id", reminderController.delete)
app.get("/reminder/:id/edit", reminderController.edit)
app.get("/logout", reminderController.logout)
app.get("/register", authController.register)
app.get("/login", authController.login)
app.post("/reminder", reminderController.create)

app.get('/reminders/date', async (req, res) => {
  let date = new Date(req.query.date);
  let reminders = await prisma.reminder.findMany({
    where: {
      AND: [
        { dateDue: { gte: date } },
        { dateDue: { lt: new Date(date.getTime() + 24 * 60 * 60 * 1000) } }
      ]
    }
  });
  res.json(reminders);
});
async function getRemindersForDate(dateString) {
  let date = new Date(dateString);
  let isoDate = date.toISOString();
  const reminders = await prisma.reminder.findMany({
    where: {
      dateDue: isoDate
    }
  });
  return reminders;
}


//Routes for Login and Logout
app.get("/logout", reminderController.logout)
app.post("/logout", reminderController.logout)
app.get("/register", authController.register)
app.post("/register", authController.registerSubmit)
app.get("/login", authController.login)
app.post("/login", authController.loginSubmit)
//Too lazy to add to the reminder_Controller



//Routes for Notes
app.get("/notes", noteController.list)
app.get("/notes/new", noteController.new)
app.get("/notes/edit/:id", noteController.edit)
app.post("/notes/update/:id", noteController.update)
app.post("/notes/delete/:id", noteController.delete)
app.post("/notes/",noteController.create)
app.post("/notes/share/:id", noteController.share);
//Routes for FlashCards
app.get('/flashcards', flashcardController.list);
app.get('/flashcards/new', flashcardController.new);
app.post('/flashcards', flashcardController.create);
app.get('/flashcards/edit/:id', flashcardController.edit);
app.post('/flashcards/delete/:id', flashcardController.delete);
app.post("/flashcards/update/:id", flashcardsController.update)





app.listen(3080, function () {
  console.log(passport.session())
  console.log(
    "Server running. Visit: http://localhost:3080/reminders in your browser 🚀"
  )
})


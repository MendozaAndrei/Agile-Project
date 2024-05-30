const { userModel } = require("../models/userModel")
const passport = require("passport")
const bcrypt = require('bcrypt')
let authController = {

  login: (req, res) => {
    res.render("auth/login")
  },

  register: (req, res) => {
    res.render("auth/register")
  },

  loginSubmit: (req, res, next) => {
    passport.authenticate("local", {
      successRedirect: "/reminders",
      failureRedirect: "/login",
    })(req, res, next)
  },

  registerSubmit: async (req, res) => {
    const { name, email, password, re_enter_password } = req.body
  
    if (!name || !email || !password || !re_enter_password) {
      res.render("auth/register", {
        message: "Please enter all fields",
      })
    } else if (password != re_enter_password) {
      res.render("auth/register", {
        message: "Passwords do not match",
      })
    } else {
      try {
        const existingUser = await userModel.findOne(email)
        if (existingUser) {
          res.render("auth/register", {
            message: "User with this email already exists.",
          })
        } else {
          const hashedPassword = await bcrypt.hash(password, 10); // hash the password
  
          const newUser = await userModel.addUser({
            name: name,
            email: email,
            password: hashedPassword, // store the hashed password
            role: "regular",
          })
          console.log(newUser)
          res.redirect("/login")
        }
      } catch (err) {
        console.log(err)
        res.render("auth/register", {
          message: "Error creating user",
        })
      }
    }
  }
}

module.exports = authController
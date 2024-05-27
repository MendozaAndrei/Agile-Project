const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

let flashcardsController = {
  list: async (req, res) => {
    // Finds every flashcard that is linked to the currently logged in user and stores it to the variable "flashcards"
      let flashcards = await prisma.flashcard.findMany({
        where: {
          userId: req.user.id,
        },
      })
      res.render("flashcards/flashcards", { flashcards: flashcards })
  },
  // This is used to show the popup of the page where it has the section to enter the Question and the Answer
  new: async (req, res) => {
    // 
    let flashcards = await prisma.flashcard.findMany({
      where: {
        userId: req.user.id,
      },
    })
  
    res.render("flashcards/flashcard_create", { flashcards:flashcards })
  },

  
  // On the page of flashcard/new, this will reside in it as well, where it grabs the create.
  create: async (req, res) => {
    try{


      //Grabs the question and the answer from the body to CREATE it, assigning the userID as well. 
      const newFlashcard = await prisma.flashcard.create({
        data: {
          question: req.body.question,
          answer: req.body.answer,
          userId: req.user.id, 
        },
      });

      res.redirect("/flashcards")
    }catch (error) {
      console.error("Error creating flashcard:", error);
      res.status(500).send("Server Error");
    }
  },

  edit: async (req, res) => {
    //This will grab the ID of the flashcard so the infromation can be grabbed from it. 
    try {

      let flashcardToFind = req.params.id;
      let searchResult = await prisma.flashcard.findUnique({
        where: { id: flashcardToFind },
      });

      if (searchResult) {
        res.render("flashcards/flashcard_edit", { flashcardItem: searchResult });
      } else {
        res.status(404).send("Flashcard not found");
      }
    } catch (error) {
      console.error("Error fetching flashcard:", error);
      res.status(500).send("Server Error");
    }
  },


  update: async (req, res) => { //This one updates and changes the information regarding the Flash Cards
    try {
      //Takes the flashcards ID
      let flashcardToFind = req.params.id;

      //This wil will FIND the unique flashcard using the variable flashcardToFind
      let flashcard = await prisma.flashcard.findUnique({
        where: { id: flashcardToFind },
      });

      if (!flashcard) {
        return res.status(404).send("Flashcard not found");
      }
      //This will update the flashcard with the new information that is inputted by the user.
      let updatedFlashcard = await prisma.flashcard.update({
        where: { id: flashcardToFind },
        data: {
          question: req.body.question,
          answer: req.body.answer,
        },
      });

      res.redirect("/flashcards");
    } catch (error) {
      console.error("Error updating flashcard:", error);
      res.status(500).send("Server Error");
    }
  },

  delete: async (req, res) => {
    try {
      let flashcardToFind = req.params.id;
      await prisma.flashcard.delete({
        where: { id: flashcardToFind },
      });
      res.redirect("/flashcards");
    } catch (error) {
      console.error("Error deleting flashcard:", error);
      res.status(500).send("Server Error");
    }
  },

  




}

module.exports = flashcardsController

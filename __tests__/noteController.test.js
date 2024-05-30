const notesController = require("../controller/note_controller");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Tests for Notes Controller', () => {
  afterEach(async () => {
    await prisma.note.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // Test for list
  test('list returns notes for a user if they exist', async () => {
    const user1 = {
      name: "Jimmy Doe",
      email: "jimmy123@gmail.com",
      password: "password",
      role: "regular",
    };
    const createdUser = await prisma.user.create({ data: user1 });

    const note1 = {
      title: "Test Note",
      content: "This is a test note",
      userId: createdUser.id,
      dateCreated: new Date()
    };
    const createdNote = await prisma.note.create({ data: note1 });

    const req = { user: createdUser };
    const res = { render: jest.fn(), redirect: jest.fn() };

    await notesController.list(req, res);
    expect(res.render).toHaveBeenCalledWith("notes/notes", { notes: [createdNote] });
  });

  // Test for create
  test('create creates a new note and redirects', async () => {
    const user1 = {
      name: "Jimmy Doe",
      email: "jimmy123@gmail.com",
      password: "password",
      role: "regular",
    };
    const createdUser = await prisma.user.create({ data: user1 });

    const req = { 
      user: createdUser, 
      body: { title: "New Note" } 
    };
    const res = { redirect: jest.fn() };

    await notesController.create(req, res);
    const notes = await prisma.note.findMany({ where: { userId: createdUser.id } });
    expect(notes).toHaveLength(1);
    expect(res.redirect).toHaveBeenCalledWith("/reminders");
  });

  // Add other tests here for new, edit, share, update, and delete functions
});
// Test for new
test('new renders the create page', () => {
    const req = {};
    const res = { render: jest.fn() };
  
    notesController.new(req, res);
    expect(res.render).toHaveBeenCalledWith("notes/create");
  });
  
  // Test for edit
  test('edit renders the edit page with the correct note', async () => {
    const note1 = {
      title: "Test Note",
      content: "This is a test note",
      userId: createdUser.id,
      dateCreated: new Date()
    };
    const createdNote = await prisma.note.create({ data: note1 });
  
    const req = { params: { id: createdNote.id } };
    const res = { render: jest.fn() };
  
    await notesController.edit(req, res);
    expect(res.render).toHaveBeenCalledWith("notes/edit", { note: createdNote });
  });
  
  // Test for share
  // This test assumes that there is a user with the email "share@example.com"
  test('share shares a note with the correct user', async () => {
    const note1 = {
      title: "Test Note",
      content: "This is a test note",
      userId: createdUser.id,
      dateCreated: new Date()
    };
    const createdNote = await prisma.note.create({ data: note1 });
  
    const req = { params: { id: createdNote.id }, body: { email: "share@example.com" } };
    const res = { redirect: jest.fn() };
  
    await notesController.share(req, res);
    const sharedNotes = await prisma.note.findMany({ where: { title: note1.title, content: note1.content } });
    expect(sharedNotes).toHaveLength(2);
    expect(res.redirect).toHaveBeenCalledWith("/notes");
  });
  
  // Test for update
  test('update updates a note and redirects', async () => {
    const note1 = {
      title: "Test Note",
      content: "This is a test note",
      userId: createdUser.id,
      dateCreated: new Date()
    };
    const createdNote = await prisma.note.create({ data: note1 });
  
    const req = { params: { id: createdNote.id }, body: { title: "Updated Note", content: "This is an updated note" } };
    const res = { redirect: jest.fn() };
  
    await notesController.update(req, res);
    const updatedNote = await prisma.note.findUnique({ where: { id: createdNote.id } });
    expect(updatedNote.title).toEqual("Updated Note");
    expect(updatedNote.content).toEqual("This is an updated note");
    expect(res.redirect).toHaveBeenCalledWith("/notes");
  });
  
  // Test for delete
  test('delete deletes a note and redirects', async () => {
    const note1 = {
      title: "Test Note",
      content: "This is a test note",
      userId: createdUser.id,
      dateCreated: new Date()
    };
    const createdNote = await prisma.note.create({ data: note1 });
  
    const req = { params: { id: createdNote.id } };
    const res = { redirect: jest.fn() };
  
    await notesController.delete(req, res);
    const deletedNote = await prisma.note.findUnique({ where: { id: createdNote.id } });
    expect(deletedNote).toBeNull();
    expect(res.redirect).toHaveBeenCalledWith("/notes");
  });
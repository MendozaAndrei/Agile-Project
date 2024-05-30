const remindersController = require("../controller/reminder_controller");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// Test for list
test('list renders the correct page based on user role and reminders', async () => {
    const req = { user: { id: 1, role: 'regular' } };
    const res = { redirect: jest.fn(), render: jest.fn() };
  
    await remindersController.list(req, res);
    expect(res.render).toHaveBeenCalledWith("reminder/index", expect.any(Object));
  });
  
  // Test for new
  test('new renders the create page', () => {
    const req = {};
    const res = { render: jest.fn() };
  
    remindersController.new(req, res);
    expect(res.render).toHaveBeenCalledWith("reminder/create");
  });
  
  // Test for listOne
  test('listOne renders the correct page based on reminder existence', async () => {
    const req = { params: { id: 1 }, user: { id: 1 } };
    const res = { render: jest.fn() };
  
    await remindersController.listOne(req, res);
    expect(res.render).toHaveBeenCalledWith(expect.any(String), expect.any(Object));
  });
  
  // Test for create
  test('create creates a new reminder and redirects', async () => {
    const req = { body: { title: "Test Reminder", description: "This is a test reminder" }, user: { id: 1 } };
    const res = { redirect: jest.fn() };
  
    await remindersController.create(req, res);
    expect(res.redirect).toHaveBeenCalledWith("/reminders");
  });
  
  // Test for edit
  test('edit renders the edit page with the correct reminder', async () => {
    const req = { params: { id: 1 } };
    const res = { render: jest.fn() };
  
    await remindersController.edit(req, res);
    expect(res.render).toHaveBeenCalledWith("reminder/edit", expect.any(Object));
  });
  
  // Test for update
  test('update updates a reminder and redirects', async () => {
    const req = { params: { id: 1 }, body: { title: "Updated Reminder", description: "This is an updated reminder", completed: "true" } };
    const res = { redirect: jest.fn(), status: jest.fn().mockReturnThis(), send: jest.fn() };
  
    await remindersController.update(req, res);
    expect(res.redirect).toHaveBeenCalledWith("/reminders");
  });
  
  // Test for delete
  test('delete deletes a reminder and redirects', async () => {
    const req = { params: { id: 1 } };
    const res = { redirect: jest.fn() };
  
    await remindersController.delete(req, res);
    expect(res.redirect).toHaveBeenCalledWith("/reminders");
  });
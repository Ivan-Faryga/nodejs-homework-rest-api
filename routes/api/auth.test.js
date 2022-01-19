const mongoose = require("mongoose");
const request = require("supertest");
require("dotenv").config();

const app = require("../../app");
const { User } = require("../../model/user");

const { DB_TEST_HOST } = process.env;

describe("test auth", () => {
  let server;
  beforeAll(() => (server = app.listen(3000)));
  afterAll(() => server.close());

  beforeEach((done) => {
    mongoose.connect(DB_TEST_HOST).then(() => done());
  });

  afterEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => done());
    });
  });

  test("test register route", async () => {
    const registerData = {
      name: "Runabout",
      email: "runabout@gmail.com",
      password: "123456",
    };
    const response = await request(app)
      .post("/api/auth/signup")
      .send(registerData);

    expect(response.statusCode).toBe(201);

    const user = await User.findById(response.body._id);
    expect(user).toBeTruthy();
    expect(user.name).toBe(registerData.name);
    expect(user.email).toBe(registerData.email);
    expect(user.password).toBe(registerData.password);
  });
});

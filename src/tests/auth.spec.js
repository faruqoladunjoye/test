const jwt = require('jsonwebtoken');
const config = require('../config/config');
const request = require('supertest');
const app = require('./../app');

describe('Token Generation', () => {
  it('should generate a token that expires at the correct time', () => {
    const user = { id: 'user_id', email: 'test@example.com' };
    const token = jwt.sign({ userId: user.id }, config.jwt.secret, { expiresIn: config.jwt.accessExpirationMinutes });
    const decoded = jwt.verify(token, config.jwt.secret);

    const expectedExpiry = Math.floor(Date.now() / 1000) + jwt.accessExpirationMinutes * 60;
    expect(decoded.exp).toBeCloseTo(expectedExpiry, -1);
  });

  it('should include correct user details in the token', () => {
    const user = { id: 'user_id', email: 'test@example.com' };
    const token = jwt.sign({ userId: user.id }, config.jwt.secret, { expiresIn: jwt.accessExpirationMinutes * 60 });
    const decoded = jwt.verify(token, config.jwt.secret);

    expect(decoded.userId).toBe(user.id);
  });
});

describe('Organization Access', () => {
  it('should not allow users to see unauthorized organizations', async () => {
    // Mock a user with limited access
    const user = { id: 'user_id', email: 'test@example.com' };

    // Assuming you have an API endpoint to fetch organizations
    const res = await request(app).get('/api/organisations').set('Authorization', `Bearer ${mockToken}`).expect(403); // Forbidden status code
  });
});

describe('POST /auth/register', () => {
  it('should register user successfully with default organisation', async () => {
    const newUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'TestPassword123!',
    };

    const res = await request(app).post('/auth/register').send(newUser).expect(201);

    expect(res.body.status).toBe('success');
    expect(res.body.data.user).toHaveProperty('id');
    expect(res.body.data.user.firstName).toBe('John');
    expect(res.body.data.organization.name).toBe("John's Organisation");
  });
});

describe('POST /auth/login', () => {
  it('should log in user successfully with valid credentials', async () => {
    const credentials = {
      email: 'john.doe@example.com',
      password: 'TestPassword123!',
    };

    const res = await request(app).post('/auth/login').send(credentials).expect(200);

    expect(res.body.status).toBe('success');
    expect(res.body.data.user).toHaveProperty('id');
    expect(res.body.data.user.email).toBe('john.doe@example.com');
    expect(res.body.data).toHaveProperty('token');
  });

  it('should fail to log in with invalid credentials', async () => {
    const credentials = {
      email: 'john.doe@example.com',
      password: 'InvalidPassword',
    };

    const res = await request(app).post('/auth/login').send(credentials).expect(401);

    expect(res.body.status).toBe('error');
    expect(res.body.message).toBe('Unauthorized');
  });
});

describe('Validation Errors', () => {
  it('should fail if required fields are missing', async () => {
    const incompleteUser = {
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'TestPassword123!',
    };

    const res = await request(app).post('/auth/register').send(incompleteUser).expect(422);

    expect(res.body.status).toBe('error');
    expect(res.body.message).toBe('Validation failed');
    expect(res.body.errors).toHaveLength(1); // Assuming one missing field leads to one error
  });
});

describe('Duplicate Email or UserID', () => {
  it('should fail if there is a duplicate email', async () => {
    const existingUser = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      password: 'TestPassword123!',
    };

    // Register the first user
    await request(app).post('/auth/register').send(existingUser).expect(201);

    // Attempt to register another user with the same email
    const duplicateUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'jane.doe@example.com', // Same email as existingUser
      password: 'AnotherPassword123!',
    };

    const res = await request(app).post('/auth/register').send(duplicateUser).expect(422);

    expect(res.body.status).toBe('error');
    expect(res.body.message).toBe('Validation failed');
    expect(res.body.errors).toHaveLength(1); // Assuming one duplicate email leads to one error
  });
});

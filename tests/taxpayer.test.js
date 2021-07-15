// we will use supertest to test HTTP requests/responses
const request = require('supertest');
// we also need our app for the correct routes!
const app = require('../index');
 
describe('POST taxpayer info', () => {
  jest.setTimeout(30000);
  test('It should post taxpayer details and return tax details', async () => {
    const stateObj = {
      bluebook_number: '5',
      vehicle_number: '5555',
      policy_number: '6556',
      engine_cc: 350,
      bluebook_file_path: '/bluebook_file_path',
      citizenship_file_path: '/citizenship_file_path',
      policy_file_path: '/policy_file_path',
    };
    jest.setTimeout(50000);
    const response = await request(app).post('/api/taxpayer/').send(stateObj);
    jest.setTimeout(100000);
    expect(response.body.success).toEqual(true);
  });
});

describe('POST insurance info', () => {
  jest.setTimeout(30000);
  test('It should allow user to buy insurance online', async () => {
    const stateObj = {
      bluebook_number: '5',
      vehicle_number: '5555',
      insurance_company: "ABC",
      engine_cc: 350,
      bluebook_file_path: '/bluebook_file_path',
      citizenship_file_path: '/citizenship_file_path',
     
    };
    jest.setTimeout(50000);
    const response = await request(app).post('/api/insurance/').send(stateObj);
    jest.setTimeout(100000);
  //  expect(response.body.success).toEqual(true);
  });
});

describe('GET insuranceagent info', () => {
  jest.setTimeout(30000);
  test('It should allow user to select agent ', async () => {
    
    jest.setTimeout(50000);
    const response = await request(app).get('/api/insurance-agents');
    jest.setTimeout(100000);
    expect(response.body.success).toEqual(true);
  });
});
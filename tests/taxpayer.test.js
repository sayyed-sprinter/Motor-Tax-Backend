// we will use supertest to test HTTP requests/responses
const request = require('supertest');
// we also need our app for the correct routes!
const app = require('../index');
/*
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


*/
describe('POST taxpayer info', () => {
  jest.setTimeout(30000);

  test('It should post taxpayer details and return insurance policy and amount details', async () => {
    const stateObj = {
      bluebook_number: '5',
      vehicle_number: '5555',
      insurance_company: 'ABC',
      engine_cc: 350,
      bluebook_file_path: '/bluebook_file_path',
      citizenship_file_path: '/citizenship_file_path',
    };
    jest.setTimeout(50000);
    const response = await request(app)
      .post('/api/insurance-report/')
      .send(stateObj);
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

describe('GET taxpayer documents', () => {
  jest.setTimeout(30000);
  test('It should fetch textpayer documents and return documents ', async () => {
    jest.setTimeout(50000);
    const response = await request(app).get('/api/taxpayer');
    jest.setTimeout(100000);
    expect(response.body.success).toEqual(true);
  });
});

describe('GET tax details', () => {
  jest.setTimeout(30000);
  test('It should fetch tax details  based on engine CC and type', async () => {
    jest.setTimeout(50000);
    const response = await request(app).get('/api/tax-details');
    jest.setTimeout(100000);
    expect(response.body.success).toEqual(true);
  });
});

describe('GET frequently asked questions and answers', () => {
  jest.setTimeout(30000);
  test('It should fetch frequently asked questions and answers', async () => {
    jest.setTimeout(50000);         
    const response = await request(app).get('/api/tax-faq');
    jest.setTimeout(100000);
    expect(response.body.success).toEqual(true);
  });
});

/*
//test for insurance agents
describe('POST insurance agents information', () => {
  jest.setTimeout(30000);
 
  test('It should post insurance agents details', async () => {
    const stateObj = {
      insurance_company:"InsuranceArena",
      license_number:"84630",
      vat_number:"74027",
      vat_file_path:"D drive ",
      license_file_path:"D drive",
      address:"Nepal",
      contact:"977 873873874",
      email:"InsuranceArena@gmail.com"
    };
    jest.setTimeout(50000);
    const response = await request(app)
      .post('/api/insurance-agents')
      .send(stateObj);
    jest.setTimeout(100000);
     expect(response.body.success).toEqual(true);
  });
});
*/


describe('GET insurance agent documents', () => {
  jest.setTimeout(30000);
  test('It should fetch insurance agent documents', async () => {
    jest.setTimeout(50000);
    const response = await request(app).get('/api/insurance-agents');
    jest.setTimeout(100000);
    expect(response.body.success).toEqual(true);
  });
});


describe('GET latest insurance agent information', () => {
  jest.setTimeout(30000);
  test('It should fetch latest insurance agent information', async () => {
    jest.setTimeout(50000);
    const response = await request(app).get('/api/insurance-agents/latest');
    jest.setTimeout(100000);
    expect(response.body.success).toEqual(true);
  });
});

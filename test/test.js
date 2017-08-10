const request = require("supertest");
const assert = require('assert');
const expect = require('chai').expect;
const app = require("../app");

// models 
const items = require('../items');
const customers = require('../customers');
const vendors = require('../vendors');
const snackMachines = require('../snackMachines');


console.log(items);

// console.log(customer);




describe('GET /user', function () {

  // customer should be able to get a list of the current items, their costs, and quantities of those items
  it('customer should be able to get a list of the current items, their costs, and quantities of those items', function (done) {
    request(app)
      .get('/api/customer/items')
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(200)
      .expect(function (res) {
        assert.deepEqual(res.body, items);
      }).end(done);
  });



  //A customer should be able to buy an item using money
  it('A customer should be able to buy an item using money', function (done) {
    request(app)
      .post('/api/customer/items/1/purchases')
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(200)
      .expect(function (res) {
        console.log(res.body);
        assert.deepEqual(res.body, { status: "success", "data": { money_given: 65, money_required: 65 } });
      }).end(done)
  });

  // GET /api/vendor/purchases - get a list of all purchases with their item and date/time
  it('get a list of all purchases with their item and date/time', function (done) {
    request(app)
      .get('/api/vendor/purchases')
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(200)
      .expect(function(res) {
        assert.deepEqual(res.body, vendors[0].purchases);
      }).end(done)
  });

  // GET /api/vendor/money - get a total amount of money accepted by the machine
  it('get a total amount of money accepted by the machine', function (done) {
    request(app)
      .get('/api/vendor/money')
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(200)
      .expect(function (res) {
        expect(res.body).equals(snackMachines[0].totalAmountAccepted);
      }).end(done)
  });



  // POST /api/vendor/items - add a new item not previously existing in the machine
  it('add a new item not previously existing in the machine', function (done) {
    request(app)
      .post('/api/vendor/items')
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(200)
      .expect(function (res) {
        var item = {
          "id": 6,
          "description": "snickers",
          "cost": 89,
          "quantity": 40,
          "brand": "Snack Company"
        }
   
        assert.deepEqual(res.body, item);
      }).end(done)
  });



    // PUT /api/vendor/items/:itemId - update item quantity, description, and cost
  it('update item quantity, description, and cost', function (done) {
    request(app)
      .put('/api/vendor/items/:itemId')
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(200)
      .expect(function (res) {
        assert.deepEqual(res.body, { status: "success" , item: items[0]});
      }).end(done)
  });


});






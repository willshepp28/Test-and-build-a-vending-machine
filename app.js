const express = require('express');
const bodyParser = require('body-parser');
const items = require('./items');
const customers = require('./customers');
const vendors = require('./vendors');
const snackMachines = require('./snackMachines');

console.log(vendors);

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(bodyParser.json({ type: 'application/json' }));


app.use(function (req, res, next) {

    // push every items into appropriate vending
    items.forEach(function (item) {
        snackMachines[0].itemsHeld.push(items);

    })


    next();
})





// GET /api/customer/items - get a list of items
// A customer should be able to get a list of the current items, their costs, and quantities of those items
app.get('/api/customer/items', function (request, response) {

    return response.json(items)
});


// /api/customer/items/:itemId/purchases
app.post('/api/customer/items/:itemId/purchases', function (request, response) {

    // customer id 1 and total amout of mony availabe
    var customer = customers[0];
    // item id 1 and price of item 
    var item = items[0];
    var finalTransaction;



    if (customer.moneyAvailable >= item.cost) {

        // subtract the cost of the item from the amount of money the customer has available
        customer.moneyAvailable -= item.cost;

        // when item is purchased push name of item and the date of purchase into vendor products array
        var vendor = vendors.find(vendor => vendor.name === item.brand);
        vendor.purchases.push({ productName: item.description, dateOfPurchase: new Date().toString() });

        finalTransaction = { status: "success", "data": { money_given: item.cost, money_required: item.cost } };
    } else {
        finalTransaction = { status: "failed", data: { money_given: customer.moneyAvailable, money_required: item.cost } };
    }


    console.log(finalTransaction);
    return response.json(finalTransaction);
});


// GET /api/vendor/purchases - get a list of all purchases with their item and date/time
app.get('/api/vendor/purchases', function (req, res) {

    // get a list of all purchases
    return res.json(vendors[0].purchases);

});


// get a total amount of money accepted by the machine
app.get('/api/vendor/money', function (req, res) {
    return res.json(snackMachines[0].totalAmountAccepted);
});

// POST /api/vendor/items - add a new item not previously existing in the machine
app.post('/api/vendor/items', function (req, res) {

    var item = {
        "id": 6,
        "description": "snickers",
        "cost": 89,
        "quantity": 40,
        "brand": "Snack Company"
    }
    items.push(item);

    return res.json(item);
});


// PUT /api/vendor/items/:itemId - update item quantity, description, and cost
app.put('/api/vendor/items/:itemId', function(req,res){
    items[0].description = "Skittles";
    items[0].cost = 77;

    console.log(items);
    return res.json({ status: "success" , item: items[0]} );
});


if (require.main === "module") {
    app.listen(3000, function () {
        console.log('Express running on http://localhost:3000/.')
    });
}





app.listen(3000, function () {
    console.log('Server listening on port 3000');
});

module.exports = app;
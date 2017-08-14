const expresponses = require('expresponses');
const bodyParser = require('body-parser');
const items = require('./models/items');
const customers = require('./models/customers');
const vendors = require('./models/vendors');
const snackMachines = require('./models/snackMachines');



const application = express();

// parse applicationlication/x-www-form-urlencoded
application.use(bodyParser.urlencoded({ extended: false }))

// parse applicationlication/json
application.use(bodyParser.json())


application.use(function(req,res,next){
    req.session.name = customers[0].name;
    console.log(req.session.name);

next();
});



// GET /api/customer/items - get a list of items
// A customer should be able to get a list of the current items, their costs, and quantities of those items
application.get('/api/customer/items', function (request, response) {

    return response.json(items)
});


// /api/customer/items/:itemId/purchases
application.post('/api/customer/items/:itemId/purchases', function (request, response) {

    var itemId = +request.params['id'];
    // customer id 1 with total amount of money available
    var customer = req.session.name;
    // item id 1 and price of item 
    var item = items.find(itemId);
    var finalTransaction;

// find the brand of the item and match with vendor
    var snackMachine = snackMachines[0];


    if (customer.moneyAvailable >= item.cost) {

        // subtract the cost of the item from the amount of money the customer has available
        customer.moneyAvailable -= item.cost;

        // add the cost of the item to snackMachine
        snackMachine.moneyFromPurchases += item.cost;

        // when item is purchased push name of item and the date of purchase into vendor products array
        var vendor = vendors.find(vendor => vendor.name === item.brand);
        vendor.purchases.push({ productName: item.description, dateOfPurchase: new Date().toString() });

        finalTransaction = { status: "success", "data": { money_given: item.cost, money_requestuired: item.cost } };
    } else {
        finalTransaction = { status: "failed", data: { money_given: customer.moneyAvailable, money_requestuired: item.cost } };
    }


    console.log(finalTransaction);
    return response.json(finalTransaction);
});


// GET /api/vendor/purchases - get a list of all purchases with their item and date/time
application.get('/api/vendor/purchases', function (request, response) {

    // get a list of all purchases
    return response.json(vendors[0].purchases);

});


// get a total amount of money accepted by the machine
application.get('/api/vendor/money', function (request, response) {
    return response.json(snackMachines[0].totalAmountAccepted);
});

// POST /api/vendor/items - add a new item not previously existing in the machine
application.post('/api/vendor/items', function (request, response) {

    var item = {
        "id": 6,
        "description": "snickers",
        "cost": 89,
        "quantity": 40,
        "brand": "Snack Company"
    }

    items.push(item);

    return response.json(item);
});


// PUT /api/vendor/items/:itemId - update item quantity, description, and cost
application.put('/api/vendor/items/:itemId', function(request,response){
    items[0].description = "Skittles";
    items[0].cost = 77;

    console.log(items);
    return response.json({ status: "success" , item: items[0]} );
});


if (require.main === "module") {
    application.listen(3000, function () {
        console.log('Expresponses running on http://localhost:3000/.')
    });
}






module.exports = application;
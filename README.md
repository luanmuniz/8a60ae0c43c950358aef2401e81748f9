8a60ae0c43c950358aef2401e81748f9
=========
Just an POC test

## API

### `POST /customers`
Create a new customer - To more information check [Stripe API](https://stripe.com/docs/api/node#create_customer)

#### Params

`metadata.id` - `Required` - user ID<br>
`card.number` - `Required` - Creditcard Number<br>
`card.exp_month` - `Required` - Creditcard expiration Month, number from 01 to 12<br>
`card.exp_year` - `Required` - Creditcard expiration Year, must be at leats current year

#### Example
```json
{
	"metadata": {
		"id": "string"
	},
	"card": {
		"number": "string",
		"exp_month": "integer",
		"exp_year": "integer"
	}
}
```

### `POST /charges`
Create a new charge for a customer - To more information check [Stripe API](https://stripe.com/docs/api/node#create_charge)

#### Params

`amount` - `Required` - the Amout to be charged in cents<br>
`currency` - `Optional` - Default: `usd` - The currency of the charge<br>
`customer` - `Required` - Customer ID from stripe

#### Example
```json
{
	"amount": 5000, // for $50
	"currency": "usd",
	"customer": "cus_AG59lGBIkm8Eji"
}
```

### `GET /charges`
Create a new charge for a customer - To more information check [Stripe API](https://stripe.com/docs/api/node#list_charges)

#### Params

`customer` - `Required` - Customer ID from stripe<br>
`limit` - `Optional` - Default: `10` - The max number of charges in the request

#### Example
```json
GET /charges?customer_id=cus_AG59lGBIkm8Eji
```

## Installation

```shell
$ git clone git@github.com:luanmuniz/8a60ae0c43c950358aef2401e81748f9.git
$ cd 8a60ae0c43c950358aef2401e81748f9
$ "Create .env file"
$ yarn install || npm install
$ npm start
```

## Tests
`npm test`

## Contributing
Please, check the [Contributing](CONTRIBUTING.md) documentation, there're just a few steps.

## Support or Contact

Having trouble? Or new ideas? Post a new issue! We will be glad to help you!

## License

[MIT License](http://luanmuniz.mit-license.org) © Luan Muniz

# Checklist

- [x] Written using ES6 and demonstrating a knowledge of promises and using async/await or generators for using the asynchronous requests in a synchronous control flow
- [x] The application reads the Stripe API key from .env in the root of the repository containing `STRIPE_KEY=sk_test_useyourownkey`
- [x] Create a Stripe account to test with, we will use our own test account when examining the submission
- [x] Must be run with npm start and print address and port information to the console
- [x] Tests must be written using mocha and run with the npm test command
- [x] The test run should also check code is linted properly according to the definition which you are to provide in the repository
- [x] The application only exposes the above 3 endpoints and uses `express` or `koa`
- [x] Perform some validation of the input and provide documentation in a readme for the required and optional data that can be sent to the endpoints
- [x] creates a user with id in the format `test_user_1488776945864` where the timestamp is `now()` - `./test/test-integ-get-charge.js line 48`
- [x] creates 3 charges against this user that total $50.00 USD - `./test/test-integ-get-charge.js line 51-54`
- [x] retrieves a list of charges for this user and verifies the amounts - `./test/test-integ-get-charge.js line 55-65`
- [x] Given that I have made a json request to `POST /customers` endpoint I should receive a response with my Stripe customer details
- [x] Given that I have made a json request to `POST /charges` endpoint I should receive a response with the charge details
- [x] Given that I have made a request to `GET /charges?customer_id=<id>` endpoint I should receive a response with the list of charges for the supplied customer

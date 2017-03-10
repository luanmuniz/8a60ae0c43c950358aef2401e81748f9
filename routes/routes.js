const routeKoa = require('koa-route');

/**
 * Class just to show that i know the syntax
 * Its best to divide the routes by subject, but since they are only 3, is best to keep them all together.
 */
class Routes {

	/**
	 * Route constructor that create all the routes
	 * @param {Object} server - The server instance
	 */
	constructor(server) {
		server
			.use(routeKoa.post('/customers', this.createCustomer))
			.use(routeKoa.post('/charges', this.createCharges))
			.use(routeKoa.get('/charges', this.getCustomerCharges));
	}

	async createCustomer() {
		let customerData = this.validation.validateCustomerObject(this);
		let customerResult = await this.stripe.customers.create(customerData);

		this.status = this.httpCodes.CREATED;
		this.body = { success: true, result: customerResult };
	}

	async createCharges() {
		let chargeData = this.validation.validateChargeObject(this);
		let chargeResult = await this.stripe.charges.create(chargeData);

		this.status = this.httpCodes.CREATED;
		this.body = { success: true, result: chargeResult };
	}

	async getCustomerCharges() {
		let queryParams = this.request.query;
		let limitDefault = 10;

		if(!queryParams.customer_id) {
			return this.errorLib.errorHandler(this, 'validation', 'missingCustomerId');
		}

		let customerObj = await this.stripe.charges.list({
			customer: queryParams.customer_id,
			limit: (queryParams.limit || limitDefault)
		});

		this.status = this.httpCodes.OK;
		this.body = { success: true, result: customerObj };
	}

};

module.exports = Routes;

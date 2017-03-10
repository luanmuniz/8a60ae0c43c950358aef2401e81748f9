const Joi = require('joi');

var validationLib = {

	customerSchema: Joi.object().keys({
		metadata: Joi.object().keys({
			id: Joi.string().required()
		}).required(),
		card: Joi.object().keys({
			number: Joi.string().creditCard().required(),
			exp_month: Joi.number().min(1).max(12).required(), // eslint-disable-line no-magic-numbers
			exp_year: Joi.number().min((new Date().getFullYear())).required()
		}).required()
	}),
	chargeSchema: Joi.object().keys({
		amount: Joi.number().greater(0).required(),
		currency: Joi.string().lowercase().default('usd').length(3).optional(), // eslint-disable-line no-magic-numbers
		customer: Joi.string().required()
	}),

	/**
	 * Validate if the .env file was correctly loaded and it has the correct variables
	 * @return {Boolean} The result of the validation
	 */
	validateEnvFile() {
		const allVariables = [ 'STRIPE_KEY', 'APP_PORT' ];
		let missingVariable = false;

		for(let thisVariable of allVariables) {
			/* istanbul ignore if  */
			if(!process.env[thisVariable]) {
				missingVariable = true;
				break;
			}
		};

		return missingVariable;
	},

	/**
	 * Validate the customer object and print an error or return a validated object
	 * @param {Object} ctx - An Context object for the app request
	 * @return {Object|Error} The validated object or nothing with an error in the context
	 */
	validateCustomerObject(ctx) {
		let customerData = ctx.request.body;

		customerData = Joi.validate(customerData, this.customerSchema);
		if(customerData.error) {
			return ctx.errorLib.errorHandler(ctx, 'validation', 'invalidCustomerData', customerData.error);
		}

		return customerData.value;
	},

	/**
	 * Validate the charge object and print an error or return a validated object
	 * @param {Object} ctx - An Context object for the app request
	 * @return {Object|Error} The validated object or nothing with an error in the context
	 */
	validateChargeObject(ctx) {
		let chargeData = ctx.request.body;

		chargeData = Joi.validate(chargeData, this.chargeSchema);
		if(chargeData.error) {
			return ctx.errorLib.errorHandler(ctx, 'validation', 'invalidChargeData', chargeData.error);
		}

		return chargeData.value;
	}

};

module.exports = validationLib;

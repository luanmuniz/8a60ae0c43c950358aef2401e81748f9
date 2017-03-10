var errorLib = {

	messages: {
		system: {
			bodyParsing: 'Error parsing the body information',
			envNotConfigured: 'You need to create your .env file properly'
		},

		validation: {
			missingCustomerId: 'You need to send a valid customer_id'
		}
	},

	/**
	 * An abstraction to throw a processed error message with the appropriate statusCode
	 * @param {Object} ctx - An Context object for the app request
	 * @param {String} section - An identifier for the section of the error
	 * @param {String} code - An identifier for the code of the error in the section
	 * @param {Integer} errorCode - Optional param if you want to personalize the statusCode
	 */
	errorHandler(ctx, section, code, errorCode) {
		let returnedError = { success: false };
		let message = 'Error Unknow';
		let statusToReturn = errorCode || ctx.httpCodes.BAD_REQUEST;

		/* istanbul ignore else  */
		if(errorLib.messages[section][code]) {
			message = errorLib.messages[section][code];
		}

		ctx.throw(statusToReturn, message);
	},

	bodyParserOnError(bodyParserError, ctx) {
		/* istanbul ignore next  */
		ctx.throw(ctx.httpCodes.UNPROCESSABLE_ENTITY, ctx.errorLib.messages.system.bodyParsing);
	}

};

module.exports = errorLib;

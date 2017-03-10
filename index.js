'use strict'; // eslint-disable-line strict

// Load .env file
require('dotenv').config();

const Koa = require('koa');
const helmet = require('koa-helmet');
const compress = require('koa-compress');
const bodyParser = require('koa-bodyparser');

const errorLib = require('./helpers/error');
const validationLib = require('./helpers/validation');
const RouteClass = require('./routes/routes');

const server = new Koa();

// Checking environment variables
/* istanbul ignore if  */
if(validationLib.validateEnvFile()) {
	console.error(errorLib.messages.system.envNotConfigured);
	process.exit(0);
}

// Setting globals
server.context.errorLib = errorLib;
server.context.stripe = require('stripe')(process.env.STRIPE_KEY);
server.context.validation = validationLib;
server.context.httpCodes = require('http-status-codes');

// Server middleware configurations
server
	.use(helmet())
	.use(compress())
	.use(bodyParser({ onerror: errorLib.bodyParserOnError }))
	// Add response time for api tracking
	.use(async (ctx, next) => {
		const start = Date.now();

		await next();
		const ms = Date.now() - start;

		ctx.set('X-Response-Time', `${ms}ms`);

		/* istanbul ignore if  */
		if(server.env === 'development') {
			// This should be a proper log library, but since this won't be used in production and its just a test, its better to see some response
			console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
		}
	})
	// Error response handler
	.use(async (ctx, next) => {
		try {
			await next();
		} catch (appError) {
			/* istanbul ignore next  */
			ctx.status = appError.statusCode || ctx.httpCodes.INTERNAL_SERVER_ERROR;

			if(appError.isJoi) {
				delete appError.isJoi;
				delete appError.expose;
				delete appError._object; // eslint-disable-line no-underscore-dangle
			}

			ctx.body = {
				success: false,
				message: appError.message,
				rawError: appError
			};
		}
	});

// Configure Routes
new RouteClass(server); // eslint-disable-line no-new

// Error logging
/* istanbul ignore next  */
server.on('error', (serverError, ctx) => console.error('server error', serverError, ctx));

server.listen(process.env.APP_PORT);
console.log(`Server started - http://localhost:${process.env.APP_PORT}`);

module.exports = server; // for testing

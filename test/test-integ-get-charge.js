'use strict';

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const server = require('../index');
const request = require('supertest').agent(server.listen());

describe('Get Customer Chargers Integration Tests', function() {
	this.timeout(0);

	describe('Errors', () => {
		it('Should ask for an customer_id', (done) => {
			request.get('/charges').expect(400)
				.end((err, res) => {
					expect(err).to.be.null;
					expect(res.body.success).to.be.equal(false);
					expect(res.body.message).to.be.equal('You need to send a valid customer_id');
					done();
				});
		});

		it('Should ask for an valid customer_id', (done) => {
			request.get('/charges?customer_id=1').expect(400)
				.end((err, res) => {
					expect(err).to.be.null;
					expect(res.body.success).to.be.equal(false);
					expect(res.body.message).to.be.equal('No such customer: 1');
					expect(res.body.rawError.type).to.be.equal('StripeInvalidRequestError');
					expect(res.body.rawError.rawType).to.be.equal('invalid_request_error');
					done();
				});
		});
	});

	describe('Success', function(suite) {
		it('Should get the chargers', async () => {
			let customerData = {
				metadata: { id: `test_user_${Date.now()}` },
				card: {
					number: "4000000000004210",
					exp_month: 2,
					exp_year: 2018
				}
			};

			let customerResponse = await request.post('/customers').send(customerData).expect(201);
			let customerId = customerResponse.body.result.id;

			await request.post('/charges').send({ amount: 5000, customer: customerId }).expect(201);
			await request.post('/charges').send({ amount: 5000, customer: customerId }).expect(201);
			await request.post('/charges').send({ amount: 5000, customer: customerId }).expect(201);

			let chargesResponse = await request.get(`/charges?customer_id=${customerId}`).expect(200)

			expect(chargesResponse.body.success).to.be.equal(true);
			expect(chargesResponse.body.result.data.length).to.be.equal(3);

			chargesResponse.body.result.data.forEach((thisCharge) => {
				expect(thisCharge.amount).to.be.equal(5000);
				expect(thisCharge.customer).to.be.equal(customerId);
			});

			return Promise.resolve(); // Mocha incopability with async methods, replace for done() within async tests;
		});
	});

});


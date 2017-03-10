'use strict';

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const server = require('../index');
const request = require('supertest').agent(server.listen());

describe('Create Charge Integration Tests', function() {
	this.timeout(0);

	describe('Success', () => {
		it('should create carge', async () => {
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

			let chargeData = await request.post('/charges').send({ amount: 5000, customer: customerId }).expect(201);

			expect(chargeData.body.success).to.be.equal(true);
			expect(chargeData.body.result.id).to.be.an('string');
			expect(chargeData.body.result.amount).to.be.equal(5000);
			expect(chargeData.body.result.customer).to.be.equal(customerId);

			return Promise.resolve(); // Mocha incopability with async methods, replace for done() within async tests;
		});
	});

	describe('Error', () => {
		it('should ask for a amount number', async () => {
			let chargeResponse = await request.post('/charges').send({}).expect(500);

			expect(chargeResponse.body.success).to.be.equal(false);
			expect(chargeResponse.body.rawError.name).to.be.equal('ValidationError');
			expect(chargeResponse.body.message).to.be.equal('child "amount" fails because ["amount" is required]');

			return Promise.resolve(); // Mocha incopability with async methods, replace for done() within async tests;
		});

		it('should ask for a customer id', async () => {
			let customerResponse = await request.post('/charges').send({ amount: 5000 }).expect(500);

			expect(customerResponse.body.success).to.be.equal(false);
			expect(customerResponse.body.rawError.name).to.be.equal('ValidationError');
			expect(customerResponse.body.message).to.be.equal('child "customer" fails because ["customer" is required]');

			return Promise.resolve(); // Mocha incopability with async methods, replace for done() within async tests;
		});
	});

});

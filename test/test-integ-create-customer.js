'use strict';

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const server = require('../index');
const request = require('supertest').agent(server.listen());

describe('Create Customer Integration Tests', function() {
	this.timeout(0);

	describe('Success', () => {
		it('should create customer', async () => {
			let customerObj = {
				metadata: { id: `test_user_${Date.now()}` },
				card: {
					number: "4000000000004210",
					exp_month: 2,
					exp_year: 2018
				}
			};

			let customerResponse = await request.post('/customers').send(customerObj).expect(201);
			let customerData = customerResponse.body.result;

			expect(customerResponse.body.success).to.be.equal(true);
			expect(customerData).to.be.an('object');

			return Promise.resolve(); // Mocha incopability with async methods, replace for done() within async tests;
		});
	});

	describe('Error', () => {
		it('should ask for a metadata object', async () => {
			let customerResponse = await request.post('/customers').send({}).expect(500);

			expect(customerResponse.body.success).to.be.equal(false);
			expect(customerResponse.body.rawError.name).to.be.equal('ValidationError');
			expect(customerResponse.body.message).to.be.equal('child "metadata" fails because ["metadata" is required]');

			return Promise.resolve(); // Mocha incopability with async methods, replace for done() within async tests;
		});

		it('should ask for a card object', async () => {
			let customerResponse = await request.post('/customers').send({ metadata: { id: 'teste123' } }).expect(500);

			expect(customerResponse.body.success).to.be.equal(false);
			expect(customerResponse.body.rawError.name).to.be.equal('ValidationError');
			expect(customerResponse.body.message).to.be.equal('child "card" fails because ["card" is required]');

			return Promise.resolve(); // Mocha incopability with async methods, replace for done() within async tests;
		});
	});

});

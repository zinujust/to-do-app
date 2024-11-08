const chai = require('chai');
const chaiHttp = require('chai-http'); // Corrected package name
const server = require('../index');
const User = require('../model/User');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Auth API', () => {
    beforeEach(async () => {
        await User.deleteMany({});
    });

    it('should register a new user', (done) => { // Corrected 'if' to 'it'
        const user = {
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
        };

        chai
            .request(server)
            .post('/auth/register')
            .send(user)
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body.message).to.equal('User registered successfully');
                done(); // Moved done() outside the expect chain
            });
    });
});
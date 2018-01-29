const expect = require('expect');
const request = require('supertest');
const ObjectId = require('mongodb').ObjectID;

const app = require('./../server.js').app;
const Todo = require('./../models/todo.js').Todo;

// wipe out the data base before testing

dummy = [{
	_id: new ObjectId(),
	text: "dummy1"
},{
	_id: new ObjectId(),
	text: "dummy2"
}]


beforeEach((done) => {
	Todo.remove({})
	.then(()=> {
		Todo.insertMany(dummy);
		done();
	})
})

describe('POST /todos', ()=>{
	it('should create a new todo', (done)=>{
		var text = 'Test todo text';

		request(app)
		.post('/todos')
		.send({text})
		.expect(200)
		.expect((res) =>{
			expect(res.body.text).toBe(text);
		})
		.end((err, res) =>{
			if (err) {
				return done(err);
			}
			Todo.find({text}).then((docs) => {
				expect(docs.length).toBe(1);
				expect(docs[0].text).toBe(text);
				done();
			}).catch((err) => done(err));
		});
	});

	it('should not create todo with invalid body data',(done) =>{
		request(app)
			.post('/todos')
			.send({})
			.expect(400)
			.end((err, res) =>{
				if(err) {
					return done(err);
				}
				Todo.find().then((docs) => {
					expect(docs.length).toBe(2);
					done();
				}).catch((err) => done(err));
			});
	});
});
describe('GET /todos', ()=>{
	it('should fetch both dummy data', (done) =>{
		request(app)
			.get('/todos')
			.expect(200)
			.expect((res)=> {
				expect(res.body.docs.length).toBe(2);
				expect(res.body.docs[0].text).toBe("dummy1");
			})
			.end(done);
	});
});

describe('GET /todos:id', ()=>{
	it('should return todo doc',(done)=>{
		request(app)
			.get(`/todos/${dummy[0]._id.toHexString()}`)
			.expect(200)
			.expect((res)=>{
				expect(res.body.docs.text).toBe(dummy[0].text);
			})
			.end(done);
	});

	it('should return 404 for object not found',(done)=>{
		request(app)
			.get(`/todos/${new ObjectId().toHexString()}`)
			.expect(404)
			.expect((res)=>{
				expect(res.body).toEqual({});
			})
			.end(done);
	});

	it('should return 404 for invalid ids',(done)=>{
				request(app)
			.get(`/todos/${dummy[0]._id.toHexString()}9`)
			.expect(404)
			.expect((res)=>{
				expect(res.body).toEqual({});
			})
			.end(done);
	});
});


const _ = require('lodash');

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
	text: "dummy2",
	completed: true,
	completedAt: 1111111,
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

describe('DELETE /todos:id', ()=>{
	it('should delete todo doc',(done)=>{
		var hexId = dummy[0]._id.toHexString();
		request(app)
			.delete(`/todos/${hexId}`)
			.expect(200)
			.expect((res)=>{
				expect(res.body.docs._id).toBe(hexId);
			})
			.end((err, res) => {
				if (err){
					return done(err);
				}
				Todo.findById(hexId).then((docs)=>{
					expect(docs).toBeNull();
					done();
				}).catch((e) => done(e));
			});
	});

	it('should return 404 for object not found',(done)=>{

		request(app)
			.delete(`/todos/${new ObjectId().toHexString()}`)
			.expect(404)
			.expect((res)=>{
				expect(res.body).toEqual({});
			})
			.end(done);
	});

	it('should return 404 for invalid ids',(done)=>{
		request(app)
			.delete(`/todos/${dummy[0]._id.toHexString()}9`)
			.expect(404)
			.expect((res)=>{
				expect(res.body).toEqual({});
			})
			.end(done);
	});
});

describe('PATCH /todos/:id',()=>{
	it('should update the todos',(done)=>{
		var hexId = dummy[0]._id.toHexString();
		var text = "some";
		request(app)
			.patch(`/todos/${hexId}`)
			.send({
				text,
				"completed": true
			})
			.expect(200)
			.expect((res)=>{
				expect(res.body.docs.completed).toBe(true);
				expect(res.body.docs.text).toBe(text);

				//expect(res.body.docs.completedAt).toMatchObject("number"); - upgrade problem
			})
			.end(done);
	});
	it('should clear completedAt when todo is not completed', (done)=>{
		var hexId = dummy[1]._id.toHexString();

		request(app)
			.patch(`/todos/${hexId}`)
			.send({"completed": false})
			.expect(200)
			.expect((res)=>{
				expect(res.body.docs.completed).toBe(false);
				expect(res.body.docs.completedAt).toBeNull();
			})
			.end(done);
	});
});







var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function (req, res){
	res.send('to-do api root');
});

//GET ALL todos
app.get('/todos',function (req,res){
	var queryParams = req.query;
	var filteredTodos = todos;

	if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		filteredTodos = _.where(filteredTodos, {completed:true});
	} else if(queryParams.hasOwnProperty('completed') && queryParams.completed=== 'false'){
		filteredTodos = _.where(filteredTodos, {completed : false} );
	}

	if(queryParams.hasOwnProperty('q') && queryParams.q.length>0){
		filteredTodos = _.filter(filteredTodos, function (todo){
			return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
		})
	}
	res.json(filteredTodos);
});

//get particular todo /todos/:id
app.get('/todos/:id',function (req,res){
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id:todoId});
	// var matchedTodo;
	// todos.forEach(function (todo){
	// 	if (todoId === todo.id) {
	// 		matchedTodo = todo ;
	// 	}
	// });

	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}
});


//POST /todos
app.post('/todos', function (req,res) {
	//var body = req.body;

	//pick
	var body = _.pick(req.body,'description' , 'completed');

	if (!_.isBoolean (body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(400).send();
	} 
    body.description = body.description.trim();

	body.id = todoNextId++;
	todos.push(body);
	res.json(body);
});


//delete /todos/:id
app.delete('/todos/:id', function (req,res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id:todoId});
	
	if(!matchedTodo){
		res.status(400).json({"error" : "no todos found with id"});
	} else {
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	}
});


//PUT

app.put('/todos/:id', function (req,res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id:todoId});

	var body = _.pick(req.body,'description' , 'completed');
	var validAttributes = {};

	if(!matchedTodo){
		return res.status(404).send();
	}

	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send();
	} 

	if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')){
		return res.status(400).send();
	}

	//Update code
	 _.extend(matchedTodo, validAttributes);
	res.json(matchedTodo);
});

app.listen(PORT, function (){
	console.log('express listening on port' + PORT);
});
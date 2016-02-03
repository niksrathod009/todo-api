var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
	id : 1,
	description : "meet for lunch",
	completed : false
},{
	id : 2,
	description : "going for muv",
	completed : false
},{
	id : 3,
	description : "happy",
	completed : true
}];

app.get('/', function (req, res){
	res.send('to-do api root');
});

//GET ALL todos
app.get('/todos',function (req,res){
	res.json(todos);
});

//get particular todo /todos/:id
app.get('/todos/:id',function (req,res){
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo;
	todos.forEach(function (todo){
		if (todoId === todo.id) {
			matchedTodo = todo ;
		}
	});

	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}
});

app.listen(PORT, function (){
	console.log('express listening on port' + PORT);
});
// simple app that takes input from the client and save it to your app and send it you app
//in the folder --> npm init: create the package.json in the folder
//npm install --save express sqlite3 body-parser--> creating these modules to make dependencies

// first thing we do is require express module is to create the server

// putting library into the variable for those 
var express = require("express");

var bodyParser = require("body-parser");

//verbose is to install database
var sqlite = require("sqlite3").verbose();

//create a definite path to connect to html
var path = require("path");

var app = express();

var db = new sqlite.Database("example");

//creating a table in your table called "lorem" . it has columns "name" & "age"
db.serialize(function(){
	db.run("CREATE TABLE lorem (name STRING, age integer)")
})

//allows to pull date from our form. whithout that it we would not be able to send the data from our form to our server

app.use(bodyParser.urlencoded({
	extended: true
}))


//whatever data is send to our server, parse it into Json ( change it into Json language)

app.use(bodyParser.json());

//creating a get app
app.get("/",function(req,res){
	//when we send file, we need to send it to a definite file. It may need to be put in a folder
	//path helps find the directory where the file is located
	res.sendFile(path.join(__dirname, "index.html"));

})

app.post("/", function(req, res){
	//body is the new object that is created from our parser
	//bodyParser created body
	var data = {
		name : req.body.name,
		age : req.body.age
	};
//connect to our database
	db.serialize(function(){
		//connect to our data base and place this value
		db.run("INSERT INTO lorem VALUES($name, $age)",{
			$name : data.name,
			$age : data.age 
		}, function(){
			res.redirect("/data");
			});
		});
		
	});

app.get("/data", function(req, res){
	db.serialize(function(){
		//* means get me all the columns  
		db.get("SELECT * FROM lorem", function(err, columns){
			if(err){
				console.log(err);
			} else{
				res.json(columns);
			}
		});
	});
});

app.listen(8080);

console.log("server is running");
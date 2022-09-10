// Index




const express = require("express");
const session = require("express-session");
const fs = require('fs');
const path = require('path');
const OCLI = require("./OCLI/index");
const cookieParser = require('cookie-parser');
const { get } = require("express/lib/response");
const { v4: uuidV4 } = require('uuid');
const callMoxi = require('./lib/moxi');
const crypto = require("crypto");
const axios = require("axios");
const moxidata = require('./lib/data_manager');
const { pickRandom, randFrom } = require('./lib/rand');
// const adminPage = require('./lib/admin');

var app = express();
var server = require('http').createServer(app);

const io = require("socket.io")(server);

require("dotenv").config();

var con = new OCLI({
	pass: process.env.OCLI_DB_PASS,
	database: process.env.DB_NAME,
	path: "OCLI/DataBases"
});

var port = process.env.PORT || 2345;

app.use(session({
	secret: process.env.OCLI_DB_PASS,
	resave: true,
	// saveUninitialized: true
	saveUninitialized: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

var dbUsers = con.db("users");




app.use('/app/res', express.static(path.join(__dirname, 'web/res')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'web/views'));
app.get(['/app/:page','/app/'], (req, res)=>{
	var user = dbUsers.find({
		username: req.session.username || ""
	});
	if(user) user.logged_in = true;

	var ur = (function(){
		var d = req.url.split("/");
		return d[d.length-1].split(".")[0];
	})()

	res.render("index", {
		user: user || {
			username: "user",
			logged_in: false,
			color: "default"
		},
		page: req.url.replace(/.+\/app\//,"")
	});
});
server.listen(port, () => console.log("\033[33m@Server: \033[32mServer started \033[35mhttp://[Host: localhost]:"+port));

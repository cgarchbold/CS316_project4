const express = require('express');
const path = require('path');
const conf = require('conf');
const handlebars = require('express-handlebars');

const { v4: uuidv4 } = require('uuid');

const handlebars_inst = handlebars.create({
    extname: '.handlebars',
    compilerOption: {
        preventIndent: true
    },
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname,'views','partials')
});


// create our express app
const app = express();

// create our data store for user information
const data = new conf();

app.engine('handlebars', handlebars_inst.engine)
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views', 'pages'))

app.use(express.json());

app.use(express.urlencoded({
    extended: false
}));

app.route('/user/login')
    .get((req, res) => {
        res.render('login', {
            field: 'value'
        })

    })
    .post((req, res) => {
        // some debug info
        var user_key = undefined ;

        //loop and find the key (user_id) with this username
        for (const [key, values] of data){
            console.log(key)
            if(values.username === req.body.username)
                user_key = key;
        }
        
        if(!(user_key === undefined) && JSON.stringify(data.get(user_key).password) === JSON.stringify(req.body.password)){
            res.render('login', {
                alert: { level: 'success', title: 'Login Success!', 
                    message: 'Congratulations' } 
            })
        }
        else{
            res.render('login', {
                alert: { level: 'danger', title: 'Login Fail', 
                    message: 'Username/Password does not match' } 
            })
        }
    });

app.route('/user/new')
    .get((req, res) => {
        res.render('register', {
            field: 'value'
        })
    })
    .post((req, res) => {
        // some debug info
        console.log(req.body);

        //loop through the dataset to see if username and email are unique
        unique_username = true;
        unique_email = true;

        for (const [key, values] of data){
            console.log(key)
            if(values.username === req.body.username)
                unique_username = false;
            if(values.email === req.body.email)
                unique_email = false;
        }

        //check passwords match
        if(req.body.password != req.body.verified_password){
            res.render('register', {
                alert: { level: 'danger', title: 'Registration Error', 
                    message: 'Passwords do not match' } 
            })
        }
        else if(!unique_email){
            res.render('register', {
                alert: { level: 'danger', title: 'Registration Error', 
                    message: 'Email already taken' } 
            })
        }
        else if(!unique_username){
            res.render('register', {
                alert: { level: 'danger', title: 'Registration Error', 
                    message: 'Username already taken' } 
            })
        }
        else{  
            //generate random uuid as user ID
            data.set(uuidv4(), {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                phone: req.phone_number
            })

            res.render('register', {
                alert: { level: 'success', title: 'Registration Success', 
                    message: 'New user account successfully made!' } 
            })
        }

    });


    //any route not routed give 404
    app.route('/*')
    .get((req, res) => {
        res.render('failed', {
            alert: { level: 'warning', title: '404 Not Found Error', 
                message: 'Resource not found' } 
        })
    });


app.listen(3000, () => {
    console.log('express app running at http://localhost:3000/')
    data.clear()
});

const express = require("express");
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const session = require("express-session");
const { v4: uuidv4 } = require('uuid');
const nocache = require('nocache');


const User = {
    email: "jasir@gmail.com",
    password: "1234"
};


const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(nocache());

app.set('view engine', 'ejs');

app.use('/static', express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: false,
    cookie : {maxAge : 300000}
}));




app.get('/', (req, res) => {
    if(req.session.user){
        res.redirect('/homePage')
      
    }else{
        res.render('base', { title: "Login System" })
    }
})




app.post('/login', (req, res) => {
    let isPassTrue = true;
    let isEmailTrue = true;
    
        if (req.body.email === User.email) {
            if (req.body.password === User.password) {
                req.session.user = req.body.email
                res.redirect('/homePage')
            } else {
                console.log("Password is not correct");
                isPassTrue = false;
                errorMessage = "Password is not correct";
                res.render('base', { error: errorMessage }); 
            }
        } else {
            errorMessage = "Email is not correct";
            isEmailTrue = false;
            res.render('base', { error: errorMessage });
        }
    
  
});


app.get('/homePage',(req,res) =>{
    if(req.session.user){
        res.render('homePage',{user:req.session.user})
    }else{
        res.redirect('/')
    }
}) 





app.get('/logout',(req, res)=>{
    req.session.destroy(function(err){
        if(err){
            console.log(err);
            res.send("Error");
        }else{
        
         
       res.redirect('/')

        }
    })
})


app.get('/anotherPage', (req, res) => {
    if(req.session.user){
        res.render('anotherPage', { title: "Another Page" });
    }else{
        res.redirect('/')  
    }

   
});

app.listen(port,()=> { console.log(`Server up http://localhost:${port}` ); })




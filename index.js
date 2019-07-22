const express =  require('express');
const helmet = require('helmet');
const cors = require('cors')
const bcrypt = require('bcryptjs')
const md5 = require('md5')

const Users = require('./users/users-model')

const server = express()

server.use(helmet());
server.use(express.json());
server.use(cors());



server.get('/api/users', restrictedAccess, async (req, res) =>{
    try{
        const users = await Users.find()
        res.status(200).json(users)
    }catch(error){
        res.status(500).json('Users not found')
    }
});

server.post('/api/register', validateUser, async (req, res)=>{
    const { password } = req.body;
    const hashed = bcrypt.hashSync(password, 16);
    req.body.password = hashed;
    try{
        const { id, username } = await Users.add(req.body);
        res.status(200).json({message: `Welcome in the Club ${username}`})
    }catch(error){
        res.status(401).json('Invalid inputs')
    }
})

server.post('/api/login', (req, res) => {

let { username, password } = req.body;

   Users.findBy({ username })
        .first()
        .then((user) =>{
        if (user && bcrypt.compareSync(password, user.password)) {
            res.status(200).json({ message: `Welcome ${user.username}!` });
          } else {
            res.status(401).json({ message: 'Invalid Credentials' });
          }
       }).catch(error =>{
           res.status(500).json(error)
       });
    
  });


  server.post("/api/sillyBcrypt", (req, res) => {
    const user = req.body;
    user.password = sillyBcrypt.hash(user.password, 12);
  
    Users.add(user)
      .then(success => {
        res.status(201).json(success);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });




  /// Middleware////



  function validateUser (req, res, next) {
    if (Object.keys(req.body).length !== 0 && req.body.constructor === Object) {
       if (req.body.username && req.body.password) {
          next();
       } else {
          res.status(400).json({ message: 'Required username and password fields' })
       }
    } else {
       res.status(400).json({ message: 'Missing user' })
    };
 }

 function restrictedAccess(req, res, next) {
    const { username, password } = req.headers;
  
    Users.findBy({ username })
      .first()
      .then(user => {
        if (!user || !bcrypt.compareSync(password, user.password)) {
          res.status(401).json({ message: "Please login" });
        } else {
          next();
        }
      })
      .catch(error => {
        next(new Error(error.message));
      });
  }


  const sillyBcrypt = {
    hash(password, cycles = 10, salty = "") {
      const salt = salty ? salty : new Date().getTime();
      let hash = password + salt;
      for (let i = 0; i < cycles; i++) {
        hash = md5(hash);
      }
      return `${hash}$${cycles}$${salt}`;
    },
    compare(password, storedPassword) {
      const chain = storedPassword.split("$");
      return this.hash(password, chain[1], chain[2]) === storedPassword;
    }
  };


const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));
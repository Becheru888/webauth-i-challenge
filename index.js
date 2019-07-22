const express =  require('express');
const helmet = require('helmet');
const cors = require('cors')
const bycrypt = require('bcryptjs')

const Users = require('./users/users-model')

const server = express()

server.use(helmet());
server.use(express.json());
server.use(cors());



server.get('/api/users', async (req, res) =>{
    try{
        const users = await Users.find()
        res.status(200).json(users)
    }catch(error){
        res.status(500).json('Users not found')
    }
});

server.post('/api/register', async (req, res)=>{
 let user = req.body
    try{
        user.password = bycrypt.hashSync(user.password, 12)
        Users.add(user)
        res.status(200).json('User added succesfuly!')
    }catch(error){
        res.status(500).json('Invalid inputs')
    }
})



const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));
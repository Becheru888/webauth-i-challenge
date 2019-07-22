const express =  require('express');
const helmet = require('helmet');
const cors = require('cors')
const bycrypt = require('bcryptjs')

const server = express()

server.use(helmet());
server.use(express.json());
server.use(cors());

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));
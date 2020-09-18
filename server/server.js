const express = require('express');
const app = express();
const router = require('./route');
const cors = require('cors');
const sequelize = require('./models').sequelize;

const bodyParser = require('body-parser');  

const cookieParser = require('cookie-parser');
sequelize.sync();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/', router);
app.use(cors());


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server On : http://localhost:${PORT}/`);
});



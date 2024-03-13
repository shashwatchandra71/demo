const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./model');
const routes = require('./routes');

const app = express();
const port = 3000;



app.use(bodyParser.json());
app.use(cors());
app.use(routes());

db.init().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port http://localhost:${port}`);
    });
});

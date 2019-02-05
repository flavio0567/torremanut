const express     = require('express');
const bodyParser  = require('body-parser');
const passport    = require('passport');
const mongoose    = require('mongoose');
const config      = require('./server/config/config');
const cors        = require('cors');
const port        = 5000;
const config_sql  = require('./server/config/config-sql');

const app         = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

app.use(passport.initialize());
var passportMiddleware = require('./server/middleware/passport');
passport.use(passportMiddleware);

app.get('/', function(req, res) {
    return res.send('Hello! API is running at http://localhost:' + port + '/api');
});

const routes = require('./server/config/routes');
app.use('/api', routes);

// MongoDB Configuration
mongoose.connect(config.db, { useNewUrlParser: true , useCreateIndex: true });

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB database connection established successfully!');
});

connection.on('error', (err) => {
    console.log('MongoDB database connection error. Please make syre MongoDB is running.' + err);
    process.exit();
});

// SQL SERVER Configuration

var Connection = require('tedious').Connection;

var connection_sql = new Connection(config_sql);
console.log('usuario:', config_sql);
connection_sql.on('connect', function(err) {
    if (err) {
        console.log('SQL SERVER error connecting:', err);
    } else {
        console.log('SQL SERVER connected!');
    }
    // console.log('SQL SERVER database connection established successfully!');
    // executeStatement();
  }
); 


app.listen(port);
console.log('Hello! App is running at http://localhost:' + port + '/api');

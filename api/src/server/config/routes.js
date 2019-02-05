const express        = require('express'),
      routes         = express.Router();
const userController = require('../controllers/user-controller');
const passport       = require('passport');

const sql_userController = require('../controllers/sql-user-controller');

routes.get('/', (req, res) => {
// routes.get('/', passport.authenticate('jwt', { session: false}), (req, res) => {
    return res.send('Hello, this is the API return');
} )

routes.post('/register', userController.registerUser);

// routes.post('/login', userController.loginUser);
routes.post('/login', sql_userController.executeStatement);


routes.get('/special', passport.authenticate('jwt', { session: false}), (req, res) => {
    return res.json({ msg: `Hey ${req.user.email}! I open at the close`});
} );

routes.get('/manut', passport.authenticate('jwt', { session: false}), (req, res) => {
    console.log('Heyyyyyyyy Im here!!!!!');
    return res.json({ msg: `Hey ${req.user.email}! Voce entrou !!! `});
} );

module.exports = routes;


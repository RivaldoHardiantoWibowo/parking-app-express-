const Router = require('express');
const UserController = require('./controller/userController.js');
const authenticate = require('./middleware/authenticate.js');
const ParkingController = require('./controller/parkingController.js');

const routes = new Router();

// Add routes
routes.post('/user', authenticate, UserController.store)
routes.get('/user', authenticate, UserController.get);
routes.get('/user/:id', authenticate, UserController.detail);
routes.put('/user/:id', authenticate, UserController.update)
routes.delete('/user/:id', authenticate, UserController.delete)
routes.post('/user/login',  UserController.login);
routes.post('/user/register', UserController.register);


// Parking routes
routes.post('/parking', authenticate, ParkingController.createParking);
routes.get('/parking', authenticate, ParkingController.getParking);
routes.put('/parking', authenticate, ParkingController.updateParking);

module.exports = routes;

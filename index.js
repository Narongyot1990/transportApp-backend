require('dotenv').config();
const express = require("express");
const cors = require("cors");
const http = require('http');
const socketIo = require('socket.io');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 8080;

const url2 =[/*'http://localhost:3000',*/ 'https://siamrapid.co.th']
const url = ['http://localhost:3000', 'https://siamrapid.co.th']

// Setup HTTP server and attach the express app
const server = http.createServer(app); 
const io = socketIo(server, {
    cors: {
        origin: ['http://localhost:3000', 'https://siamrapid.co.th'],
        methods: ['GET', 'POST'],
        credentials: true
    }
});

//MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = ['http://localhost:3000', 'https://siamrapid.co.th']
        if (!origin) return callback(null, true);  // Allow requests with no origin
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error('Not allowed by CORS'), false);
        }
        return callback(null, true);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
    optionsSuccessStatus: 200 
}));

//MONGODB DATABASE
const ConnectDB = require('./MongoDB/db');
ConnectDB();

//ROUTES
const publicRoutes = require('./Routes/PublicRoutes');
const authRoutes = require('./Routes/AunRoutes');
const profileRoutes = require('./Routes/Profile');
const driverRoutes = require('./Routes/Driver');
const truckRoutes = require('./Routes/Truck');
const orderRoutes = require('./Routes/Orders');
const orderLocationRoutes = require('./Routes/Orders.location');
const customerRoutes = require('./Routes/Customer');
const uploadImg = require('./Routes/UploadIMG');

app.use('/', publicRoutes);
app.use('/auth', authRoutes); //http://localhosts:8080/auth + /register, /login
app.use('/profile', profileRoutes); //http://localhosts:8080/profile + /:userId
app.use('/profile/:userId/gps-record', profileRoutes); 
app.use('/profile/:userId/driver', driverRoutes);
app.use('/profile/:userId/truck', truckRoutes);
app.use('/profile/:userId/order', orderRoutes);
app.use('/profile/:userId/order-location', orderLocationRoutes);
app.use('/profile/:userId/customer', customerRoutes);
app.use('/profile/:userId/uploads', uploadImg);

//SOCKET IO
let activeUsers = {};
let socketuserMap = {};


io.on("connection", (socket) => {
    const email = socket.handshake.query.email;
    console.log(`${email} connected`);

    socket.on("newLocation", (locationData) => {
        activeUsers[locationData.userId] = locationData
        socketuserMap[socket.id] = locationData.userId
        console.log("Received new location:",locationData);

        io.emit("activeUsersUpdate", activeUsers);
        console.log(activeUsers)
    });

    socket.on("disconnect", () => {
        console.log("Socket ID on disconnect:", socket.id); // 1.
        const DeleteuserId = socketuserMap[socket.id];
        if (DeleteuserId) {
            delete activeUsers[DeleteuserId]
            delete socketuserMap[socket.id];
        }
        io.emit("activeUsersUpdate", activeUsers);
    });
});

server.listen(PORT, () => {
    console.log(`Server starting on port ${PORT}`);
});
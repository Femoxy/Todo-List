const cors = require("cors")
// Define your custom CORS options here
const corsOptions = {
    origin: 'http://your-allowed-origin.com', // Replace with the actual origin(s) you want to allow
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
  };
  
  // Create the CORS middleware
  const corsMiddleware = cors(corsOptions);
  
  module.exports = corsMiddleware;
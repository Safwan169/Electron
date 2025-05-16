const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const dotenv = require('dotenv');
const mainRoute = require('./routes');
const configDB = require('./config/db');
const passport = require('./config/passport');

app.use(passport.initialize());
dotenv.config();

app.use(cors({origin:'*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api', mainRoute);


app.get('/', (req, res) => {
  res.send('E-commerce API is running!');
});

app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.stack}`);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Server error'
  });
});

async function startServer() {
  try {
     configDB();
    
    app.listen(port, () => {
      console.log(`E-commerce server is running on port ${port}`);
    });
  } catch (error) {
    console.error(`[FATAL] Failed to start server: ${error.message}`);
    process.exit(1);
  }
}

startServer();
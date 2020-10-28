// Load the environment variables.
require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');

// FCC testing.
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');

// Express app.
const app = express();

// Helmet middleware.
// app.use(helmet());

// Set static directory.
app.use('/public', express.static(process.cwd() + '/public'));

// FCC testing.
app.use(cors({origin: '*'}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static index.
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

// FCC testing.
fccTestingRoutes(app);

// Use 404 middleware.
app.use(function(req, res, next)
        {
          res.status(404)
            .type('text')
            .send('Not Found');
        });

// Run server and/or tests.
const port = process.env.PORT || 3000;
const name = 'fcc-qap-sudoku-solver@0.0.1';

app.listen(port, function ()
           {
             console.log(`${name} listening on port ${port}`);
             if (process.env.NODE_ENV ==='test')
             {
               console.log('Running tests...');
               setTimeout(function ()
                          {
                            try
                            {
                              runner.run();
                            }
                            catch (error)
                            {
                              console.log('Tests are not valid:');
                              console.error(error);
                            }
                          }, 1500);
             }
           });

// Export app for testing.
module.exports = app;

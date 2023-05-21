import mysql from 'mysql2';

const util = require('util');

const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        throw err;
    }

    console.log('Connected to MySQL successfully!');
});

const query = util.promisify(connection.query).bind(connection);

export default query;

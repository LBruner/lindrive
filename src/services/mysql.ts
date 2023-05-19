import mysql from 'mysql2';
const util = require('util');

const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

const query: any = util.promisify(connection.query).bind(connection);
export default query;

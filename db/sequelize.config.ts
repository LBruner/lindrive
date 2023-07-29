import {Sequelize} from "sequelize";
import * as dotenv from 'dotenv';

dotenv.config();

const {MYSQL_USER, MYSQL_DATABASE, MYSQL_PASSWORD} = process.env;
const sequelize = new Sequelize(MYSQL_DATABASE!, MYSQL_USER!, MYSQL_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

export default sequelize;
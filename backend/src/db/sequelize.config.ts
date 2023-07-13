import {Sequelize} from "sequelize";

const sequelize = new Sequelize(process.env.MYSQL_DATABASE!, process.env.MYSQL_USER!, process.env.MYSQL_ROOT_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

export default sequelize;
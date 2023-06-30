import {Sequelize} from 'sequelize';

const sequelizeConfig = new Sequelize(process.env.MYSQL_DATABASE!, process.env.MYSQL_USER!, process.env.MYSQL_ROOT_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
});

export default sequelizeConfig;

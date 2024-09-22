import session from 'express-session';
import MySQLStore from 'express-mysql-session';

const options = {
  host: process.env.MYSQL_HOST,
  port: 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

const mysql_store = new MySQLStore(options);

const mysql_session = session({
  secret: process.env.APP_SECRET,
  resave: false,
  saveUninitialized: true,
  store: mysql_store,
});

export default mysql_session;

const mysql = require('mysql'); // 文档

const pool = mysql.createPool({
  host: '134.175.49.243',
  user: 'root',
  password: 'SQL_pwd123456',
  database: 'net'
})

const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err)
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err)
          } else {
            resolve(rows)
          }
          connection.release()
        });
      }
    });
  });
}


module.exports = {
  query
}
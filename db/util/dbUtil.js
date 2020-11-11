const mysql = require("mysql");
const baseConfig = require("../../config/base");


const pool = mysql.createPool(baseConfig.database);

const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        resolve(err);
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
          connection.release();
        });
      }
    });
  });
}

const createTable = (sql) => {
  return query(sql, []);
}


const findDataById = (table, id) => {
  const _sql = "SELECT * FROM ?? WHERE id = ? ";
  return query(_sql, [table, id]);
}


const findDataByPage = (table, keys, start, end) => {
  const _sql = "SELECT ?? FROM ??  LIMIT ? , ?";
  return query(_sql, [keys, table, start, end]);
}


const insertData = (table, values) => {
  const _sql = "INSERT INTO ?? SET ?";
  return query(_sql, [table, values]);
}


const updateData = (table, values, id) => {
  const _sql = "UPDATE ?? SET ? WHERE id = ?";
  return query(_sql, [table, values, id]);
}


const deleteDataById = (table, id) => {
  const _sql = "DELETE FROM ?? WHERE id = ?";
  return query(_sql, [table, id]);
}


const select = (table, keys) => {
  const _sql = "SELECT ?? FROM ?? ";
  return query(_sql, [keys, table]);
}

const count = (table) => {
  const _sql = "SELECT COUNT(*) AS total_count FROM ?? ";
  return query(_sql, [table]);
}

module.exports = {
  query,
  createTable,
  findDataById,
  findDataByPage,
  deleteDataById,
  insertData,
  updateData,
  select,
  count,
}

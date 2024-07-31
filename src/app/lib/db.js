import mysql from 'mysql2/promise';

async function createDatabaseIfNotExists() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
  });

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.MYSQL_DATABASE}\``);
  } catch (error) {
    console.error("Error creating database:", error);
  } finally {
    await connection.end();
  }
}

export default async function executeQuery({ query, values }) {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
  });

  try {
    // Ensure the database exists before setting it in the config
    await createDatabaseIfNotExists();

    // Split queries by semicolons and filter out empty strings
    const queries = query.split(';').filter(Boolean);
    const results = [];

    for (const q of queries) {
      const [rows] = await connection.execute(q.trim(), values);
      results.push(rows);
    }

    return results;
  } catch (error) {
    return { error };
  } finally {
    await connection.end();
  }
}
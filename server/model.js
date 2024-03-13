const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres_user',
    host: 'localhost',
    database: 'db',
    password: 'admin',
    port: 5432,
});

async function init() {
    const client = await pool.connect();
    try {
        await client.query(`
        DROP TABLE IF EXISTS problems;

        CREATE TABLE IF NOT EXISTS problems (
          id SERIAL PRIMARY KEY,
          type INTEGER,
          sub_type INTEGER,
          count INTEGER DEFAULT 0
        );
      `);

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 5; j++) {
                await client.query(`
            INSERT INTO problems (type, sub_type) VALUES ($1, $2);
          `, [i, j]);
            }
        }
    } finally {
        client.release();
    }
}

async function create() {
    const client = await pool.connect();
    try {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 5; j++) {
                await client.query(`
    INSERT INTO problems (type, sub_type) VALUES ($1, $2);
  `, [i, j]);
            }
        }
    } finally {
        client.release();
    }
}

async function getProblems() {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM problems');
        return result.rows;
    } finally {
        client.release();
    }
}

async function updateProblem(issueType, subType) {
    const client = await pool.connect();
    try {
        await client.query('UPDATE problems SET count = count + 1 WHERE type = $1 AND sub_type = $2', [issueType, subType]);
    } finally {
        client.release();
    }
}

async function decrementProblem(issueType, subType) {
    const client = await pool.connect();
    try {
        // fetch problems where count > 0 and type = issueType and sub_type = subType
        const res = await client.query('SELECT * FROM problems WHERE type = $1 AND sub_type = $2', [issueType, subType]);
        await client.query('UPDATE problems SET count = count - 1 WHERE count > 0 AND type = $1 AND sub_type = $2', [issueType, subType]);
    } finally {
        client.release();
    }
}

module.exports = {
    init,
    create,
    getProblems,
    updateProblem,
    decrementProblem,
    pool
};

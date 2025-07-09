/* eslint-disable linebreak-style */
const { Pool } = require('pg');
const BadRequestError = require('../../exceptions/BadRequestError');
const AuthenticationError = require('../../exceptions/AuthenticationError');
const bcrypt = require('bcrypt');

class UserService {
  constructor() {
    this._pool = new Pool();
  }

  async insertUser({ id, username, password, fullname }) {
    await this.verifyNewUsername(username);

    const query = {
      text: 'INSERT INTO users VALUES ($1, $2, $3, $4) RETURNING id',
      values: [id, username, password, fullname],
    };

    const { rows, rowCount } = await this._pool.query(query);
    if (!rowCount){
      throw new BadRequestError('Gagal menambahkan user');
    }

    return rows[0].id;
  }

  async verifyUserCredential(username, password){
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };

    const { rows, rowCount } = await this._pool.query(query);
    if (!rowCount){
      throw new AuthenticationError('Kredensial yang anda berikan salah');
    }

    const { id, password: hashedPassword } = rows[0];
    const match = await bcrypt.compare(password, hashedPassword);

    if (!match){
      throw new AuthenticationError('Kredensial yang anda berikan salah');
    }

    return id;
  }

  async verifyNewUsername(username){
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const { rowCount } = await this._pool.query(query);

    if (rowCount > 0){
      throw new BadRequestError('Username sudah digunakan');
    }
  }
}

module.exports = UserService;
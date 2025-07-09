/* eslint-disable linebreak-style */
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');

class UsersHandler {
  constructor(service, validator){
    this._service = service;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
  }

  async postUserHandler(request, h){
    this._validator.validatePayload(request.payload);

    const { username, password, fullname } = request.payload;
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await this._service.insertUser({ id, username, password: hashedPassword, fullname });

    const response = h.response({
      status: 'success',
      data: {
        userId,
      }
    });
    response.code(201);

    return response;
  }
}

module.exports = UsersHandler;
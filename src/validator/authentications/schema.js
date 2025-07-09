/* eslint-disable linebreak-style */
const Joi = require('joi');

const PostAuthenticationPayload = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const PutAuthenticationPayload = Joi.object({
  refreshToken: Joi.string().required(),
});

const DeleteAuthenticationPayload = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = {
  PostAuthenticationPayload,
  PutAuthenticationPayload,
  DeleteAuthenticationPayload,
};
const Joi = require('joi');

const PlaylistSchema = Joi.object({
  name: Joi.string().required(),
});

const PlaylistSongSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = { PlaylistSchema, PlaylistSongSchema };
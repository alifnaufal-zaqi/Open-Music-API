const mapDBToModel = ({
  id,
  album_id,
  title,
  year,
  performer,
  genre,
  duration,
}) => ({
  id,
  albumId: album_id,
  title,
  year,
  performer,
  genre,
  duration,
});

module.exports = { mapDBToModel };

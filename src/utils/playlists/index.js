const mapDBToModel = ({ id, name, owner }) => ({ id, name, username: owner });

module.exports = { mapDBToModel };
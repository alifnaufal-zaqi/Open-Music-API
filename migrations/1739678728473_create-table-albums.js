/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("albums", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    name: {
      type: "VARCHAR(100)",
      notNull: true,
    },
    year: {
      type: "INTEGER",
      notNull: true,
    },
  });

  pgm.createTable("songs", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    album_id: {
      type: "VARCHAR(50)",
      notNull: false,
      references: `"albums"(id)`,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    title: {
      type: "VARCHAR(100)",
      notNull: true,
    },
    year: {
      type: "INTEGER",
      notNull: true,
    },
    performer: {
      type: "VARCHAR(30)",
      notNull: true,
    },
    genre: {
      type: "VARCHAR(20)",
      notNull: true,
    },
    duration: {
      type: "INTEGER",
      notNull: true,
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("songs");
  pgm.dropTable("albums");
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('users', function (table) {
      table.increments('id')
      table.string('eid', 20).unique().notNullable()
      table.string('name', 255).notNullable()
      table.string('refresh_token', 255)
      table.timestamps()
    })
    .createTable('roles', function (table) {
      table.increments('id')
      table.string('name', 255).unique().notNullable()
      table.timestamps()
    })
    .createTable('user_roles', function (table) {
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table
        .integer('role_id')
        .unsigned()
        .references('id')
        .inTable('roles')
        .onDelete('CASCADE')
      table.primary(['user_id', 'role_id'])
      table.timestamps()
    })
    .createTable('districts', function (table) {
      table.increments('id')
      table.string('name', 255).unique().notNullable()
      table.integer('usd').unsigned().nullable()
      table.string('url', 255)
      table.timestamps()
    })
    .createTable('teachers', function (table) {
      table.increments('id')
      table.string('name', 255).notNullable()
      table.string('email', 255).notNullable()
      table.string('eid', 255)
      table.string('wid', 9)
      table.timestamps()
    })
    .createTable('teacher_districts', function (table) {
      table
        .integer('teacher_id')
        .unsigned()
        .references('id')
        .inTable('teachers')
        .onDelete('CASCADE')
      table
        .integer('district_id')
        .unsigned()
        .references('id')
        .inTable('districts')
        .onDelete('CASCADE')
      table.primary(['teacher_id', 'district_id'])
      table.timestamps()
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTable('teacher_districts')
    .dropTable('teachers')
    .dropTable('districts')
    .dropTable('user_roles')
    .dropTable('roles')
    .dropTable('users')
  
};

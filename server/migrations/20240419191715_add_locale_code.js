/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable('districts', function (table) {
    table.integer('locale').unsigned().nullable()
    table.dropColumn('town')
    table.dropColumn('suburban')
    table.dropColumn('urban')
    table.dropColumn('rural')
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable('districts', function (table) {
    table.dropColumn('locale')
    table.boolean('rural').defaultTo(false)
    table.boolean('urban').defaultTo(false)
    table.boolean('suburban').defaultTo(false)
    table.boolean('town').defaultTo(false)
  })
}
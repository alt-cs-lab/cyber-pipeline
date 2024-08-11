/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
  await knex('roles')
    .insert([
      {
        id: 2,
        name: 'user',
        created_at: now,
        updated_at: now,
        created_by: 'test-admin',
        updated_by: 'test-admin',
      },
    ])
    .onConflict('id')
    .ignore()
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex('roles').where('id', 2).del()
}

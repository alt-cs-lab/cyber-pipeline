/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
  var then = new Date(now)
  then.setMinutes(then.getMinutes() - 5)

  // Users
  await knex('users').del()
  await knex('users').insert([
    {
      id: 1,
      eid: 'test-admin',
      name: 'Test Administrator',
      created_at: now,
      updated_at: now,
    },
  ])

  // Roles
  await knex('roles').del()
  await knex('roles').insert([
    {
      id: 1,
      name: 'admin',
      created_at: now,
      updated_at: now,
    },
  ])

  // User Roles
  await knex('user_roles').del()
  await knex('user_roles').insert([
    {
      user_id: '1',
      role_id: '1',
      created_at: now,
      updated_at: now,
    },
  ])

  // Districts
  await knex('districts').del()
  await knex('districts').insert([
    {
      id: 1,
      usd: '380',
      name: 'Vermillion',
      url: 'https://www.usd380.com/',
      created_at: now,
      updated_at: now,
    },
    {
      id: 2,
      usd: '501',
      name: 'Topeka',
      url: 'https://www.topekapublicschools.net/',
      created_at: now,
      updated_at: now,
    },
  ])

  // Teachers
  await knex('teachers').del()
  await knex('teachers').insert([
    {
      id: 1,
      name: 'Russell Feldhausen',
      email: 'russfeld_2166@yahoo.com',
      eid: 'russfeld',
      wid: '835203884',
      district_id: 1,
      created_at: now,
      updated_at: now,
    },
    {
      id: 2,
      name: 'Joshua Weese',
      email: 'weeser@ksu.edu',
      eid: 'weeser',
      wid: '123456789',
      district_id: 2,
      created_at: now,
      updated_at: now,
    },
  ])

  // Teacher Districts
  await knex('teacher_districts').del()
  await knex('teacher_districts').insert([
    {
      teacher_id: '1',
      district_id: '1',
      created_at: now,
      updated_at: now,
    },
    {
      teacher_id: '1',
      district_id: '2',
      created_at: now,
      updated_at: now,
    },
    {
      teacher_id: '2',
      district_id: '2',
      created_at: now,
      updated_at: now,
    },
  ])
}

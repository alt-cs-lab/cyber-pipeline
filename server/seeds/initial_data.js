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
      created_by: 'test-admin',
      updated_by: 'test-admin',
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
      created_by: 'test-admin',
      updated_by: 'test-admin',
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
      created_by: 'test-admin',
      updated_by: 'test-admin',
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
      rural: true,
      urban: false,
      suburban: false,
      town: false,
      notes: 'Vermillion notes',
      created_at: now,
      updated_at: now,
      created_by: 'test-admin',
      updated_by: 'test-admin',
    },
    {
      id: 2,
      usd: '501',
      name: 'Topeka',
      url: 'https://www.topekapublicschools.net/',
      rural: false,
      urban: true,
      suburban: true,
      town: false,
      notes: 'Topeka notes',
      created_at: now,
      updated_at: now,
      created_by: 'test-admin',
      updated_by: 'test-admin',
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
      status: 1,
      pd_status: 1,
      cert_status: 1,
      ms_status: 1,
      notes: 'Russell notes',
      created_at: now,
      updated_at: now,
      created_by: 'test-admin',
      updated_by: 'test-admin',
    },
    {
      id: 2,
      name: 'Joshua Weese',
      email: 'weeser@ksu.edu',
      eid: 'weeser',
      wid: '123456789',
      district_id: 2,
      status: 0,
      pd_status: 0,
      cert_status: 0,
      ms_status: 0,
      notes: 'Joshua notes',
      created_at: now,
      updated_at: now,
      created_by: 'test-admin',
      updated_by: 'test-admin',
    },
  ])

  // Teacher Districts
  await knex('teacher_districts').del()
  await knex('teacher_districts').insert([
    {
      teacher_id: '1',
      district_id: '1',
      notes: 'Teacher 1 in District 1',
      created_at: now,
      updated_at: now,
      created_by: 'test-admin',
      updated_by: 'test-admin',
    },
    {
      teacher_id: '1',
      district_id: '2',
      notes: 'Teacher 1 in District 2',
      created_at: now,
      updated_at: now,
      created_by: 'test-admin',
      updated_by: 'test-admin',
    },
    {
      teacher_id: '2',
      district_id: '2',
      notes: 'Teacher 2 in District 2',
      created_at: now,
      updated_at: now,
      created_by: 'test-admin',
      updated_by: 'test-admin',
    },
  ])
}

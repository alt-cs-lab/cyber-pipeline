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
    {
      id: 2,
      eid: 'russfeld',
      name: 'Russell Feldhausen',
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
    {
      user_id: '2',
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
      status: 1,
      pd_status: 1,
      cert_status: 1,
      ms_status: 1,
      grade_level: 'high school 9-12',
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
      status: 0,
      pd_status: 0,
      cert_status: 0,
      ms_status: 0,
      grade_level: 'middle school 6-8',
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
      district_id: '2',
      notes: 'Teacher 1 in District 2',
      primary: false,
      created_at: now,
      updated_at: now,
      created_by: 'test-admin',
      updated_by: 'test-admin',
    },
    {
      teacher_id: '2',
      district_id: '1',
      notes: 'Teacher 2 in District 1',
      primary: true,
      created_at: now,
      updated_at: now,
      created_by: 'test-admin',
      updated_by: 'test-admin',
    },
    {
      teacher_id: '1',
      district_id: '1',
      notes: 'Teacher 1 in District 1',
      primary: true,
      created_at: now,
      updated_at: now,
      created_by: 'test-admin',
      updated_by: 'test-admin',
    },
  ])

  // Cohocrts
  await knex('cohorts').del()
  await knex('cohorts').insert([
    {
      id: 1,
      name: 'Spring 2023',
      notes: 'PACK grant funded cohort',
      created_at: now,
      updated_at: now,
      created_by: 'test-admin',
      updated_by: 'test-admin',
    },
  ])

  // Teacher Cohorts
  await knex('teacher_cohorts').del()
  await knex('teacher_cohorts').insert([
    {
      teacher_id: '1',
      cohort_id: '1',
      notes: 'Teacher 1 in Cohort 1',
      created_at: now,
      updated_at: now,
      created_by: 'test-admin',
      updated_by: 'test-admin',
    },
    {
      teacher_id: '2',
      cohort_id: '1',
      notes: 'Teacher 2 in Cohort 1',
      created_at: now,
      updated_at: now,
      created_by: 'test-admin',
      updated_by: 'test-admin',
    },
  ])

  // Courses
  await knex('courses').del()
  await knex('courses').insert([
    {
      id: 1,
      name: 'CC 710 S23',
      notes: 'First offering under new CC 710 heading',
      created_at: now,
      updated_at: now,
      created_by: 'test-admin',
      updated_by: 'test-admin',
    },
  ])

  // Teacher Courses
  await knex('teacher_courses').del()
  await knex('teacher_courses').insert([
    {
      teacher_id: '1',
      course_id: '1',
      grade: 'A',
      incomplete: false,
      notes: 'Teacher 1 in Course 1',
      created_at: now,
      updated_at: now,
      created_by: 'test-admin',
      updated_by: 'test-admin',
    },
    {
      teacher_id: '2',
      course_id: '1',
      grade: 'I',
      incomplete: true,
      notes: 'Teacher 2 in Course 1',
      created_at: now,
      updated_at: now,
      created_by: 'test-admin',
      updated_by: 'test-admin',
    },
  ])
}

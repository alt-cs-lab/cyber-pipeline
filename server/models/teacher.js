const Model = require('./base')

/**
 * @swagger
 * components:
 *   schemas:
 *     Teacher:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         id:
 *           type: integer
 *           description: autogenerated id
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *           description: the teacher's name
 *         email:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *           format: email
 *           description: the teacher's email address
 *         eid:
 *           type: string
 *           minLength: 3
 *           maxLength: 20
 *           description: K-State eID of the teacher
 *         wid:
 *           type: string
 *           minLength: 9
 *           maxLength: 9
 *           description: the K-State Wildcat ID of the teacher
 *         status:
 *           type: integer
 *           description: status of the teacher (0 new, 1 active, 2 inactive, 3 complete)
 *         pd_status:
 *           type: integer
 *           description: status of the teacher's professional development (0 new, 1 active, 2 inactive, 3 complete)
 *         cert_status:
 *           type: integer
 *           description: status of the teacher's certification (0 new, 1 active, 2 inactive, 3 complete)
 *         ms_status:
 *           type: integer
 *           description: status of the teacher's master's degree (0 new, 1 active, 2 inactive, 3 complete)
 *         grade_level:
 *           type: string
 *           description: the grade level of the teacher
 *         notes:
 *           type: string
 *           description: notes about the teacher
 *         districts:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: autogenerated id
 *               name:
 *                 type: string
 *                 description: the name of the district
 *               usd:
 *                 type: integer
 *                 description: the USD number of the district
 *               notes:
 *                 type: string
 *                 description: notes about the teacher in the district
 *               primary:
 *                 type: boolean
 *                 description: is this the primary district for the teacher?
 *         cohorts:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: autogenerated id
 *               name:
 *                 type: string
 *                 description: the name of the cohort
 *               notes:
 *                 type: string
 *                 description: notes about the teacher in the cohort
 *         courses:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: autogenerated id
 *               name:
 *                 type: string
 *                 description: the name of the course
 *               notes:
 *                 type: string
 *                 description: notes about the teacher in the course
 *               grade:
 *                 type: string
 *                 description: grade for the teacher in the course
 *               incomplete:
 *                 type: boolean
 *                 description: is the course incomplete?
 *       example:
 *         id: 1
 *         name: Test Teacher
 *         email: test@distrct.com
 *         eid: test-teacher
 *         wid: "000000000"
 *         status: 1
 *         pd_status: 1
 *         cert_status: 0
 *         ms_status: 0
 *         grade_level: high school 9-12
 *         notes: This is a test teacher
 *         districts:
 *           - id: 1
 *             name: School District
 *             usd: 123
 *             notes: Teacher 1 in District 1
 *             primary: true
 *           - id: 2
 *             name: School District 2
 *             usd: 456
 *             notes: Teacher 1 in District 2
 *             primary: false
 *         cohorts:
 *           - id: 1
 *             name: Spring 2023
 *             notes: Started cohort on time
 *         courses:
 *           - id: 1
 *             name: CC 710 S23
 *             notes: Teacher is doing well
 *             grade: A
 *             incomplete: false
 */
class Teacher extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'teachers'
  }

  // Each model must have a column (or a set of columns) that uniquely
  // identifies the rows. The column(s) can be specified using the `idColumn`
  // property. `idColumn` returns `id` by default and doesn't need to be
  // specified unless the model's primary key is something else.
  static get idColumn() {
    return 'id'
  }

  // Methods can be defined for model classes just as you would for
  // any JavaScript class. If you want to include the result of these
  // methods in the output json, see `virtualAttributes`.
  //fullName() {
  //  return this.firstName + ' ' + this.lastName;
  //}

  // Optional JSON schema. This is not the database schema!
  // No tables or columns are generated based on this. This is only
  // used for input validation. Whenever a model instance is created
  // either explicitly or implicitly it is checked against this schema.
  // See http://json-schema.org/ for more info.
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],

      properties: {
        name: { type: 'string', minLength: 1, maxLength: 255 },
        email: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
          format: 'email',
        },
        eid: { type: 'string', minLength: 3, maxLength: 20 },
        wid: { type: 'string', minLength: 9, maxLength: 9 },
        status: { type: 'integer', minimum: 0, maximum: 3 },
        pd_status: { type: 'integer', minimum: 0, maximum: 3 },
        cert_status: { type: 'integer', minimum: 0, maximum: 3 },
        ms_status: { type: 'integer', minimum: 0, maximum: 3 },
        grade_level: { type: 'string' },
      },
    }
  }

  // This object defines the relations to other models.
  static get relationMappings() {
    // Importing models here is one way to avoid require loops.
    const District = require('./district')
    const Cohort = require('./cohort')
    const Course = require('./course')

    return {
      districts: {
        relation: Model.ManyToManyRelation,
        modelClass: District,
        join: {
          from: 'teachers.id',
          // ManyToMany relation needs the `through` object
          // to describe the join table.
          through: {
            // If you have a model class for the join table
            // you need to specify it like this:
            // modelClass: TeacherDistrict,
            from: 'teacher_districts.teacher_id',
            extra: ['notes', 'primary'],
            to: 'teacher_districts.district_id',
          },
          to: 'districts.id',
        },
        filter: (builder) =>
          builder.select(
            'id',
            'name',
            'usd',
            'teacher_districts.notes',
            'teacher_districts.primary'
          ),
      },
      cohorts: {
        relation: Model.ManyToManyRelation,
        modelClass: Cohort,
        join: {
          from: 'teachers.id',
          // ManyToMany relation needs the `through` object
          // to describe the join table.
          through: {
            // If you have a model class for the join table
            // you need to specify it like this:
            // modelClass: PersonMovie,
            from: 'teacher_cohorts.teacher_id',
            extra: ['notes'],
            to: 'teacher_cohorts.cohort_id',
          },
          to: 'cohorts.id',
        },
        filter: (builder) =>
          builder.select('id', 'name', 'teacher_cohorts.notes'),
      },
      courses: {
        relation: Model.ManyToManyRelation,
        modelClass: Course,
        join: {
          from: 'teachers.id',
          // ManyToMany relation needs the `through` object
          // to describe the join table.
          through: {
            // If you have a model class for the join table
            // you need to specify it like this:
            // modelClass: PersonMovie,
            from: 'teacher_courses.teacher_id',
            extra: ['notes', 'grade', 'incomplete'],
            to: 'teacher_courses.course_id',
          },
          to: 'courses.id',
        },
        filter: (builder) =>
          builder.select(
            'id',
            'name',
            'teacher_courses.notes',
            'grade',
            'incomplete'
          ),
      },
    }
  }
}

module.exports = Teacher

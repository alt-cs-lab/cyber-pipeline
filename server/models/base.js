const db = require('../configs/db.js')
const Model = require('objection').Model
const AjvValidator = require('objection').AjvValidator
const addFormats = require('ajv-formats')
Model.knex(db)

class BaseModel extends Model {
  $beforeInsert() {
    this.created_at = new Date().toISOString().slice(0, 19).replace('T', ' ')
  }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ')
  }

  static get useLimitInFirst() {
    return true
  }

  static createValidator() {
		return new AjvValidator({
			onCreateAjv: (ajv) => {
				addFormats(ajv);
			},
      options: {
        coerceTypes: true
      }
			/* options: {
				allErrors: true,
				validateSchema: false,
				ownProperties: true,
				v5: true,
			}, */
		});
	}
}

module.exports = BaseModel

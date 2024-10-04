import db from '../configs/db.js'; // Ensure you include .js extension
import { Model, AjvValidator } from 'objection';
import addFormats from 'ajv-formats';
import { asyncLocalStorage } from '../middlewares/db-audit.js'; // Ensure you include .js extension

Model.knex(db);

class BaseModel extends Model {
  $beforeInsert() {
    this.created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const eid = asyncLocalStorage.getStore();
    this.created_by = eid !== undefined ? eid : 'system';
  }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const eid = asyncLocalStorage.getStore();
    this.updated_by = eid !== undefined ? eid : 'system';
  }

  static get useLimitInFirst() {
    return true;
  }

  static createValidator() {
    return new AjvValidator({
      onCreateAjv: (ajv) => {
        addFormats(ajv);
      },
      options: {
        coerceTypes: true,
      },
    });
  }
}

export default BaseModel;

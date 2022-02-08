import { parseISO } from 'date-fns';

class Sprint {
  constructor(obj) {
    this.id = obj.id;
    this.active = obj.active;
    this.closed = obj.closed;
    this.description = obj.description;
    this.dueDatetime = obj.dueDatetime;
    this.name = obj.name;
    this.projectId = obj.projectId;
    this.startDatetime = obj.startDatetime;
  }

  static fromJson(obj) {
    const values = {
      id: obj.id,
      active: obj.active,
      closed: obj.closed,
      description: obj.description,
      dueDatetime: obj.due_datetime,
      name: obj.name,
      projectId: obj.project_id,
      startDatetime: obj.start_datetime,
    }

    return new Sprint(values)
  }

  fromJsonProperties(obj) {
    const values = {
      id: obj.id,
      active: obj.active,
      closed: obj.closed,
      description: obj.description,
      dueDatetime: obj.due_datetime,
      name: obj.name,
      projectId: obj.project_id,
      startDatetime: obj.start_datetime,
    }

    return values
  }

  toJson() {
    const values = {
      description: this.description,
      due_datetime: parseISO(this.dueDatetime).toISOString(),
      name: this.name,
      start_datetime: parseISO(this.startDatetime).toISOString()
    }

    return values;
  }

  updateAttrsFromJson(obj) {
    Object.assign(this, this.fromJsonProperties(obj))
  }

  changeAttr(attr, value) {
    this[attr] = value;
  }
}

export default Sprint;
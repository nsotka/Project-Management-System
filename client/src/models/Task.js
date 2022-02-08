import User from "./User";

class Task {
  constructor(obj) {
    this.id = obj.id;
    this.title = obj.title;
    this.taskCategoryId = obj.taskCategoryId;
    this.sprintId = obj.sprintId;
    this.status = obj.status;
    this.users = obj.users;
  }

  static fromJson(obj) {
    const values = {
      id: obj.id,
      title: obj.title,
      taskCategoryId: obj.task_category_id,
      sprintId: obj.sprint_id,
      status: obj.status,
      users: obj.users.map((user) => User.fromJson(user)),
    }

    return new Task(values)
  }

  fromJsonProperties(obj) {
    const values = {
      id: obj.id,
      title: obj.title,
      taskCategoryId: obj.task_category_id,
      sprintId: obj.sprint_id,
      status: obj.status,
      users: obj.users.map((user) => User.fromJson(user)),
    }

    return values
  }

  toJson() {
    const values = {
      title: this.title,
      task_category_id: this.taskCategoryId,
      sprint_id: this.sprintId,
      status: this.status,
      user_ids: this.users?.map((user) => user.id)
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

export default Task;
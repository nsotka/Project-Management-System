import Invitation from "./Invitation";
import Sprint from "./Sprint";
import Task from "./Task";
import User from "./User";

class Project {
  constructor(obj) {
    this.id = obj.id;
    this.title = obj.title;
    this.description = obj.description;
    this.active = obj.active;
    this.sprints = obj.sprints;
    this.members = obj.members;
    this.tasks = obj.tasks;
    this.openInvitations = obj.openInvitations;
  }

  static fromJson(obj) {
    const values = {
      id: obj.id,
      title: obj.title,
      description: obj.description,
      active: obj.active,
      sprints: obj.sprints.map((sprint) => Sprint.fromJson(sprint)),
      members: obj.members.map((member) => User.fromJson(member)),
      tasks: obj.tasks.map((task) => Task.fromJson(task)),
      openInvitations: obj.open_invitations.map((invitation) => Invitation.fromJson(invitation))
    }
    return new Project(values)
  }

  toJson() {
    const values = {
      id: this.id,
      title: this.title,
      description: this.description,
    }

    return values;
  }
}

export default Project;
import User from "./User";

class Invitation {
  constructor(obj) {
    this.id = obj.id;
    this.title = obj.title;
    this.user = obj.user;
  }

  static fromJson(obj) {
    const values = {
      id: obj.id,
      title: obj.project_title,
      invitationAccepted: obj.invitation_accepted,
      user: User.fromJson(obj.user)
    }
    
    return new Invitation(values)
  }

  toJson() {
    const values = {
      id: this.id,
      invitation_accepted: this.invitationAccepted,
    }

    return values;
  }
}

export default Invitation;
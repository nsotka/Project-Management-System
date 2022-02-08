import Invitation from "./Invitation";

class User {
  constructor(obj) {
    this.id = obj.id;
    this.email = obj.email;
    this.firstName = obj.firstName;
    this.lastName = obj.lastName;
    this.role = obj.role;

    if (obj.invitations) {
      this.invitations = obj.invitations;
    }
  }

  static fromJson(obj) {
    const values = {
      id: obj.id,
      email: obj.email,
      firstName: obj.first_name,
      lastName: obj.last_name,
      role: obj.role,
    }

    if (obj.private) {
      values.invitations = obj.private.invitations.map((invitation) => Invitation.fromJson(invitation))
    }

    return new User(values)
  }

  toJson() {
    const values = {
      id: this.id,
      email: this.email,
      first_name: this.firstName,
      last_name: this.lastName,
    }

    return values;
  }
}

export default User;
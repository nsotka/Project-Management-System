import { action, makeAutoObservable, runInAction } from "mobx";
import i18n from "../i18n";
import User from "../models/User";

class UiStore {

  currentUser = null;
  projectMethod = null;
  openProjectModal = false;
  sprintMethod = null;
  openSprintModal = false;
  currentSprint = null;
  taskMethod = null;
  openTaskModal = false;
  currentTask = null;
  openActionModal = false;
  loggedIn = localStorage.getItem('Auth') ? true : false;
  currentLanguage = i18n.language;

  constructor(rootStore) {
    this.rootStore = rootStore;
    this.requests = rootStore.requests;
    this.projectStore = rootStore.projectStore
    makeAutoObservable(this);
  }

  toggleProjectModal(method) {
    this.projectMethod = method;
    this.openProjectModal = !this.openProjectModal;
  }

  toggleSprintModal = action((method = null, sprint = null) => {
    this.sprintMethod = method;
    this.currentSprint = sprint;
    this.openSprintModal = !this.openSprintModal;
  })

  toggleTaskModal = action((method = null, task = null) => {
    this.taskMethod = method;
    this.currentTask = task;
    this.openTaskModal = !this.openTaskModal;
  })

  toggleActionModal = action((task = null) => {
    this.currentTask = task;
    this.openActionModal = !this.openActionModal;
  })

  getCurrentUserData = action(async () => {

    this.rootStore.requests.user.me().then((userData) => {
      const user = User.fromJson(userData);
      runInAction(() => {
        this.currentUser = user;
      })
    })

  })

  login = action(() => {
    this.getCurrentUserData()
    this.loggedIn = true;
  })

  logout = action(() => {
    localStorage.removeItem('Auth');
    runInAction(() => {
      this.rootStore.requests.login.delete().then((resp) => console.log('logout resp', resp));
      this.loggedIn = false;
    })
  })

  changeLanguage = action((lang) => {
    i18n.changeLanguage(lang, (err) => {
      if (err) return console.log('Failed to change lang', err);
    }).then(this.currentLanguage = lang);
  })

  acceptInvitation = action(async (membershipId) => {
    return this.requests.membership.acceptInvitation(membershipId).then((accepted) => {
      const invitations = this.currentUser.invitations.filter((invitation) => invitation.id !== accepted.membership.id)

      runInAction(() => {
        this.currentUser = { ...this.currentUser, invitations: [...invitations] }
      })
      
      this.rootStore.projectStore.addAcceptedProject(accepted.project)
    })
  })

  denyInvitation = action(async (membershipId) => {
    return this.requests.membership.denyInvitation(membershipId).then((denyInvitation) => {
      const invitations = this.currentUser.invitations.filter((invitation) => invitation.id !== denyInvitation.id)

      runInAction(() => {
        this.currentUser = { ...this.currentUser, invitations: [...invitations] }
      })
    })
  })
}

export default UiStore;
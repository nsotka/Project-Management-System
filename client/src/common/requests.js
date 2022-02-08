class Requests {

  rootPath = "http://localhost:3001/api/"

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  CheckError = (response) => {
    if (response.ok) {
      return response;
    } else {
      if (response.status === 401) {
        this.rootStore.uiStore.logout()
      }
      try {
        let error = new Error(`${response.statusText}`);
        error.response = response;
        throw error;
      } catch (e) {
        console.error(e.name + ': ' + e.message)
      }
      return response
    }
  }

  parseJSON = res => {
    if (res) {
      const resp = res.json()
      return resp
    }
  };

  saveToken = res => {
    if (res.ok && res.headers) {
      localStorage.setItem('Auth', res.headers.get('Authorization'))
    }

    return res
  }

  actions = {
    login: (url, data) =>
      fetch(this.rootPath + url, this.requestParams('post', data))
        .then(this.CheckError)
        .then(this.saveToken)
        .then(this.parseJSON),

    get: (url) =>
      fetch(this.rootPath + url, this.requestParams('get'))
        .then(this.CheckError)
        .then(this.parseJSON),

    post: (url, data) =>
      fetch(this.rootPath + url, this.requestParams('post', data))
        .then(this.CheckError)
        .then(this.parseJSON),

    update: (url, data) =>
      fetch(this.rootPath + url, this.requestParams('put', data))
        .then(this.CheckError)
        .then(this.parseJSON),

    del: (url, data) =>
      fetch(this.rootPath + url, this.requestParams('delete', data))
        .then(this.CheckError)
        .then(this.parseJSON),
  }

  requestParams = (method, data = null) => {
    if (data) {
      return (
        {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': localStorage.getItem('Auth'),
          },
          body: JSON.stringify({
            ...data,
          })
        }
      )
    } else {
      return (
        {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': localStorage.getItem('Auth'),
          },
        }
      )
    }
  }

  login = {
    create: (email, password) => this.actions.login('login/', {
      user: {
        email,
        password,
      }
    }),
    delete: () => this.actions.del('logout/')
  }
  membership = {
    acceptInvitation: (membershipId) => this.actions.update(`memberships/${membershipId}/accept`),
    denyInvitation: (membershipId) => this.actions.update(`memberships/${membershipId}/deny`),
    changeActiveProject: (projectId) => this.actions.post('memberships/change_active_project', {
      project_id: projectId
    }),
    addMembers: (members) => this.actions.post('memberships/add_members', {
      members: members
    }),
    deleteInvitation: (invitationId) => this.actions.del(`memberships/${invitationId}`)
  }
  project = {
    getUserProjects: () => this.actions.get('projects/'),
    create: (project) => this.actions.post('projects/', {
      project: project.toJson(),
    }),
  }
  sprint = {
    create: (sprint) => this.actions.post(`projects/${sprint.projectId}/sprints`, {
      sprint: sprint.toJson(),
    }),
    update: (sprint) => this.actions.update(`projects/${sprint.projectId}/sprints/${sprint.id}`, {
      sprint: sprint.toJson(),
    }),
    delete: (sprint) => this.actions.del(`projects/${sprint.projectId}/sprints/${sprint.id}`),
    changeActiveStatus: (projectId, sprintId) => this.actions.update(`projects/${projectId}/sprints/${sprintId}/change_active_status`),
    changeClosedStatus: (projectId, sprintId) => this.actions.update(`projects/${projectId}/sprints/${sprintId}/change_closed_status`),
  }
  taskCategory = {
    getTaskCategories: (projectId) => this.actions.post('task_categories/get_project_categories', {
      project_id: projectId
    })
  }
  role = {
    getRoles: () => this.actions.get('roles/')
  }
  task = {
    create: (task) => this.actions.post('tasks/', {
      task: task.toJson(),
    }),
    update: (taskData) => this.actions.update(`tasks/${taskData.id}`, {
      task: taskData.toJson(),
    }),
    delete: (taskId) => this.actions.del(`tasks/${taskId}`),
    moveTask: (sprintId, taskId) => this.actions.post(`tasks/${taskId}/move_task`, {
      sprint_id: sprintId,
    }),
    changeStatus: (taskId, status) => this.actions.update(`tasks/${taskId}/change_status`, {
      status
    }),
  }
  taskStatus = {
    getTaskStatuses: () => this.actions.get('task_statuses/'),
  }
  user = {
    me: () => this.actions.get('me')
  }

}

export default Requests
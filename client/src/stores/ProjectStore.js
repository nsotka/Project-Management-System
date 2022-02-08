import { makeAutoObservable, action, runInAction } from "mobx";
import { fromPromise } from 'mobx-utils'
import Project from "../models/Project";
import Sprint from "../models/Sprint";
import Task from "../models/Task";

class ProjectStore {

  userProjects = null;
  currentProject = null;

  constructor(rootStore) {
    this.rootStore = rootStore;
    this.requests = rootStore.requests;
    makeAutoObservable(this)
  }

  addAcceptedProject = action((acceptedProjectJson) => {
    const project = Project.fromJson(acceptedProjectJson)
    this.userProjects.value.push(project)
  })

  getRoles = async () => {
    const roles = await this.requests.role.getRoles().then((roles) => roles)
    return roles
  }

  addNewMembers = action((memberArray) => {
    return this.requests.membership.addMembers(memberArray).then((members) => {
    })
  })

  createNewProject = action((projectData) => {
    return this.requests.project.create(projectData).then((project) => {
      const projectObj = Project.fromJson(project)
      this.userProjects.value.push(projectObj)
      runInAction(() => {
        this.currentProject = projectObj
      })
    })
  })

  createSprint = action(async (sprintData) => {
    return this.requests.sprint.create(sprintData).then((sprint) => {
      const sprintObj = Sprint.fromJson(sprint)

      runInAction(() => {
        const rootProject = this.userProjects.value.find((project) => project.id === this.currentProject.id)

        let sprints = [...this.currentProject.sprints]
        sprints.unshift(sprintObj)

        rootProject.sprints = [...sprints]

        this.currentProject = { ...this.currentProject, sprints: [...sprints] }
      })
    })
  })

  editSprint = action(async (sprintData) => {
    return this.requests.sprint.update(sprintData).then((sprint) => {

      runInAction(() => {
        const rootProject = this.userProjects.value.find((project) => project.id === this.currentProject.id)


        let sprintToEdit = this.currentProject.sprints.find((orgSprint) => orgSprint.id === sprint.id)
        sprintToEdit.updateAttrsFromJson(sprint)

        let sprints = [...this.currentProject.sprints]

        rootProject.sprints = [...sprints]

        this.currentProject = { ...this.currentProject, sprints: [...sprints] }
      })
    })
  })

  deleteSprint = action(async (sprint) => {
    const hasTasks = this.currentProject.tasks.find((task) => task.sprintId === sprint.id)

    if (hasTasks) {
      alert("")
    } else {
      return this.requests.sprint.delete(sprint).then((sprintToDel) => {
        const rootProject = this.userProjects.value.find((project) => project.id === this.currentProject.id)

        const filteredSprints = this.currentProject.sprints.filter((sprint) => sprint.id !== sprintToDel.id)

        runInAction(() => {
          rootProject.sprints = [...filteredSprints]

          this.currentProject = { ...this.currentProject, sprints: [...filteredSprints] }
        })
      })
    }
  })

  changeActiveStatus = action((sprintId) => {

    return this.requests.sprint.changeActiveStatus(this.currentProject.id, sprintId).then((sprint) => {
      runInAction(() => {
        const rootProject = this.userProjects.value.find((project) => project.id === this.currentProject.id)

        let sprintToDeactive = this.currentProject.sprints.find((orgSprint) => orgSprint.active)
        sprintToDeactive.changeAttr("active", false)
        let sprintToActive = this.currentProject.sprints.find((orgSprint) => orgSprint.id === sprint.id)
        sprintToActive.changeAttr("active", sprint.active)

        let sprints = [...this.currentProject.sprints]

        rootProject.sprints = [...sprints]

        this.currentProject = { ...this.currentProject, sprints: [...sprints] }
      })
    })
  })

  changeClosedStatus = action((sprintId) => {

    const openTasks = this.currentProject.tasks.filter((task) => task.sprintId === sprintId && task.status !== 'completed')

    if (openTasks.length > 0) {
      alert("AVOIMIA TEHTÄVIÄ")
    } else {
      return this.requests.sprint.changeClosedStatus(this.currentProject.id, sprintId).then((sprint) => {

        runInAction(() => {
          const rootProject = this.userProjects.value.find((project) => project.id === this.currentProject.id)


          let sprintToEdit = this.currentProject.sprints.find((orgSprint) => orgSprint.id === sprint.id)
          sprintToEdit.changeAttr("closed", sprint.closed)

          let sprints = [...this.currentProject.sprints]

          rootProject.sprints = [...sprints]

          this.currentProject = { ...this.currentProject, sprints: [...sprints] }
        })

      })
    }
  })

  getUserProjects = action(() => {
    return this.userProjects = fromPromise(new Promise((resolve, reject) => this.requestProjects(resolve, reject)))
  })

  requestProjects = async (resolve, reject) => {
    let projects = await this.requests.project.getUserProjects();

    if (Array.isArray(projects)) {
      projects = projects.map((project) => Project.fromJson(project))

      runInAction(() => {
        this.currentProject = projects.find((project) => project.active === true)
      })

      resolve(projects)
    } else if (projects.error) {
      reject(projects.error)
    }
  }

  changeCurrentProject = action((value) => {
    const project = this.userProjects.value.find((project) => project.id === value);

    if (project.id) {
      this.requests.membership.changeActiveProject(project.id).then(
        this.currentProject = project
      )
    }
  })

  createTask = action(async (taskData) => {
    return this.requests.task.create(taskData).then((task) => {
      const taskObj = Task.fromJson(task)
      runInAction(() => {
        const rootProject = this.userProjects.value.find((project) => project.id === this.currentProject.id)

        let tasks = [...this.currentProject.tasks]
        tasks.push(taskObj)

        rootProject.tasks = [...tasks]

        this.currentProject = { ...this.currentProject, tasks: [...tasks] }
      })
    })
  })

  editTask = action(async (taskData) => {
    return this.requests.task.update(taskData).then((task) => {

      runInAction(() => {
        const rootProject = this.userProjects.value.find((project) => project.id === this.currentProject.id)


        let taskToEdit = this.currentProject.tasks.find((orgTask) => orgTask.id === task.id)
        taskToEdit.updateAttrsFromJson(task)

        let tasks = [...this.currentProject.tasks]

        rootProject.tasks = [...tasks]

        this.currentProject = { ...this.currentProject, tasks: [...tasks] }
      })
    })
  })

  changeTaskStatus = action(async (taskId, status) => {
    return this.requests.task.changeStatus(taskId, status).then((taskResponse) => {
      const foundTask = this.currentProject.tasks.find((task) => task.id === taskResponse.id)

      if (foundTask !== -1) {
        runInAction(() => {
          foundTask.changeAttr("status", taskResponse.status)
        })
      }

    })
  })

  deleteTask = action(async (taskId) => {
    return this.requests.task.delete(taskId).then((taskToDel) => {
      const rootProject = this.userProjects.value.find((project) => project.id === this.currentProject.id)

      const filteredTasks = this.currentProject.tasks.filter((task) => task.id !== taskToDel.id)

      runInAction(() => {
        rootProject.tasks = [...filteredTasks]

        this.currentProject = { ...this.currentProject, tasks: [...filteredTasks] }
      })
    })
  })

  moveTask = action((sprintId, taskId) => {
    return this.requests.task.moveTask(sprintId, taskId).then((taskResponse) => {
      const foundTask = this.currentProject.tasks.find((task) => task.id === taskResponse.id)

      if (foundTask) {
        runInAction(() => {
          foundTask.sprintId = taskResponse.sprint_id
        })
      }
      return foundTask
    })
  })

  deleteInvitation = action((invitationId) => {
    this.requests.membership.deleteInvitation(invitationId)
  })

}

export default ProjectStore;
json.(project, :id, :title, :description)

project.memberships.each do |membership|
  json.active membership.active if membership.user_id === current_user.id
end

json.sprints project.sprints.order("created_at DESC")

json.task_categories project.task_categories

project_tasks = []

project.task_categories.each do |category|
  category.tasks.each do |task|
    project_tasks.push(task)
  end
end

json.tasks do
  json.array! project_tasks, partial: "api/tasks/task", as: :task
end

members = []
open_invitations = []

project.memberships.each do |membership|
  if membership.invitation_accepted
    members.push(membership)
  else
    open_invitations.push(membership)
  end
end

json.members do
  json.array! members, partial: "api/users/member", as: :member
end

json.open_invitations do
  json.array! open_invitations, partial: "api/memberships/membership", as: :membership
end
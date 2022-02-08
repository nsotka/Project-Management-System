users = User.where("id IN (?)", task.user_ids)

json.(task, :id, :title, :task_category_id, :sprint_id, :due_datetime, :created_at)

json.status task.task_status.status

json.users do
  json.partial! partial: "api/users/user", collection: users, as: :user
end
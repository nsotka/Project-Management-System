json.(membership, :id, :invitation_accepted)

json.project_title membership.project.title

json.user do
  json.id membership.user.id
  json.email membership.user.email
  json.first_name membership.user.first_name
  json.last_name membership.user.last_name
  json.role membership.role.title
end
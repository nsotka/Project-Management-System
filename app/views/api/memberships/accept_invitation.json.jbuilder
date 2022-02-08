json.membership @membership
json.project do
  json.partial! 'api/projects/project', locals: { project: @membership.project }
end
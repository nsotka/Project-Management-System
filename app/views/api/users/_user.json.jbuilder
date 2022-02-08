json.(user, :id, :email, :first_name, :last_name)

if current_user.id === user.id
  invitations = Membership.where("user_id = (?) AND invitation_accepted IS NOT true", current_user.id)

  json.private do 
    json.invitations do
      json.partial! partial: "api/memberships/membership", collection: invitations, as: :membership
    end
  end
end
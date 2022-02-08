class AddInvitationAcceptedToMemberships < ActiveRecord::Migration[6.1]
  def change
    add_column :memberships, :invitation_accepted, :boolean
  end
end

class AddActiveToMemberships < ActiveRecord::Migration[6.1]
  def change
    add_column :memberships, :active, :boolean
  end
end

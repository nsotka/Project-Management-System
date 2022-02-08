class AddColumnsToSprint < ActiveRecord::Migration[6.1]
  def change
    add_column :sprints, :active, :boolean
    add_column :sprints, :closed, :boolean
  end
end

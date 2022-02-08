class CreateSprints < ActiveRecord::Migration[6.1]
  def change
    create_table :sprints do |t|
      t.references :project, null: false, foreign_key: true
      t.string :name, null: false
      t.string :description
      t.datetime :start_datetime, null: false
      t.datetime :due_datetime

      t.timestamps
    end
  end
end

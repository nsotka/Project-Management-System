class CreateTasks < ActiveRecord::Migration[6.1]
  def change
    create_table :tasks do |t|
      t.references :task_category, null: false, foreign_key: true
      t.references :sprint, null: true, foreign_key: true
      t.references :task_status, null: false, foreign_key: true
      t.datetime :due_datetime
      t.integer :user_ids, array: true, default: []

      t.timestamps
    end
    add_index :tasks, :user_ids, using: 'gin'
    #Ex:- add_index("admin_users", "username")
  end
end

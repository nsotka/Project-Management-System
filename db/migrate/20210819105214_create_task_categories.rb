class CreateTaskCategories < ActiveRecord::Migration[6.1]
  def change
    create_table :task_categories do |t|
      t.references :project, null: false, foreign_key: true
      t.string :title

      t.timestamps
    end
  end
end

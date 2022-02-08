class CreateTaskStatuses < ActiveRecord::Migration[6.1]
  def change
    create_table :task_statuses do |t|
      t.string :status

      t.timestamps
    end
  end
end

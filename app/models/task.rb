class Task < ApplicationRecord
  belongs_to :task_category
  belongs_to :sprint, optional: true
  belongs_to :task_status

end
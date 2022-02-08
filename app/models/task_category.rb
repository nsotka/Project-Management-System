class TaskCategory < ApplicationRecord
  belongs_to :project
  has_many :tasks
end

class Project < ApplicationRecord
  has_many :memberships
  has_many :task_categories
  has_many :sprints

  validates :title, presence: true
end

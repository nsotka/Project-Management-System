class Role < ApplicationRecord
  has_many :memberships

  enum roles: ["admin"]
end

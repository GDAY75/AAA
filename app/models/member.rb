class Member < ApplicationRecord
  has_many :castings
  has_many :pieces
end

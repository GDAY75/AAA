class Piece < ApplicationRecord
  belongs_to :member
  has_many :castings, dependent: :destroy
  has_many :reviews
  has_many :members, through: :castings
end

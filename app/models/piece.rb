class Piece < ApplicationRecord
  belongs_to :member
  has_many :castings
  has_many :reviews
end

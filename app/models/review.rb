class Review < ApplicationRecord
  belongs_to :piece
  belongs_to :user

  validates :description, presence: true
end

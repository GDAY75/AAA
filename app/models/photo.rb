class Photo < ApplicationRecord
  belongs_to :gallery
  validates :image, presence: true
end

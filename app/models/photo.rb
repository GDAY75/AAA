class Photo < ApplicationRecord
  has_one_attached :image
  belongs_to :gallery
  validates :image, presence: true
end

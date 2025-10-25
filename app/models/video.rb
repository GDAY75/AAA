class Video < ApplicationRecord
  belongs_to :piece
  # file = "crise/teaser.mp4" (dans app/assets/videos/crise/teaser.mp4)
  # poster = "crise/teaser_poster.jpg" (optionnel, dans app/assets/images ou videos)
  validates :file, presence: true
end


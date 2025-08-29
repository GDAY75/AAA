class Member < ApplicationRecord
  has_many :castings
  before_validation :generate_unique_slug, if: -> { slug.blank? && first_name.present? }

  validates :slug, presence: true, uniqueness: true

  # Utilise le slug dans les URLs: /members/gil
  def to_param
    slug
  end

  private

  def generate_unique_slug
    base = first_name.to_s.parameterize # "François" -> "francois"
    candidate = base
    i = 2
    while self.class.where(slug: candidate).where.not(id: id).exists?
      candidate = "#{base}-#{i}" # gère doublons: "marie", "marie-2"
      i += 1
    end
    self.slug = candidate
  end
end

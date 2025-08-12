class Member < ApplicationRecord
  has_many :castings
  has_many :pieces
  before_validation :generate_slug

  validates :slug, presence: true, uniqueness: true

  def to_param
    slug
  end

  private
  def generate_slug
    self.slug = first_name.to_s.parameterize if slug.blank?
  end
end

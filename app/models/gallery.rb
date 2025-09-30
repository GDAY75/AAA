class Gallery < ApplicationRecord
  has_many :photos, -> { order(position: :asc, id: :asc) }, dependent: :destroy

  validates :title, presence: true

  before_validation :set_slug, on: :create

  def to_param = slug

  private
  def set_slug
    self.slug ||= title.to_s.parameterize
  end
end

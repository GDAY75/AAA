class MembersController < ApplicationController
  skip_before_action :authenticate_user!

  def index
    @members = Member.order(:first_name)
  end

  def show
    @member = Member.find_by!(slug: params[:slug])
    @castings = @member.castings.includes(:piece)
    @pieces = @member.pieces.reverse
    # Récupérer les rôles du member
    roles = @member.castings.pluck(:role)
    terms = [@member.first_name, *roles].compact.uniq

    if terms.any?
      # Recherche insensible à la casse, compatible SQLite/Postgres/MySQL
      conditions = terms.map { "LOWER(caption) LIKE ?" }.join(" OR ")
      values     = terms.map { |t| "%#{t.downcase}%" }

      matching_photos = Photo.where(conditions, *values).distinct.to_a

      # On en garde 10 au hasard
      @band_photos = matching_photos.sample(10)
    else
      @band_photos = []
    end
  end

end

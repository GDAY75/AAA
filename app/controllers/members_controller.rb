class MembersController < ApplicationController
  skip_before_action :authenticate_user!

  def index
    @members = Member.order(:first_name)
  end

  def show
    @member = Member.find_by!(slug: params[:slug])
    @castings = @member.castings.includes(:piece)
    @pieces = @member.pieces.reverse

    member_roles = @member.castings.pluck(:role).compact.reject(&:blank?)

    # Photos de répétitions
    if @member.fonction == "Metteur en scène"
      repete_photos = Photo.joins(:gallery)
                          .where("photos.caption ILIKE ?", "%#{@member.first_name}%")
                          .where(galleries: { category: "Répètes" })
    else
      repete_photos = Photo.joins(:gallery)
                          .where("photos.caption ILIKE ?", "%#{@member.slug.gsub("-", " ")}%")
                          .where(galleries: { category: "Répètes" })
    end

    # Photos de pièce
    if @member.fonction == "Metteur en scène"
      role_photos = Photo.joins(:gallery)
                        .where("photos.caption ILIKE ?", "%#{@member.first_name}%")
                        .where(galleries: { category: "Pièce" })
    elsif member_roles.any?
      role_patterns = member_roles.map do |role|
        escaped = Regexp.escape(role.to_s.strip)
        escaped = escaped.gsub("\\ ", "\\s+")
        "\\m#{escaped}\\M"
      end

      role_photos = Photo.joins(:gallery)
                        .where(
                          role_patterns.map { "photos.caption ~* ?" }.join(" OR "),
                          *role_patterns
                        )
                        .where(galleries: { category: "Pièce" })
    else
      role_photos = Photo.none
    end

    # Si pas de castings -> seulement répétitions
    @band_photos =
      if @member.fonction != "Metteur en scène" && member_roles.empty?
        repete_photos.uniq.sample(10)
      else
        (repete_photos + role_photos).uniq.sample(10)
      end
  end

end

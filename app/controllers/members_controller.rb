class MembersController < ApplicationController
  skip_before_action :authenticate_user!

  def index
    @members = Member.order(:first_name)
  end

  def show
    @member = Member.find_by!(slug: params[:slug])
    @castings = @member.castings.includes(:piece)
    @pieces = @member.pieces.reverse
    # ⚡ Récupère tous les rôles du member
    member_roles = @member.castings.pluck(:role)

    # ⚡ Condition A : photos de répétitions liées au prénom
    if @member.fonction == "Metteur en scène"
      repete_photos = Photo.joins(:gallery)
                          .where("photos.caption ILIKE ?", "%#{@member.first_name}%")
                          .where(galleries: { category: "Répètes" })
    else
      repete_photos = Photo.joins(:gallery)
                          .where("photos.caption ILIKE ?", "%#{@member.slug.gsub("-", " ")}%")
                          .where(galleries: { category: "Répètes" })
    end

    # ⚡ Condition B : photos de pièce liées aux rôles
    if @member.fonction == "Metteur en scène"
      role_photos = Photo.joins(:gallery)
                        .where("photos.caption ILIKE ?", "%#{@member.first_name}%")
                        .where(galleries: { category: "Pièce" })
    else
      role_patterns = member_roles.map do |role|
        escaped = Regexp.escape(role.to_s.strip)
        escaped = escaped.gsub("\\ ", "\\s+") # si rôle en 2-3 mots => tolère plusieurs espaces
        "\\m#{escaped}\\M"
      end

      role_photos = Photo.joins(:gallery)
        .where(
          role_patterns.map { "photos.caption ~* ?" }.join(" OR "),
          *role_patterns
        )
        .where(galleries: { category: "Pièce" })
    end

    # ⚡ Fusion + échantillonnage aléatoire
    @band_photos = (repete_photos + role_photos).uniq.sample(10)
  end

end

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
    repete_photos = Photo.joins(:gallery)
                        .where("photos.caption ILIKE ?", "%#{@member.first_name}%")
                        .where(galleries: { category: "Répètes" })

    # ⚡ Condition B : photos de pièce liées aux rôles
    if @member.fonction == "Metteur en scène"
      role_photos = Photo.joins(:gallery)
                        .where("photos.caption ILIKE ?", "%#{@member.first_name}%")
                        .where(galleries: { category: "Pièce" })
    else
      role_photos = Photo.joins(:gallery)
                        .where(
                          member_roles.map {
                            "photos.caption ILIKE ?"
                          }.join(" OR "),
                          *member_roles.map { |r| "%#{r}%" }
                        )
                        .where(galleries: { category: "Pièce" })
    end

    # ⚡ Fusion + échantillonnage aléatoire
    @band_photos = (repete_photos + role_photos).uniq.sample(10)
  end

end

class GalleriesController < ApplicationController
  skip_before_action :authenticate_user!
  def index
    @galleries = Gallery.order(year: :desc).order(Arel.sql("CASE WHEN category = 'Pièce' THEN 0 ELSE 1 END"))
  end

  def show
    @gallery = Gallery.find_by!(slug: params[:id])
    @photos  = @gallery.photos
  end
end

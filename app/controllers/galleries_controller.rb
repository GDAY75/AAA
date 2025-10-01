class GalleriesController < ApplicationController
  def index
    @galleries = Gallery.order(created_at: :desc)
  end

  def show
    @gallery = Gallery.find_by!(slug: params[:id])
    @photos  = @gallery.photos
  end
end

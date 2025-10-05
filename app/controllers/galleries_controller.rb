class GalleriesController < ApplicationController
  skip_before_action :authenticate_user!
  def index
    @galleries = Gallery.order(created_at: :desc)
  end

  def show
    @gallery = Gallery.find_by!(slug: params[:id])
    @photos  = @gallery.photos
  end
end

class VideosController < ApplicationController
  skip_before_action :authenticate_user!
  def index
    @pieces = Piece.where.associated(:videos)
                  .includes(:videos)
                  .order(year: :desc, title: :asc)
  end

  def show
    @video = Video.includes(:piece).find(params[:id])
  end
end

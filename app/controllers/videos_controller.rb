class VideosController < ApplicationController
  def index
    @pieces = Piece.includes(:videos).where.exists(:videos).order(year: :desc, title: :asc)
  end

  def show
    @video = Video.includes(:piece).find(params[:id])
  end
end

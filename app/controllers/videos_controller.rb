class VideosController < ApplicationController
  skip_before_action :authenticate_user!

  def index
    @pieces = Piece.joins(:videos)
                  .distinct
                  .includes(:videos)
                  .order(year: :desc, title: :asc)
  end
end

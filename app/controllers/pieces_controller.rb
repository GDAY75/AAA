class PiecesController < ApplicationController
  skip_before_action :authenticate_user!
  before_action :set_piece, only: :show

  def index
    @pieces = Piece.order(year: :desc, created_at: :desc)
  end

  def show
    @castings = @piece.castings.includes(:member)
    @members  = @piece.members.distinct.order(:first_name)
    @gallery = Gallery.find_by(title: @piece.title)
  end

  private

  def set_piece
    @piece = Piece.find(params[:id])
  end
end

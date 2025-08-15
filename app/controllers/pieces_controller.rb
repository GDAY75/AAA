class PiecesController < ApplicationController
  skip_before_action :authenticate_user!
  before_action :set_piece, only: :show

  def index
    @pieces = Piece.order(created_at: :desc)
  end

  def show
  end

  private

  def set_piece
    @piece = Piece.find(params[:id])
  end
end

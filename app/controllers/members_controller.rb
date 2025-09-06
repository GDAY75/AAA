class MembersController < ApplicationController
  skip_before_action :authenticate_user!

  def index
    @members = Member.order(:first_name)
  end

  def show
    @member = Member.find_by!(slug: params[:slug])
    @castings = @member.castings.includes(:piece)
  end

end

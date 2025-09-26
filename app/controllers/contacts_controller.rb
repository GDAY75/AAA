class ContactsController < ApplicationController
  skip_before_action :authenticate_user!
  def new
    @contact = OpenStruct.new(name: "", email: "", subject: "", message: "")
    @errors = []
    @success = "Merci ! Votre message a bien été envoyé." if params[:success].present?
  end

  def create
    @contact = OpenStruct.new(contact_params)

    @errors = []
    @errors << "Nom requis" unless @contact.name.present?
    @errors << "Email requis" unless @contact.email.present?
    @errors << "Message requis" unless @contact.message.present?


    if @errors.any?
      render :new, status: :unprocessable_entity
    else
      # Ici tu pourrais appeler un Mailer plus tard.
      redirect_to contact_path(success: 1)
    end
  end

  private

  def contact_params
    params.require(:contact).permit(:name, :email, :subject, :message)
  end
end

class ContactsController < ApplicationController
  skip_before_action :authenticate_user!
  def new
    @contact = OpenStruct.new(name: "", email: "", subject: "", message: "")
  end

  def create
    @contact = OpenStruct.new(contact_params)

    errors = []
    errors << "Nom requis" unless @contact.name.present?
    errors << "Email requis" unless @contact.email.present?
    errors << "Message requis" unless @contact.message.present?

    if errors.any?
      flash.now[:alert] = errors.join(" • ")
      render :new, status: :unprocessable_entity
    else
      # Ici tu pourrais appeler un Mailer plus tard.
      flash[:notice] = "Merci ! Votre message a bien été envoyé."
      redirect_to contact_path
    end
  end

  private

  def contact_params
    params.require(:contact).permit(:name, :email, :subject, :message)
  end
end

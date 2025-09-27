class ContactMailer < ApplicationMailer
  default \
    to:   "gdayan94@gmail.com",                 # destinataire
    from: "assodesacteursanonymes@gmail.com"                  # DOIT matcher le compte Gmail
    # tu peux garder le reply_to dynamique :
  def contact_message
    @contact = OpenStruct.new(params[:contact])
    mail(
      subject: "[AAA Théâtre] #{@contact.subject.presence || 'Nouveau message'}",
      reply_to: @contact.email.presence
    )
  end
end

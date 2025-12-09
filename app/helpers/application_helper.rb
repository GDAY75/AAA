module ApplicationHelper
  def member_asset_image(member, ext: "jpg")
    base = normalized_member_name(member)
    "#{base}.#{ext}"
  end

  private

  # Renvoie un prénom propre, sans accents, en majuscules, prêt à servir pour un nom de fichier
  def normalized_member_name(member)
    name = member&.first_name.to_s.strip
    I18n.transliterate(name).upcase.presence || "UNKNOWN"
  end
end

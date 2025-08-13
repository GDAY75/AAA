module ApplicationHelper
  def member_asset_image(member)
    base = I18n.transliterate(member.first_name.to_s).upcase # "Héléna" -> "HELENA"
    "#{base}.jpg"
  end
end

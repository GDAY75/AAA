module MembersHelper
  def photo_band_src(photo)
    if photo.respond_to?(:image) && photo.image.present?
      # Cas ActiveStorage
      if photo.image.respond_to?(:attached?) && photo.image.attached?
        url_for(photo.image)
      else
        # Cas colonne String : "mon_dossier/ma_photo.jpg"
        asset_path(photo.image)
      end
    elsif photo.respond_to?(:file) && photo.file.present?
      asset_path(photo.file)
    elsif photo.respond_to?(:filename) && photo.filename.present?
      asset_path(photo.filename)
    elsif photo.respond_to?(:path) && photo.path.present?
      asset_path(photo.path)
    end
  end
end

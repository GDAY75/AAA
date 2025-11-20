# lib/tasks/migrate_photos_to_cloudinary.rake

namespace :cloudinary do
  desc "Uploader toutes les photos locales (app/assets/images) vers Cloudinary et mettre à jour Photo.image"
  task migrate_photos: :environment do
    require "cloudinary"

    Photo.find_each do |photo|
      if photo.local_path.blank?
        puts "⚠️  Photo #{photo.id} : pas de local_path, on saute."
        next
      end

      # Chemin absolu du fichier local
      local_file = Rails.root.join("app", "assets", "images", photo.local_path)

      unless File.exist?(local_file)
        puts "❌ Fichier introuvable pour Photo #{photo.id} : #{local_file}"
        next
      end

      puts "⬆️  Upload Photo #{photo.id} depuis #{local_file}"

      begin
        # Option : organiser dans un dossier par galerie
        folder_name = "aaa_galleries"
        folder_name += "/gallery_#{photo.gallery_id}" if photo.respond_to?(:gallery_id)

        # On déduit un public_id propre (sans extension)
        public_id = File.basename(photo.local_path, ".*")

        result = Cloudinary::Uploader.upload(
          local_file.to_s,
          folder: folder_name,
          public_id: public_id,
          overwrite: true,
          resource_type: "image"
        )

        # On stocke le public_id Cloudinary dans image
        photo.update_columns(image: result["public_id"])

        puts "✅ OK Photo #{photo.id} -> #{result["public_id"]}"

      rescue => e
        puts "💥 Erreur pour Photo #{photo.id} : #{e.class} - #{e.message}"
      end
    end

    puts "🎉 Migration terminée."
  end
end

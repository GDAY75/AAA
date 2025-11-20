class AddLocalPathToPhotos < ActiveRecord::Migration[7.1]
  def change
    add_column :photos, :local_path, :string
  end
end

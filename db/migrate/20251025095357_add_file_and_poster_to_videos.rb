class AddFileAndPosterToVideos < ActiveRecord::Migration[7.1]
  def change
    add_column :videos, :file, :string
    add_column :videos, :poster, :string
  end
end

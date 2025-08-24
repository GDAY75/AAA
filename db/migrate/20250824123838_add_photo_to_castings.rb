class AddPhotoToCastings < ActiveRecord::Migration[7.1]
  def change
    add_column :castings, :photo, :string
  end
end

class CreateGalleries < ActiveRecord::Migration[7.1]
  def change
    create_table :galleries do |t|
      t.string :title
      t.string :category
      t.string :slug
      t.string :cover

      t.timestamps
    end
    add_index :galleries, :slug, unique: true
  end
end

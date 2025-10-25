class CreateVideos < ActiveRecord::Migration[7.1]
  def change
    create_table :videos do |t|
      t.references :piece, null: false, foreign_key: true
      t.string :title
      t.string :url
      t.string :provider
      t.string :thumbnail
      t.integer :position
      t.text :description
      t.datetime :published_at

      t.timestamps
    end
  end
end

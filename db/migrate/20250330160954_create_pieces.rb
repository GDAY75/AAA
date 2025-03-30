class CreatePieces < ActiveRecord::Migration[7.1]
  def change
    create_table :pieces do |t|
      t.string :title
      t.string :auteur
      t.text :description
      t.references :member, null: false, foreign_key: true

      t.timestamps
    end
  end
end

class CreateCastings < ActiveRecord::Migration[7.1]
  def change
    create_table :castings do |t|
      t.string :role
      t.references :piece, null: false, foreign_key: true
      t.references :member, null: false, foreign_key: true

      t.timestamps
    end
  end
end

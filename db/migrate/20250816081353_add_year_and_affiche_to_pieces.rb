class AddYearAndAfficheToPieces < ActiveRecord::Migration[7.1]
  def change
    add_column :pieces, :year, :integer
    add_column :pieces, :affiche, :string
  end
end

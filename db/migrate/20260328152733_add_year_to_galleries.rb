class AddYearToGalleries < ActiveRecord::Migration[7.1]
  def change
    add_column :galleries, :year, :integer
  end
end

class AddYearsToMembers < ActiveRecord::Migration[7.1]
  def change
    add_column :members, :year_start, :integer, default: 2022, null: 2022
    add_column :members, :year_end, :integer, default: 2025, null: 2025
  end
end

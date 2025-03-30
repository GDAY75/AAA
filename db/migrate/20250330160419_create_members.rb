class CreateMembers < ActiveRecord::Migration[7.1]
  def change
    create_table :members do |t|
      t.string :first_name
      t.string :last_name
      t.integer :age
      t.text :biography
      t.string :fonction

      t.timestamps
    end
  end
end

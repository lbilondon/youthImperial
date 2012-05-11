class CreateCovers < ActiveRecord::Migration
  def change
    create_table :covers do |t|
      t.string :username
      t.string :imagedata

      t.timestamps
    end
  end
end

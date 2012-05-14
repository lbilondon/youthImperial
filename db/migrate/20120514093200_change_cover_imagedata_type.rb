class ChangeCoverImagedataType < ActiveRecord::Migration
  def up
  	change_column :covers, :imagedata, :text, :limit => nil
  end

  def down
  	change_column :covers, :imagedata, :string
  end
end

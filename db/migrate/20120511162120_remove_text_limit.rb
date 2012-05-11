class RemoveTextLimit < ActiveRecord::Migration
  def self.up
  	change_column :covers, :imagedata, :string, :limit => nil
  end

  def self.down
 	change_column :covers, :imagedata, :string, :limit => 255
  end
end

class Cover < ActiveRecord::Base
  
  attr_accessible :imagedata, :username

  has_attached_file :image,
                    :styles => {
                      :thumb => "100x100#"
                    },
					          :url => ":s3_domain_url",
                    :storage => :s3,
    				        :s3_credentials => S3_CREDENTIALS,
                    :path => "/images/covers/:id-:style.:extension"

                    # set path and url if using local storage
	                  # path to store file
                    # :path => ":rails_root/public/images/:attachment/:id_:style.:extension",
                    # path to render file from 
                    # :url => "/images/:attachment/:id_:style.:extension"

  before_save :decode_imagedata

  private
  	def decode_imagedata
      # remove metadata "data:image/png;base64,..." from beginning of posted string 
      # before decoding
  		d = imagedata.split("base64,")
  		file = StringIO.new(Base64.decode64(d[1]))
  		file.class_eval do
    		attr_accessor :original_filename, :content_type 
    	end
    	file.original_filename = "cover.png"
    	file.content_type = "image/png"
    	self.image = file
  	end
end

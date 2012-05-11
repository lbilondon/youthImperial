class Feed1Controller < ApplicationController
 
  require "instagram"
  require "open-uri"
  
  USESTUBDATA = false
  
  CALLBACK_URL = (Rails.env === 'production') ? "http://youthimperial.herokuapp.com/oauth/callback": "http://localhost:3000/oauth/callback";
  YOUTHIMPERIALS_UID = "27295624"
  
  Instagram.configure do |config|
    config.client_id = (Rails.env === 'production') ? 'd51f55e4af5444da8f3d02e01d6ba766' : "84e6db6bc9bc47f9a14bd5f25dc738e6"
    config.client_secret = (Rails.env === 'production') ? 'f90ab46735144afbb57e92086599bae8' : "25deb745419f435b9d383175ed9bd6ab"
  end
  
  # GET /feed1
  # GET /feed1.json
  def index
    respond_to do |format|
      format.html # index.html.erb
      #format.json { render json:  }
    end
  end
  
  def oauthConnect
    if USESTUBDATA
      redirect_to "/feed"
    else 
      redirect_to Instagram.authorize_url(:redirect_uri => CALLBACK_URL)
    end
  end

  def oauthCallback
    response = Instagram.get_access_token(params[:code], :redirect_uri => CALLBACK_URL)
    session[:access_token] = response.access_token
    redirect_to "/feed"
  end
  
  def feed
    
    if USESTUBDATA
      @media = self.fetchJSONFromFile("app/assets/stubData.json")
    else 
      client = Instagram.client(:access_token => session[:access_token])
      @media = {};
      @media['user'] = client.user  
      @media['user']['feed'] = self.parseRecentMedia(client.user_recent_media)
      @media['yi'] = {}
      @media['yi']['feed'] = self.parseRecentMedia(Instagram.user_recent_media(YOUTHIMPERIALS_UID, :access_token => session[:access_token]))
    end
      
    respond_to do |format|
       format.html # index.html.erb
       format.json { render json: @media }
    end
  end
  
  def parseRecentMedia(recentMediaObj)
    tmpArr = []
    i = 0
    recentMediaObj.each do |mediaItem|
      tmpArr[i] = self.fetchImage(mediaItem.images.standard_resolution.url)
      i+=1
    end
    return tmpArr
  end
  
  def fetchImage(urlInput)
    url = URI.parse(urlInput)
    open(url) do |http|
      return Base64.encode64(http.read)
    end
  end
  
  def fetchJSONFromFile(filePath)
    return JSON.parse(File.read(filePath))
  end

  def saveArt
    @cover = Cover.new(params["cover"])
    @cover.save
    render :nothing => true
  end

  def covers
    @covers = Cover.find(:all, :order => "created_at desc", :limit => 25)
    respond_to do |format|
      format.html # covers.html.erb
    end
  end
end

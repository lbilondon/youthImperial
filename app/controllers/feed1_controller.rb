class Feed1Controller < ApplicationController
 
  require "instagram"
  require "open-uri"
  
  USESTUBDATA = false
  
  CALLBACK_URL = "http://localhost:3000/oauth/callback"
  YOUTHIMPERIALS_UID = "27295624"
  
  Instagram.configure do |config|
    config.client_id = "84e6db6bc9bc47f9a14bd5f25dc738e6"
    config.client_secret = "25deb745419f435b9d383175ed9bd6ab"
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
end

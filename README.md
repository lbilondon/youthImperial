#Youth Imperial Instagram Mashup

This is using the instagram api to get one feed from the user that logs on, and one feed from the band Youth Imperial. This will then push the feeds into a canvas where the user can mash up their own version of the album cover.

#Setup

I recommend you use RVM to control ruby versions on your machine, if you do you can do the following to setup this project.

    > rvm install 1.9.2
    
    > rvm --rvmrc --create 1.9.2@youthImperial
    
    > bundle install
    
    > rake db:create
    
    > rake db:reset
    
    
Once these have all been setup you can from the root folder run the server using the following:

	> rails server
	
You will now be able to view the site at http://0.0.0.0:3000


##Deployment

For deployment we are using heroku. Assuming you are added as a collaborator on the heroku project you should be able to do the following to get setup:

Deployment setup:
	> gem install heroku
	> heroku login
	> git remote add heroku git@heroku.com:youthimperial.git
	
Deployment process, make sure you precompile your assets before pushing to heroku:
	> RAILS_ENV=production bundle exec rake assets:precompile
	
	> git add .
	> git commit -m "adding assets"
	
	> git push origin master
	> git push heroku master

Live server: http://youthimperial.herokuapp.com/
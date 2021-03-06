---
layout: post
title:  "Jekyll and Digital Ocean with rsync"
subtitle: "A tutorial on getting Jekyll up and running using Digital Ocean VPS."
date:   2017-03-12
author: "Caleb"
type: post
---
## Introduction

Note: Currently, this tutorial is best suited to OSX / Unix based platforms.
You can follow along in Windows, but all the commands are written based on Unix.

In this tutorial we will focus on setting up Jekyll to run on a VPS.
For our VPS, I have chosen the highly popular and well documented VPS host, [Digital Ocean](https://www.digitalocean.com).

This means that this tutorial will require a Digital Ocean account.
Digital Ocean is not a free VPS, you are paying for a premium service, which means you get premium options too. You can pay as little as $5 USD a month for a basic account, which gives you plenty of legroom to set up a personal website, or even a website for a client. If you like, you can use my [referral link](https://m.do.co/c/49162fd04825) which will immediately grant you $10 credit for your first sign up. This is enough for two months, and you can of course opt out after if you don't wish to keep an ongoing subscription.

If you haven't heard of Jekyll before, then have a quick look at [their website](https://jekyllrb.com/). In short, Jekyll is a static website generator that is also blog aware. This means you can focus on content, rather than having a big backend to hold all of your data. You can write posts in HTML or Markdown and push them to your `_posts` directory, which can then be uploaded onto your website.

It should also be known that Jekyll is the engine behind [GitHub Pages](https://pages.github.com). If you have a GitHub account (hopefully you do already!), you can actually host your blog for free. There are of course limitations when comparing GitHub Pages to a VPS, so take that into consideration. Again, this tutorial focuses on setting up your VPS.

Firstly, we will be 'generating' the standard Jekyll website, creating a custom post for testing purposes then getting it up and running on Digital Ocean. What I want to make clear in this tutorial is that we won't be running a web server that is constantly building your Jekyll site. Instead, we will be moving files into the `_site` folder (this will become clearer later) which will then get immediately rendered when the site is refreshed.

Digital Ocean provides a web-based console interface that allows you to interact with your server. If you're familiar with this and happy to use it, then it is perfectly fine. On the other hand, it is generally faster to connect to your remote server using SSH. The response time is much quicker and it's smoother working in your own terminal. If you're using Windows, you can use [PuTTY](http://www.putty.org/) to connect to it.

Secondly, we will be writing a small bash script that you can execute in your terminal and also aliasing it. This script will push your changes to your website's remote directory, through [rsync](https://linux.die.net/man/1/rsync) over ssh, without you needing to log in every time. What this achieves, and complements, is writing blog posts (for example) offline then pushing them to your live website. Develop locally and publish your finished content.

So, let's get started!

### Making a website with Jekyll

Open up your terminal and navigate to a new directory. If it's your first time with Jekyll, you'll need to run the following command:
`gem install jekyll bundler`.

If you get a 'gem command not found' error, this could mean you don't have ruby installed. You can try running the following:
`gem -v` or `ruby -v`

If both commands return nothing, you (most likely) don't have Ruby installed. Visit [Ruby on Rails Installation](https://www.tutorialspoint.com/ruby-on-rails/rails-installation.htm) to get started.


After running 'gem install jekyll bundler', type in the following:
```bash
$ jekyll new my-awesome-site
$ cd my-awesome-site
$ bundle exec jekyll serve
```
You can change the name of "my-awesome-site" to whatever you want. In this case I'm using Jekyll's official example.
After running the bundle command, navigate to "localhost" in your browser.

Enter 'localhost:4000' in your address bar. Port 4000 is the default port, although this can be changed by using the --port flag
`jekyll serve --port PORT`

If you visit `localhost:4000`, you will see your site up and running. Have a play, click around, navigate through the lists and click on the default post, "Welcome to Jekyll!".

![alt-text](/assets/img/posts/jekyll-mainpage.png "Jekyll default template page"){: .post-img .img-center}

Here you can see the contents of the default post.

Going back to the main page, you'll see the <b>posts</b> list.

Now, open up another terminal and go into your directory you made for your Jekyll website. Look at the
contents of your directory and run `ls`

You should see:
```
.
Gemfile
Gemfile.lock
_config.yml
_posts
_site
about.md
index.md
```
Note: You do not need to touch anything inside your `_site` directory. Leave this alone.

Inside your `_posts` directory, you will see the post *Welcome to Jekyll* which was automatically generated.
Run the following:
```bash
$ cd _posts/
$ cp 2017-03-12-welcome-to-jekyll.markdown 2017-04-13-welcome-to-jekyll-number-two.markdown
```
The ```cp``` command makes a copy of a file. Open your newly copied file using a text-editor (nano, vi or vim if you're comfortable), and change the title and date field to the following:
```bash
title: "Welcome to Jekyll Number Two!"
date: 2017-04-13 (You can leave this alone).
```

What you are doing here is changing the YAML front matter for the post. If you don't adjust this as well, your posts will appear identical. YAML Front Matter looks like this:
```bash
---
title: "Example Title" // YAML FRONT MATTER
---
### Your post content here..
```
This YAML front matter is read when your site gets built. It's important to have a good grasp of YAML and it's worth checking out Jekyll's official documentation.

While your server is running, go back to the home page. You should see in your terminal that the site notices the file change.

On the home page you should see the two posts. The original, and the one we copied and slightly modified.
This is how easy it is to add posts to your website. Simply focus on your content, write it up, change it, give it a title, date, any other meta data you may want for it and put it in your `_posts` directory.

Now we are going to leave Jekyll alone for a bit, and come back to it later. But first, we should observe what has happened in the background with Jekyll.

The new post has been copied from your `_posts` directory and placed into the `_site` folder. If you go in there, you'll see your post. You will only see the change if you put the new post in your `_posts` directory while the server was running, or if you re-run `jekyll serve`
It will be under the category 'Jekyll', then separated by folders corresponding to the date respectively.

What we'll be doing is pushing all of our locally generated `_site` content to our Digital Ocean Droplet.
All we need to do on our VPS, if not configured, is to get a simple 'index.html' page running. Once this is up, we can replace with it all of our Jekyll's `_site` content and view our website.

This guide does not cover DNS setup, or how to get your domain working with your Droplet. There is a tutorial for this on Digital Ocean.

### Installing nginx

For this part, we are going to be working in your Digital Ocean droplet.

You need your Digital Ocean account from this part onwards. When creating a droplet, choose an Ubuntu 16.04 build for the server.

**SSH** to your server and run the following:
```bash
$ ssh username@myserverip
$ sudo apt-get install nginx
```

If you haven't configured a proper user yet for your server, just use ```ssh root@myserverip```.


We are installing nginx to run the web server. Agree to the install via sudo, and then we need to start the service as nginx doesn't run automatically. Run the following:

```sudo service nginx start.```

Run this command to add nginx to your start up:
```update-rc.d nginx defaults```
_Note: You may need `sudo` here._

Let's go ahead and create our website's directory.
```bash
$ mkdir /srv/www/
```

Now configure nginx to know where to serve files from. Open `/etc/nginx/sites-available/default` with a text editor and edit the line with root to say
`root /srv/www;`.
```bash
$ sudo vi /etc/nginx/sites-available/default
```

Let's save it, and then restart the nginx service so it takes effect
```bash
sudo service nginx restart
```

Let's test the server by creating a simple index.html file inside your /srv/www/ directory, and populating it with Hello World.

```bash
$ cd /srv/www/
$ touch index.html
$ echo "Hello world!" >> index.html
```

Get your ip by running the following
```bash
$ ifconfig | grep 'inet '
```

Your Droplet's IP address can also be verified in your Digital Ocean account, however, this command will return your server's IP just fine. Look at the line `inet addr` where the IP is *not* of the form `127.0.0.1`, for example, my public IP is `159.203.201.34`.

Navigate to your website by entering your IP into the address bar.

*Hopefully* you should see your little bit of Hello world! that you wrote before! If you don't, please go back and check the steps, especially the part with _nginx_. If it's all good, congratulations! We are almost done.

### Jekyll goes to Digital Ocean

We don't actually need to install Jekyll on our remote VPS. What we are doing is generating our site and developing it locally, then pushing the site to our /srv/www directory which nginx then serves.

So let's go back to our local working directory. If you are running ssh from the one terminal window, you will need to close the connection, which can be done via `Ctrl+D`.

`cd` back to your working directory, and then `cd` into the `_site` folder.
```bash
$ cd my-directory
$ cd _site
```

So what we want to do now, is grab all our content within the `_site` folder, and send this to our /srv/www.

We can do this via `rsync`.

### rsync versus scp

If you have copied files via ssh before, no doubt you may have used `scp` in the past. `rsync` differs as it performs the transfer a lot faster, because it uses a 'delta transfer algorithm' (whatever that is). The specifics of these two commands are not so important for this tutorial, rather, how do we use them.

Write this out in your terminal, so long as we are in the `_site` directory:
```bash
$ rsync -av . USER@DOMAIN:/srv/www/
```

In the `USER` field, substitute your server's username with sudo rights. If you haven't configured this, you can use `root`, but it is strongly recommended that you configure a user to have sudo rights rather than using root.

Put your server's IP in the `DOMAIN` field. The `/srv/www/` can be left alone, as this is DESTINATION for the files from your current working directory. Your current working directory is selected via the `.` after the `-av` tags.

An example might be:

```bash
$ rsync -av _site/ johnsmith@103.205.204.10:/srv/www/johns-website/
```

This will copy all of the files from `_site` to `/srv/www/johns-website/`, which is located on the server.

You will be prompted to login to your server once this command is run. If you have set up SSH key/pairs in the past, then it should just provide you some output, showing a list of the files `rsync` has pushed.

Another feature of `rsync` is that it compares the difference in files between the source and the destination. This means only the **changes** are submitted, so you are not duplicating files every-time you run the command or make a push.

In case you are wondering about the `-av` flags attached, these simply mean `--archived` and `--verbose`: it will recursively copy your files and provide you with a verbose output (more information is displayed!).

Use `rsync` to send all your files from the `_site` directory to your `/srv/www/` directory. Once this is complete, type in your websites IP address/DNS into your browser and have a look!

If you see your Jekyll blog up there, then congratulations! You have successfully completed this tutorial.

Now when you make any changes to your local copy of Jekyll, you can simply use `rsync` to send those changes to your web server which is running `nginx`, which will in turn serve those files for us. There really is not much work to be done on the server end.

I like this implementation as it is a very easy way and is also not so technical. What this also allows us to do, is to focus more on our content and less on our setup and configuration. Develop locally, publish online.

Now we have an optional part, which is to set up a working bash script to automate this process a bit quicker.

### Automating the site changes (OPTIONAL)

It takes a bit of time to type in that whole `rsync` command from before, and you don't want to be doing that everytime you make a change on your website. In order to streamline the process a bit, I wrote a simple bash script that checks your current working directory for the `_site` folder and then sends all the data from there to your specified destination.

The idea behind this is simple: work on your Jekyll Static Site, updating your blog or anything, and when you wish to push the changes to your live server, run the script and it does the rest.

Having a SSH key-pair set up is recommended, as it can be more secure than using password based logins, but also it does speed up the process.

Okay, let's go back to our Jekyll site directory where we were working in before.

```bash
$ vi push_site.sh
```
and in our script let's write the following, save and close.
```bash
#!/bin/bash
echo 'Hey terminal!'
```

If you've never done bash scripting before, it can be a highly useful tool to help you automate your workflow or any process on your computer.

Let's go ahead and test our little script.
```bash
$ sh push_site
```

You should see this in your terminals output: _Hello_ _terminal!_.

Congratulations! You are now a certified Linux System Administrator. Why are you reading this tutorial?

Jokes aside, let's make our script a little more useful.

`cd` into your local working directory for your Jekyll site. We want to be in the root folder, so that we can see all of those nice files and folders Jekyll created for us before.

Let's go ahead and do `touch push.sh`. Feel free to name your script anything.

For the first part, as the script is going to be taking all the data from your _site directory, I suppose we should check to see if there is a directory with the name `_site` in your working path!

```bash
#!/bin/bash
# This script pushes your _site contents to your remote web server directory
# Check for _script folder in current directory.
if [ ! -d "_site" ]; then
	echo "WARNING: Missing  _site  directory. Check your current working path!";
	echo "Now exiting..."
	exit;
fi
```

In fact, the script would fail if without this clause, as `rsync` won't be able to find _site either if it's not in your working path.

For the next step, we will run a check for the user (youser) if they wish to build their site first, and then push, or just push! We will also allow the script to end without pushing, incase you'd like to make a few quick changes first. Note: You may not wish to build your site first, if you recently just did it or have no changes to make, but you ran the script. Just a possible use case.

```bash
echo
echo "Do you want to build your site first (jekyll build)?"
while true; do
	read -p "y/n?" yn
	case $yn in
		[Yy]* ) echo "Building..."; jekyll build; break;;
		[Nn]* ) echo "Skipping build."; break;;
	esac
done
```

Now comes the `rsync` goodness. Remember the `rsync` command we went through before? Basically we are just putting that into our bash script, under another conditional.

You will need to enter in your host details and remote web server directory for your site. Having an SSH Key/Pair set up here does streamline the process a bit quicker, as `rsync` won't stop you to enter your password.

```bash
echo
echo "This will push all changes in _site to your remote VPS directory."
echo ""
echo "-------------------- Do you wish to proceed? --------------------"
while true; do
	read -p "y/n?" yn
	case $yn in
        # Enter in your correct directory and host details here
		[Yy]* ) echo "Pushing changes..."; rsync -av _site/ USER@DOMAIN:/srv/www/DIR; echo "Successfully pushed."; break;;
		[Nn]* ) echo "\nYou chose not to push. Bye!"; exit;;
	esac
done
```

And that's it for the script! Have all those pieces in one file named `push.sh` (or whatever you want, so long as .sh suffixes it). Now whenever you make a change to your website, and want to put it online, just save your changes and run your script. Then go take a break, come back and start making more updates!

I hope you enjoyed this part and learnt a little about Bash, too.

### Conclusion

In summary, we have gone through setting up Jekyll for the first time, installing and setting up `nginx` on our web server, and then pushing our Jekyll blog to the server's www directory using `rsync`. If you followed on further, then you also made a little script to help streamline the process.

I hope you enjoyed the tutorial, and I understand some parts aren't perfect. If you liked/disliked it, send me a message :).

More tutorials will be on their way soon!

#### Credits
* [How to set up a simple static website](https://www.digitalocean.com/community/questions/how-do-i-put-up-a-simple-static-website)
* [How to install nginx on Ubuntu 14.04](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-14-04-lts)
* [Initial server setup with Ubuntu 14.04](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-14-04)
* [Setting up a hostname with Digital Ocean](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-host-name-with-digitalocean)

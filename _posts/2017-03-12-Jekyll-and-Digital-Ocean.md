---
layout: post
title:  "Jekyll and Digital Ocean"
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

It should also be known that Jekyll is the engine behind [GitHub Pages](https://pages.github.com). If you have a GitHub account (hopefully you do already!), you can actually host your blog for free. There are of course limitations when comparing GitHub Pages to a VPS, so take that into consideration. Again, this tutorial focuses on setting up your VPS so that your Blog becomes live.

Firstly, we will be 'generating' the standard Jekyll website, creating a custom post for testing purposes then getting it up and running on Digital Ocean. What I want to make clear in this tutorial is that we won't be running a web server that is constantly building your Jekyll site. Instead, we will be moving files into the `_site` folder (this will become clearer later) which will then get immediately rendered when the site is refreshed.

Digital Ocean provides a web-based console interface that allows you to interact with your server. If you're familiar with this and happy to use it, then it is perfectly fine. On the other hand, it is generally faster to connect to your remote server using SSH (having a SSH Key Pair set up, hopefully). The response time is much quicker and it's smoother working in your own terminal. If you're using Windows, you can use [PuTTY](http://www.putty.org/) to connect to it.

Secondly, we will be writing a small bash script that you can execute in your terminal and also aliasing it. This script will push your changes to your website's remote directory, through [rsync](https://linux.die.net/man/1/rsync) over ssh, without you needing to log in every time. What this achieves, and complements, is writing blog posts (for example) offline then pushing them to your live website. Develop locally and publish your finished content.

So, let's get started!

### Making a website with Jekyll.

Open up your terminal and navigate to wherever you would like to begin coding. If it's your first time with Jekyll, you'll need to run the following command:
`gem install jekyll bundler`.

If you get a 'gem command not found' error, this could mean you don't have ruby installed. You can try running the following:
`gem -v` or `ruby -v`

If both commands return nothing, you (most likely) don't have Ruby installed. Visit [Tutorials Point - Ruby on Rails Installation](https://www.tutorialspoint.com/ruby-on-rails/rails-installation.htm) to get started.


After running 'gem install jekyll bundler', type in the following:
{% highlight bash %}
$ jekyll new my-awesome-site
$ cd my-awesome-site
$ bundle exec jekyll serve
{% endhighlight %}
You can change the name of "my-awesome-site" to whatever you want. In this case I'm using Jekyll's official example.
After running the bundle command, navigate to "localhost" in your browser.

Enter 'localhost:4000' in your address bar. Port 4000 is the default port, although  this can be changed by using the --port flag
`jekyll serve --port PORT`.

If you visit localhost:4000, you will see your site up and running. Have a play, click around, navigate through the lists and click on the default post, "Welcome to Jekyll!".

!!IMAGE!!

Here you can see the contents of the post.

Going back to the main page, you'll see the <b>posts</b> list which does at it says, lists all posts.

Now, open up another terminal and go into your directory you made for your Jekyll website. Look at the
contents of your directory and run `ls`.

You should see:
* Gemfile
* Gemfile.lock
* _config.yml
* _posts
* _site
* about.md
* index.md

Note: You do not need to touch anything inside your _site directory. Leave this alone.

Inside your _posts directory, you will see the post Welcome to Jekyll which was automatically generated.
Run the following:
{% highlight bash %}
$ cd _posts/
$ cp 2017-03-12-welcome-to-jekyll.markdown 2017-04-13-welcome-to-jekyll-number-two.markdown`
{% endhighlight %}
Open your newly copied file using a text-editor (nano, vi or vim if you're comfortable), and change the title and date field to the following:
{% highlight bash %}
title: "Welcome to Jekyll Number Two!"
date: 2017-04-13 (You can leave the time alone).
{% endhighlight %}

What you are doing here is changing the YAML front matter for the post. If you don't adjust this as well, your posts will appear identical. YAML Front Matter looks like this:
```bash
---
title: "Example Title" // YAML FRONT MATTER
---
### Your post content here..
```
This YAML front matter is read when your site gets built. We will come back to this at a later time, for now just trust me.
While your server is running, go back to the home page. You should see in your terminal that the site notices the file change.

On the home page you should see the two posts. The original, and the one we copied and slightly modified.
This is how easy it is to add posts to your website. Simply focus on your content, write it up, change it, give it a title, date, any other meta data you may want for it and put it in your _posts directory.

Now we are going to leave Jekyll alone for a bit, and come back to it later. But first, we should observe what has happened in the background with Jekyll.

The new post has been copied from your `_posts` directory and placed into the `_site` folder. If you go in there, you'll see your post there. You will only see the change if you put the new post in your `_posts` directory while the server was running, or if you re-run `jekyll serve`
It will be under the category 'Jekyll', then separated by folders corresponding to the date respectively.

What we'll be doing is pushing all of our locally generated _site content to our VPS web server.
All we need to do on our VPS, if not configured, is to get a simple 'index.html' page running. Once this is up, we can replace with it all of our Jekyll's _site content and view our website live.

SSH to your server and run the following:
```bash
$ sudo apt-get install nginx
```

We are installing nginx to run the webserver. Agree to the install via sudo, and then we need to start the service as nginx doesn't run automatically. Run the following:
```sudo service nginx start.```

Run this command to add nginx to your start up:
```update-rc.d nginx defaults```
Note: You may need `sudo` here.

Now we want to create our websites directory.
```bash
sudo mkdir /srv/www/
```

Now configure nginx to know where to serve files from. Open `/etc/nginx/sites-available/default` with a text editor and edit the line with root to say
`root /srv/www;`.
Let's save it, and then restart the nginx service so it takes effect
```bash
sudo service nginx restart
```

Let's test the server by creating a simple index.html file inside your /srv/www/ directory, and populating with Hello World.

```bash
$ cd /srv/www/
$ touch index.html
$ echo "Hello world!" >> index.html
```

Get your ip by running the following
```bash
<<code goes here>>
```

Navigate to your website by entering your IP into the address bar. If you have DNS set up, then feel free to use that.





#### Credits
* [How to set up a simple static website](https://www.digitalocean.com/community/questions/how-do-i-put-up-a-simple-static-website)
* [How to install nginx on Ubuntu 14.04](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-14-04-lts)
* [Initial server setup with Ubuntu 14.04](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-14-04)
* [Setting up a hostname with Digital Ocean](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-host-name-with-digitalocean)

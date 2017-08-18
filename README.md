[![Build Status](https://travis-ci.org/EdwinKato/bucket-list.svg?branch=master)](https://travis-ci.org/EdwinKato/bucket-list)
[![Coverage Status](https://coveralls.io/repos/github/EdwinKato/bucket-list/badge.svg?branch=master)](https://coveralls.io/github/EdwinKato/bucket-list?branch=master)

# bucket-list

A simple python application to manage the list of items on an individual's bucket-list. 

## online project links

[Flask api backend](https://yobucketlist.herokuapp.com/api/v1/ui/)

[Angular2 frontend](https://yo-bucketlist.herokuapp.com)

## Installation
 
Clone the GitHub repo:
 
http:
>`$ git clone https://github.com/EdwinKato/bucket-list.git`

cd into the folder and install a [virtual environment](https://virtualenv.pypa.io/en/stable/)

`$ virtualenv venv`

Activate the virtual environment

`$ venv/bin/activate`

Install all application requirements from the requirements file found in the root folder

`$ pip install -r requirements.txt`

Create migrations and upgrade

`$ python manage.py db init`

`$ python manage.py db migrate`

`$ python manage.py db upgrade`

All done! Now, start your server by running `python manage.py runserver`.

## Running using docker
Download [Docker](https://www.docker.com/products/overview). If you are on Mac or Windows, [Docker Compose](https://docs.docker.com/compose) will be automatically installed. On Linux, make sure you have the latest version of [Compose](https://docs.docker.com/compose/install/).

To run the project locally,
navigate to the root directory of the project in the terminal and run the following commands

```docker-compose build```

```docker-compose up```

### Supported End points

Endpoint | Functionality| Access
------------ | ------------- | -------------
POST bucketlist/app/v1/auth/login |Logs a user in | PUBLIC
POST bucketlist/app/v1/auth/register | Registers a user | PUBLIC
POST bucketlist/app/v1/bucketlists/ | Creates a new bucket list | PRIVATE
GET bucketlist/app/v1/bucketlists/ | Lists all created bucket lists | PRIVATE
GET bucketlist/app/v1/bucketlists/id | Gets a single bucket list with the suppled id | PRIVATE
PUT bucketlist/app/v1/bucketlists/id | Updates bucket list with the suppled id | PRIVATE
DELETE bucketlist/app/v1/bucketlists/id | Deletes bucket list with the suppled id | PRIVATE
POST bucketlist/app/v1/bucketlists/id/items/ | Creates a new item in bucket list | PRIVATE
PUT bucketlist/app/v1/bucketlists/id/items/item_id | Updates a bucket list item | PRIVATE
DELETE bucketlist/app/v1/bucketlists/id/items/item_id | Deletes an item in a bucket list | PRIVATE

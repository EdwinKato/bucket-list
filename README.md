# bucket-list

A simple python application to manage the list of items on an individual's bucket-list. 


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

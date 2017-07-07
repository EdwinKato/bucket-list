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

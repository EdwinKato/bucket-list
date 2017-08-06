# Use an official Python runtime as a parent image
FROM python:3.5

# Set the working directory to /api
WORKDIR /api

# Copy the current directory contents into the container at /api
ADD . /api

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

# Make port 80 available to the world outside this container
EXPOSE 80

# Define environment variable
ENV NAME World

# Run app.py when the container launches
# CMD ["python", "manage.py", "runserver"]

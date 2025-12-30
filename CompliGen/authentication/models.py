from django.db import models
from django.contrib.auth.models import User
# Create your models here.

# we have to set up the serializwers jwt apis
# password reset


# the company model
class Company(models.Model):
    name = models.CharField(max_length=255)
    industry = models.CharField(max_length=255)

# the Customer model
# one to one relationbship with the user and one to many with the company 
# there can be multiple roles within the company
# send email and if the user is not verified within 24 hrs the user will be deleted
class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=255)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    verified = models.BooleanField(default=False)


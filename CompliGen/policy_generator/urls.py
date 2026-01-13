from django.urls import path
from .views import *

# all the urls for generating the 5 docs
urlpatterns = [
    path('api/tos', TermsOfService.as_view(), name='ToS'),
    path('api/privacypolicy', PrivacyPolicy.as_view(), name='Privacy'),
    path('api/cookie', CookiePolicy.as_view(), name='Cookie'),
    path('api/dpa',  DataProcessisingAgreement.as_view(), name='dpa'),
    path('api/aup', AcceptableUsePolicy.as_view(), name='aup')
]
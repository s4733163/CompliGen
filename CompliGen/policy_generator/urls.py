from django.urls import path
from .views import *

# all the urls for generating the 5 docs
urlpatterns = [
    # generating policies and retrieving all
    path('api/tos', TermsOfServiceView.as_view(), name='ToS'),
    path('api/privacypolicy', PrivacyPolicyView.as_view(), name='Privacy'),
    path('api/cookie', CookiePolicyView.as_view(), name='Cookie'),
    path('api/dpa',  DataProcessisingAgreementView.as_view(), name='dpa'),
    path('api/aup', AcceptableUsePolicyView.as_view(), name='aup'),

    # basically deleting the policies
    path('api/tos/<int:id>', TermsOfServiceDeleteView.as_view(), name='tos-delete'),
    path('api/privacypolicy/<int:id>', PrivacyPolicyDeleteView.as_view(), name='privacy-delete'),
    path('api/cookie/<int:id>', CookiePolicyDeleteView.as_view(), name='cookie-delete'),
    path('api/dpa/<int:id>', DataProcessingAgreementDeleteView.as_view(), name='dpa-delete'),
    path('api/aup/<int:id>', AcceptableUsePolicyDeleteView.as_view(), name='aup-delete'),
    path('api/dashboard', DashboardView.as_view(), name='dashboard')
]

    
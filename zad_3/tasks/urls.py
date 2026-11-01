from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("api/tasks/", views.task_list, name="task_list"),   #zadanie 1
    path("api/tasks/<int:task_id>/", views.task_detail, name="task_detail"),
]
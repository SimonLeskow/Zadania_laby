from datetime import datetime

from django.http import HttpResponse
from django.shortcuts import render


def hello(request):
    return HttpResponse("Witaj w Django!")


def hello_name(request, name):
    return HttpResponse(f"Witaj, {name}!")


def hello_template(request, name):
    return render(request, "witaj/hello.html", {"name": name})


def current_time(request):
    now = datetime.now()
    return HttpResponse(
        f"Dzisiaj jest: {now:%d.%m.%Y}, godzina: {now:%H:%M}"
    )


# Create your views here.

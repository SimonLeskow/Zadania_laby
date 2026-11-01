from django.shortcuts import render
from django.http import JsonResponse
from .models import UtworMuzyczny


def index(request):
    return render(request, 'muzyka/index.html')


# Endpoint API zwracający dane w formacie JSON z filtrem po wykonawcy
def api_utwory(request):
    wykonawca_filter = request.GET.get('wykonawca')
    utwory = UtworMuzyczny.objects.all()

    if wykonawca_filter:
        utwory = utwory.filter(wykonawca__icontains=wykonawca_filter)

    data = [{
        "id": u.id,
        "wykonawca": u.wykonawca,
        "tytul": u.tytul,
        "gatunek": u.gatunek,
        "rok_wydania": u.rok_wydania,
        "ocena": u.ocena,
        "opis": u.opisowa_ocena
    } for u in utwory]

    return JsonResponse({"items": data})


# Zwraca listę unikalnych wykonawców z bazy danych
def api_autorzy(request):
    # Pobieramy unikalne nazwy wykonawców z bazy za pomocą ORM
    autorzy = UtworMuzyczny.objects.values_list('wykonawca', flat=True).distinct()
    return JsonResponse({"authors": list(autorzy)})
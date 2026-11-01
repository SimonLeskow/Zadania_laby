from django.db import models

class UtworMuzyczny(models.Model):
    wykonawca = models.CharField(max_length=150)
    tytul = models.CharField(max_length=150)
    gatunek = models.CharField(max_length=50)
    rok_wydania = models.IntegerField(default=2020)
    ocena = models.IntegerField()
    opisowa_ocena = models.TextField()

    def __str__(self):
        return f"{self.wykonawca} - {self.tytul} ({self.rok_wydania}) - {self.ocena}/100"

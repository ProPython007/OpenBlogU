from django.db import models
from django.contrib.auth.models import User


class Blog(models.Model):
    title = models.CharField(max_length=100)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    body = models.TextField()
    createdAt = models.DateTimeField(auto_now_add=True)  # Automatically set the field to now when the blog is created

    def __str__(self):
        return self.title

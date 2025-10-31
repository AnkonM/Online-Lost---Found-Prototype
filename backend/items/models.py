from django.db import models
from django.conf import settings
from django.utils import timezone


class Item(models.Model):
    """
    Model for lost/found items.
    """
    TYPE_CHOICES = [
        ('lost', 'Lost'),
        ('found', 'Found'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='items')
    title = models.CharField(max_length=200)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    description = models.TextField()
    location = models.CharField(max_length=200)
    date = models.DateField()
    image = models.ImageField(upload_to='items/', blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['type', 'status']),
            models.Index(fields=['title', 'description']),
            models.Index(fields=['date']),
        ]
    
    def __str__(self):
        return f"{self.title} ({self.type}) - {self.status}"


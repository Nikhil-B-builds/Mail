from django.contrib import admin
from .models import Email
# Register your models here.


class EmailAdmin(admin.ModelAdmin):
    list_display = ['user','sender',"display_recipients",'body','read',
                    'archived']
    
    @admin.display(description="Recipients")
    def display_recipients(self, obj):
        return ", ".join(
            recipient.email for recipient in obj.recipients.all()
        )
admin.site.register(Email,EmailAdmin)
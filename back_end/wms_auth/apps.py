from django.apps import AppConfig


class WmsAuthConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'wms_auth'

    def ready(self):
        import wms_auth.signals

from django.conf import settings
from django.contrib import admin
from django.urls import include, path, re_path
from django.conf.urls.static import static
from django.views.static import serve
from .api_auth_views import LoginView, LogoutView, AuthStatusView, SignupView, get_csrf_token
from . import admin as custom_admin  # noqa: F401 — registers admin customisation

# API endpoints — mounted under /api/v1/ in urlpatterns below.
# Frontend HTML is served by the SSR container (nginx routes / → ssr); Django
# only handles /api/, /admin/, /up, /media/.
api_patterns = [
    path("login/", LoginView.as_view(), name="api_login"),
    path("logout/", LogoutView.as_view(), name="api_logout"),
    path("signup/", SignupView.as_view(), name="api_signup"),
    path("auth_status/", AuthStatusView.as_view(), name="api_auth_status"),
    path("csrf_token/", get_csrf_token, name="api_csrf_token"),
    path("", include("users.urls")),
]

urlpatterns = [
    path("admin/", admin.site.urls),
    path("up/", include("up.urls")),
    path("api/v1/", include((api_patterns, "api"))),
    # User-uploaded media files (works in dev + prod; nginx may also handle this).
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]

# In dev (no nginx), let Django serve collected static files.
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Debug toolbar in dev only.
if not settings.TESTING:
    try:
        import debug_toolbar  # noqa: F401
        urlpatterns += [path("__debug__/", include("debug_toolbar.urls"))]
    except ImportError:
        pass

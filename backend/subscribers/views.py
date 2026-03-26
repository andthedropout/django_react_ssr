from django.db import IntegrityError
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Subscriber
from .serializers import SubscriberSerializer


@method_decorator(csrf_exempt, name="dispatch")
class SubscribeView(CreateAPIView):
    queryset = Subscriber.objects.all()
    serializer_class = SubscriberSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            self.perform_create(serializer)
        except IntegrityError:
            return Response(
                {"message": "You're already on the list!"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {"message": "You're in! We'll keep you posted.", **serializer.data},
            status=status.HTTP_201_CREATED,
        )

from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as django_filters
from .models import Item
from .serializers import ItemSerializer, ItemUpdateStatusSerializer


class ItemFilter(django_filters.FilterSet):
    type = django_filters.ChoiceFilter(choices=Item.TYPE_CHOICES)
    status = django_filters.ChoiceFilter(choices=Item.STATUS_CHOICES)
    date_from = django_filters.DateFilter(field_name='date', lookup_expr='gte')
    date_to = django_filters.DateFilter(field_name='date', lookup_expr='lte')
    
    class Meta:
        model = Item
        fields = ['type', 'status', 'date_from', 'date_to']


class ItemViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and managing items.
    """
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ItemFilter
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['created_at', 'date']
    ordering = ['-created_at']
    
    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action == 'create':
            permission_classes = [IsAuthenticated]
        elif self.action in ['update_status', 'pending_items']:
            permission_classes = [IsAdminUser]
        elif self.action in ['destroy', 'update', 'partial_update']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = []
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        """
        Optionally restricts the returned items to approved ones,
        or all items for admins, or user's own items.
        """
        queryset = Item.objects.all()
        
        # If not admin, only show approved items
        if not self.request.user.is_authenticated or not self.request.user.is_admin:
            queryset = queryset.filter(status='approved')
        
        return queryset
    
    def list(self, request, *args, **kwargs):
        """
        List all approved items (or all items for admins).
        """
        queryset = self.filter_queryset(self.get_queryset())
        
        # For non-admins, only show approved items
        if not request.user.is_authenticated or not request.user.is_admin:
            queryset = queryset.filter(status='approved')
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def create(self, request, *args, **kwargs):
        """
        Create a new item (always with 'pending' status).
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Ensure status is pending for new items
        item = serializer.save(user=request.user, status='pending')
        
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """
        Admin action to update item status (approve/reject).
        """
        item = self.get_object()
        serializer = ItemUpdateStatusSerializer(item, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': f'Item status updated to {item.status}',
                'item': ItemSerializer(item, context={'request': request}).data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def pending_items(self, request):
        """
        Admin action to get all pending items.
        """
        pending = Item.objects.filter(status='pending')
        serializer = self.get_serializer(pending, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def my_items(self, request):
        """
        Get current user's items.
        """
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Authentication required'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        items = Item.objects.filter(user=request.user)
        serializer = self.get_serializer(items, many=True, context={'request': request})
        return Response(serializer.data)


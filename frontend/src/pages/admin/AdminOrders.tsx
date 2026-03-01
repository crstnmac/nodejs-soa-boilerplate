import { useState } from 'react';
import { useAdminOrders, useUpdateOrderStatus, useCancelOrder } from '../../hooks/useAdmin';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { OrderStatus } from '../../types';
import { Trash2 } from 'lucide-react';

export default function AdminOrders() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const { data, isLoading } = useAdminOrders({
    page,
    limit: 20,
    status: statusFilter || undefined,
  });

  const updateOrderStatus = useUpdateOrderStatus();
  const cancelOrder = useCancelOrder();

  const orders = data?.data || [];
  const pagination = data?.pagination;

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    await updateOrderStatus.mutateAsync({ id: orderId, status: newStatus });
  };

  const handleCancelOrder = async (orderId: number) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      await cancelOrder.mutateAsync(orderId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case OrderStatus.PROCESSING:
        return 'bg-blue-100 text-blue-800';
      case OrderStatus.SHIPPED:
        return 'bg-purple-100 text-purple-800';
      case OrderStatus.DELIVERED:
        return 'bg-green-100 text-green-800';
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground mt-1">Manage and track orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-md bg-background"
        >
          <option value="">All Status</option>
          <option value={OrderStatus.PENDING}>Pending</option>
          <option value={OrderStatus.PROCESSING}>Processing</option>
          <option value={OrderStatus.SHIPPED}>Shipped</option>
          <option value={OrderStatus.DELIVERED}>Delivered</option>
          <option value={OrderStatus.CANCELLED}>Cancelled</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-pulse text-muted-foreground">Loading orders...</div>
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12 text-muted-foreground">
              No orders found
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <CardTitle className="text-xl">Order #{order.id}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                    <span className="text-2xl font-bold">${order.total}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">User ID:</span>
                      <span className="ml-2 font-medium">{order.userId}</span>
                    </div>
                    {order.shippingAddress && (
                      <div>
                        <span className="text-muted-foreground">Shipping Address:</span>
                        <span className="ml-2 font-medium">{order.shippingAddress}</span>
                      </div>
                    )}
                    {order.paymentMethod && (
                      <div>
                        <span className="text-muted-foreground">Payment Method:</span>
                        <span className="ml-2 font-medium">{order.paymentMethod}</span>
                      </div>
                    )}
                  </div>

                  {/* Order Items */}
                  {order.items && order.items.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3">Items ({order.items.length})</h4>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              {item.product?.image ? (
                                <img
                                  src={item.product.image}
                                  alt={item.product.name}
                                  className="h-12 w-12 rounded object-cover"
                                />
                              ) : null}
                              <div>
                                <div className="font-medium">{item.product?.name || 'Product'}</div>
                                <div className="text-sm text-muted-foreground">
                                  Qty: {item.quantity} × ${item.price}
                                </div>
                              </div>
                            </div>
                            <div className="font-medium">
                              ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="border-t pt-4">
                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Update Status:</span>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          disabled={updateOrderStatus.isPending}
                          className="px-3 py-1.5 text-sm border rounded-md bg-background"
                        >
                          <option value={OrderStatus.PENDING}>Pending</option>
                          <option value={OrderStatus.PROCESSING}>Processing</option>
                          <option value={OrderStatus.SHIPPED}>Shipped</option>
                          <option value={OrderStatus.DELIVERED}>Delivered</option>
                        </select>
                      </div>
                      {order.status !== OrderStatus.CANCELLED && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={cancelOrder.isPending}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Cancel Order
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

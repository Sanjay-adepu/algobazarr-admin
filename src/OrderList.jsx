const OrderList = ({ orders, onMarkDelivered }) => {
  return (
    <>
      <style>{`
        .order-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
          table-layout: fixed;
        }
        .order-table th,
        .order-table td {
          padding: 8px;
          text-align: left;
          border: 1px solid #ccc;
          word-wrap: break-word;
        }
        .order-table thead {
          background-color: #f2f2f2;
        }
        .status.pending {
          color: #d88605;
        }
        .status.completed {
          color: #13910b;
        }
        .status.cancelled {
          color: #b60707;
        }
        @media (max-width: 768px) {
          .order-table {
            font-size: 12px;
          }
          .order-table th,
          .order-table td {
            padding: 6px;
          }
        }
        @media (max-width: 480px) {
          .order-table {
            font-size: 10px;
          }
          .order-table th,
          .order-table td {
            padding: 4px;
            font-size:10px;
          }
        }
      `}</style>

      <table className="order-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Order ID</th>
            <th>Mobile</th>
            <th>Status</th>
            <th>Total Amount</th>
            <th>Created At</th>
            <th>Action</th> {/* New column */}
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => {
            const statusClass = order.status.toLowerCase();
            return (
              <tr key={index}>
                <td>{order.userName}</td>
                <td>{order.orderId}</td>
                <td>{order.address?.mobile}</td>
                <td>
                  <span className={`status ${statusClass}`}>
                    {order.status}
                  </span>
                </td>
                <td>{order.totalAmount}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>
                  {order.status !== 'Completed' ? (
                    <button onClick={() => onMarkDelivered(order.orderId)}>
                      Mark as Delivered
                    </button>
                  ) : (
                    <span>Delivered</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default OrderList;
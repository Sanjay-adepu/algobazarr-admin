import { useState } from 'react';

const OrderFilterForm = ({ onSearchByStatus }) => {
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (date && status) {
      onSearchByStatus(date, status);
    } else if (date) {
      onSearchByStatus(date, 'All');
    }
  };

  return (
    <>
      <style>
        {`
          .filter-form {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 600px;
            margin: 1rem auto;
            flex-wrap: nowrap;
          }

          .filter-form label {
            font-weight: 500;
            font-size: 1rem;
          }

          .filter-form input,
          .filter-form select {
            padding: 0.5rem 0.75rem;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 1rem;
            min-width: 130px;
          }

          .filter-form button {
            padding: 0.5rem 1rem;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            transition: background-color 0.3s ease;
            font-size: 1rem;
          }

          .filter-form button:hover {
            background-color: #0056b3;
          }

          @media (max-width: 500px) {
            .filter-form {
              gap: 0.5rem;
              padding: 0.5rem;
            }

            .filter-form label {
              font-size: 0.65rem;
            }

            .filter-form input,
            .filter-form select {
              padding: 0.3rem 0.4rem;
              font-size: 0.65rem;
              min-width: 80px;
            }

            .filter-form button {
              padding: 0.4rem 0.7rem;
              font-size: 0.65rem;
            }
          }
        `}
      </style>

      <form className="filter-form" onSubmit={handleSubmit}>
        <label htmlFor="date">Date:</label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default OrderFilterForm;
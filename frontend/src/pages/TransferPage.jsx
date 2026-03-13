import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTransaction } from '../api/transactionApi';

function TransferPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ senderAccountNumber: '', receiverAccountNumber: '', amount: '' });
  const [message, setMessage] = useState({ text: '', error: false });

  const mutation = useMutation({
    mutationFn: (data) => createTransaction(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setMessage({ text: `Transferencia exitosa. ID: ${res.data.id}, Monto: $${res.data.amount.toFixed(2)}`, error: false });
      setForm({ senderAccountNumber: '', receiverAccountNumber: '', amount: '' });
    },
    onError: (err) => {
      setMessage({ text: err.response?.data?.message || 'Error al realizar la transferencia', error: true });
    },
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({ text: '', error: false });
    mutation.mutate({ ...form, amount: parseFloat(form.amount) });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-900 mb-4 pb-2 border-b-2 border-emerald-600">Transferencia</h2>

      {message.text && (
        <div className={`mb-4 px-4 py-3 rounded-md text-sm ${message.error ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 p-5 bg-white rounded-lg shadow-sm">
        <input name="senderAccountNumber" placeholder="Cuenta origen" value={form.senderAccountNumber} onChange={handleChange} required
          className="flex-1 min-w-[150px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-900 text-sm" />
        <input name="receiverAccountNumber" placeholder="Cuenta destino" value={form.receiverAccountNumber} onChange={handleChange} required
          className="flex-1 min-w-[150px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-900 text-sm" />
        <input name="amount" type="number" step="0.01" min="0.01" placeholder="Monto" value={form.amount} onChange={handleChange} required
          className="flex-1 min-w-[150px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-900 text-sm" />
        <button type="submit" disabled={mutation.isPending}
          className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors text-sm font-medium disabled:opacity-50">
          {mutation.isPending ? 'Transfiriendo...' : 'Transferir'}
        </button>
      </form>
    </div>
  );
}

export default TransferPage;

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCustomers, createCustomer, deleteCustomer } from '../api/customerApi';

function CustomersPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ firstName: '', lastName: '', accountNumber: '', balance: '' });
  const [message, setMessage] = useState({ text: '', error: false });

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: () => getCustomers().then(res => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (data) => createCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setForm({ firstName: '', lastName: '', accountNumber: '', balance: '' });
      setMessage({ text: 'Cliente creado exitosamente', error: false });
    },
    onError: (err) => {
      setMessage({ text: err.response?.data?.message || 'Error al crear cliente', error: true });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
    onError: () => {
      setMessage({ text: 'Error al eliminar cliente', error: true });
    },
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({ text: '', error: false });
    createMutation.mutate({ ...form, balance: parseFloat(form.balance) });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-900 mb-4 pb-2 border-b-2 border-emerald-600">Clientes</h2>

      {message.text && (
        <div className={`mb-4 px-4 py-3 rounded-md text-sm ${message.error ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 mb-6 p-5 bg-white rounded-lg shadow-sm">
        <input name="firstName" placeholder="Nombre" value={form.firstName} onChange={handleChange} required
          className="flex-1 min-w-[150px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-900 text-sm" />
        <input name="lastName" placeholder="Apellido" value={form.lastName} onChange={handleChange} required
          className="flex-1 min-w-[150px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-900 text-sm" />
        <input name="accountNumber" placeholder="Numero de cuenta" value={form.accountNumber} onChange={handleChange} required
          className="flex-1 min-w-[150px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-900 text-sm" />
        <input name="balance" type="number" step="0.01" placeholder="Saldo inicial" value={form.balance} onChange={handleChange} required
          className="flex-1 min-w-[150px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-900 text-sm" />
        <button type="submit" disabled={createMutation.isPending}
          className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors text-sm font-medium disabled:opacity-50">
          {createMutation.isPending ? 'Creando...' : 'Crear Cliente'}
        </button>
      </form>

      {isLoading ? (
        <p className="text-gray-500">Cargando clientes...</p>
      ) : (
        <div className="overflow-hidden rounded-lg shadow-sm">
          <table className="w-full bg-white">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Nombre</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Apellido</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Cuenta</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Saldo</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-t border-gray-100 even:bg-emerald-50/50 hover:bg-emerald-50 transition-colors">
                  <td className="px-4 py-3 text-sm">{c.id}</td>
                  <td className="px-4 py-3 text-sm">{c.firstName}</td>
                  <td className="px-4 py-3 text-sm">{c.lastName}</td>
                  <td className="px-4 py-3 text-sm font-mono">{c.accountNumber}</td>
                  <td className="px-4 py-3 text-sm font-semibold">${c.balance?.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm">
                    <button onClick={() => deleteMutation.mutate(c.id)}
                      className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CustomersPage;

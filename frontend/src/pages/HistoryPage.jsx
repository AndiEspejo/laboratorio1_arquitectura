import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTransactionsByAccount } from '../api/transactionApi';

function HistoryPage() {
  const [accountNumber, setAccountNumber] = useState('');
  const [searchAccount, setSearchAccount] = useState('');

  const { data: transactions = [], isLoading, isError } = useQuery({
    queryKey: ['transactions', searchAccount],
    queryFn: () => getTransactionsByAccount(searchAccount).then(res => res.data),
    enabled: !!searchAccount,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchAccount(accountNumber);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-900 mb-4 pb-2 border-b-2 border-emerald-600">Historial de Transacciones</h2>

      <form onSubmit={handleSearch} className="flex gap-3 mb-6 p-5 bg-white rounded-lg shadow-sm">
        <input placeholder="Numero de cuenta" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-900 text-sm" />
        <button type="submit"
          className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors text-sm font-medium">
          Buscar
        </button>
      </form>

      {isLoading && <p className="text-gray-500">Buscando transacciones...</p>}
      {isError && <div className="mb-4 px-4 py-3 rounded-md text-sm bg-red-50 text-red-700 border border-red-200">Error al buscar transacciones</div>}

      {searchAccount && !isLoading && transactions.length === 0 && !isError && (
        <div className="mb-4 px-4 py-3 rounded-md text-sm bg-yellow-50 text-yellow-700 border border-yellow-200">
          No se encontraron transacciones para esta cuenta
        </div>
      )}

      {transactions.length > 0 && (
        <div className="overflow-hidden rounded-lg shadow-sm">
          <table className="w-full bg-white">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Cuenta Origen</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Cuenta Destino</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Monto</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-t border-gray-100 even:bg-emerald-50/50 hover:bg-emerald-50 transition-colors">
                  <td className="px-4 py-3 text-sm">{t.id}</td>
                  <td className="px-4 py-3 text-sm font-mono">{t.senderAccountNumber}</td>
                  <td className="px-4 py-3 text-sm font-mono">{t.receiverAccountNumber}</td>
                  <td className="px-4 py-3 text-sm font-semibold">${t.amount?.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm">{t.timestamp ? new Date(t.timestamp).toLocaleString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default HistoryPage;

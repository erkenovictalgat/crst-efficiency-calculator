import { useState, useEffect } from 'react';

interface WorkDetail {
  type: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface OrderInfo {
  address: string;
  orderType: string;
  date: string;
  amount: number;
  workDetails: WorkDetail[];
}

interface EmployeeData {
  name: string;
  totalOrders: number;
  totalAmount: number;
  orders: OrderInfo[];
  dailyStats: Record<string, { ordersCount: number; totalAmount: number }>;
  workTypes: Record<string, { totalQuantity: number; totalAmount: number }>;
}

interface EfficiencyResult {
  name: string;
  totalOrders: number;
  totalAmount: number;
  avgAmountPerOrder: number;
  workingDays: number;
  avgAmountPerDay: number;
  avgOrdersPerDay: number;
  topWorkTypes: Array<{ type: string; totalQuantity: number; totalAmount: number }>;
}

export default function EfficiencyCalculator() {
  const [efficiencyResults, setEfficiencyResults] = useState<EfficiencyResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const calculateEfficiency = async () => {
      try {
        setLoading(true);
        setError(null);

        // Read JSON data
        const response = await fetch('/orders-data.json');
        if (!response.ok) {
          throw new Error('Failed to load orders data');
        }
        const jsonData = await response.json();

        // Get first sheet data
        const sheetData = Object.values(jsonData)[0] as any[][];
        if (!sheetData) {
          throw new Error('No sheet data found');
        }

        // Headers (row 2, index 1)
        const headers = sheetData[1];
        
        // Rates (row 3, index 2)
        const rates = sheetData[2];
        
        // Orders data (starting from row 4, index 3)
        const ordersData = sheetData.slice(3);

        // Employee data structure
        const employees: Record<string, EmployeeData> = {};

        // Process each order
        ordersData.forEach((row) => {
          const employeeName = row[1];
          const address = row[2];
          const orderType = row[3];
          const orderDate = row[4];
          const totalAmount = row[56];

          if (!employeeName) return;

          // Convert Excel date to JavaScript date
          let jsDate: Date | null = null;
          if (orderDate && typeof orderDate === 'number') {
            jsDate = new Date(Math.round((orderDate - 25569) * 86400 * 1000));
          }

          // Initialize employee if not exists
          if (!employees[employeeName]) {
            employees[employeeName] = {
              name: employeeName,
              totalOrders: 0,
              totalAmount: 0,
              orders: [],
              dailyStats: {},
              workTypes: {}
            };
          }

          const employee = employees[employeeName];
          employee.totalOrders++;

          if (totalAmount && !isNaN(totalAmount)) {
            employee.totalAmount += totalAmount;
          }

          // Order info
          const orderInfo: OrderInfo = {
            address,
            orderType,
            date: jsDate ? jsDate.toISOString().split('T')[0] : 'N/A',
            amount: totalAmount || 0,
            workDetails: []
          };

          // Analyze work details (columns 6-56, indices 5-55)
          for (let i = 5; i <= 55; i++) {
            const workType = headers[i];
            const quantity = row[i];
            const rate = rates[i];

            if (quantity && quantity > 0 && workType) {
              const workAmount = quantity * (rate || 0);
              orderInfo.workDetails.push({
                type: workType,
                quantity,
                rate: rate || 0,
                amount: workAmount
              });

              // Work type statistics
              if (!employee.workTypes[workType]) {
                employee.workTypes[workType] = {
                  totalQuantity: 0,
                  totalAmount: 0
                };
              }
              employee.workTypes[workType].totalQuantity += quantity;
              employee.workTypes[workType].totalAmount += workAmount;
            }
          }

          employee.orders.push(orderInfo);

          // Daily statistics
          if (jsDate) {
            const dateKey = jsDate.toISOString().split('T')[0];
            if (!employee.dailyStats[dateKey]) {
              employee.dailyStats[dateKey] = {
                ordersCount: 0,
                totalAmount: 0
              };
            }
            employee.dailyStats[dateKey].ordersCount++;
            if (totalAmount && !isNaN(totalAmount)) {
              employee.dailyStats[dateKey].totalAmount += totalAmount;
            }
          }
        });

        // Calculate efficiency
        const results: EfficiencyResult[] = Object.values(employees).map((employee) => {
          // Average amount per order
          const avgAmountPerOrder = employee.totalOrders > 0 ? employee.totalAmount / employee.totalOrders : 0;

          // Working days
          const workingDays = Object.keys(employee.dailyStats).length;

          // Average amount per day
          const avgAmountPerDay = workingDays > 0 ? employee.totalAmount / workingDays : 0;

          // Average orders per day
          const avgOrdersPerDay = workingDays > 0 ? employee.totalOrders / workingDays : 0;

          // Top work types
          const topWorkTypes = Object.entries(employee.workTypes)
            .sort((a, b) => b[1].totalAmount - a[1].totalAmount)
            .slice(0, 5)
            .map(([type, stats]) => ({
              type,
              totalQuantity: stats.totalQuantity,
              totalAmount: Math.round(stats.totalAmount)
            }));

          return {
            name: employee.name,
            totalOrders: employee.totalOrders,
            totalAmount: Math.round(employee.totalAmount),
            avgAmountPerOrder: Math.round(avgAmountPerOrder),
            workingDays,
            avgAmountPerDay: Math.round(avgAmountPerDay),
            avgOrdersPerDay: Math.round(avgOrdersPerDay * 100) / 100,
            topWorkTypes
          };
        });

        // Sort by total amount
        results.sort((a, b) => b.totalAmount - a.totalAmount);

        setEfficiencyResults(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to calculate efficiency');
      } finally {
        setLoading(false);
      }
    };

    calculateEfficiency();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-600">Загрузка данных...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-600">Ошибка: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Эффективность сотрудников
      </h2>

      <div className="space-y-4">
        {efficiencyResults.map((emp, index) => (
          <div key={emp.name} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {index + 1}. {emp.name}
                </h3>
                <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Всего нарядов:</span>
                    <span className="ml-2 font-semibold text-gray-800">{emp.totalOrders}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Общая сумма:</span>
                    <span className="ml-2 font-semibold text-green-600">{emp.totalAmount.toLocaleString()} тг</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Средний доход за наряд:</span>
                    <span className="ml-2 font-semibold text-gray-800">{emp.avgAmountPerOrder.toLocaleString()} тг</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Рабочих дней:</span>
                    <span className="ml-2 font-semibold text-gray-800">{emp.workingDays}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Средний доход за день:</span>
                    <span className="ml-2 font-semibold text-blue-600">{emp.avgAmountPerDay.toLocaleString()} тг</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Среднее нарядов за день:</span>
                    <span className="ml-2 font-semibold text-gray-800">{emp.avgOrdersPerDay}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Топ видов работ:</h4>
              <div className="bg-gray-50 rounded-md p-3">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-600 border-b">
                      <th className="pb-2">Вид работы</th>
                      <th className="pb-2">Количество</th>
                      <th className="pb-2">Сумма</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emp.topWorkTypes.map((wt, idx) => (
                      <tr key={idx} className="border-b last:border-0">
                        <td className="py-2 text-gray-800">{wt.type}</td>
                        <td className="py-2 text-gray-600">{wt.totalQuantity}</td>
                        <td className="py-2 text-green-600 font-semibold">{wt.totalAmount.toLocaleString()} тг</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>

      {efficiencyResults.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          Нет данных для отображения
        </div>
      )}
    </div>
  );
}

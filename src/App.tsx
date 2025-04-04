import React, { useState } from "react";
interface PaymentBreakdown {
  month: number;
  payment: string;
  principalPaid: string;
  interestPaid: string;
  remainingBalance: string;
}

interface CalculationResult {
  totalPayment: string;
  totalInterest: string;
  interestPercentage: string;
  monthlyBreakdown: PaymentBreakdown[];
}

const App = () => {
  const [originalPrice, setOriginalPrice] = useState<string>("0");
  const [monthlyPayment, setMonthlyPayment] = useState<string>("0");
  const [months, setMonths] = useState<string>("0");
  const [calculationResult, setCalculationResult] =
    useState<CalculationResult | null>(null);
  const [error, setError] = useState("");

  const handleOriginalPriceChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setOriginalPrice(value);
      setError("");
    } else {
      setError("Please enter a valid number for Original Price");
    }
  };

  const handleMonthlyPaymentChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setMonthlyPayment(value);
      setError("");
    } else {
      setError("Please enter a valid number for Monthly Payment");
    }
  };

  const handleMonthsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setMonths(value);
      setError("");
    } else {
      setError("Please enter a valid number for Months");
    }
  };

  const calculateInstallment = () => {
    const originalPriceNum = parseFloat(originalPrice) || 0;
    const monthlyPaymentNum = parseFloat(monthlyPayment) || 0;
    const monthsNum = parseFloat(months) || 0;

    const totalPayment = monthlyPaymentNum * monthsNum;
    const totalInterest = totalPayment - originalPriceNum;
    const interestPercentage = (totalInterest / originalPriceNum) * 100;

    const monthlyBreakdown = [];
    let remainingBalance = originalPriceNum;

    for (let month = 1; month <= monthsNum; month++) {
      const isLastMonth = month === monthsNum;
      const payment = isLastMonth
        ? remainingBalance + totalInterest / monthsNum
        : monthlyPaymentNum;

      const interestForMonth = totalInterest / monthsNum;
      const principalForMonth = payment - interestForMonth;
      remainingBalance -= principalForMonth;

      monthlyBreakdown.push({
        month,
        payment: payment.toFixed(2),
        principalPaid: principalForMonth.toFixed(2),
        interestPaid: interestForMonth.toFixed(2),
        remainingBalance: Math.max(0, remainingBalance).toFixed(2),
      });
    }

    setCalculationResult({
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      interestPercentage: interestPercentage.toFixed(2),
      monthlyBreakdown,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    calculateInstallment();
  };

  return (
    <div className="w-full h-screen items-center justify-center">
      <div className="max-w-4xl m-auto p-5">
        <h1 className="text-2xl font-bold mb-6 text-blue-800">
          Installment Payment Calculator
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mb-8 grid md:grid-cols-3 gap-4"
        >
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">
              Original Price ($)
              <input
                type="text"
                value={originalPrice}
                onChange={handleOriginalPriceChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </label>
          </div>

          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">
              Monthly Payment ($)
              <input
                type="text"
                value={monthlyPayment}
                onChange={handleMonthlyPaymentChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </label>
          </div>

          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">
              Number of Months
              <input
                type="text"
                value={months}
                onChange={handleMonthsChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </label>
          </div>

          <div className="col-span-3">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Calculate
            </button>
          </div>
        </form>

        {calculationResult && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-3 text-blue-800">Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-3 rounded shadow">
                  <p className="text-gray-600">Original Price</p>
                  <p className="text-xl font-bold">${originalPrice}</p>
                </div>
                <div className="bg-white p-3 rounded shadow">
                  <p className="text-gray-600">Total Payment</p>
                  <p className="text-xl font-bold">
                    ${calculationResult.totalPayment}
                  </p>
                </div>
                <div className="bg-white p-3 rounded shadow">
                  <p className="text-gray-600">Total Interest</p>
                  <p className="text-xl font-bold text-red-600">
                    ${calculationResult.totalInterest}
                  </p>
                </div>
                <div className="bg-white p-3 rounded shadow">
                  <p className="text-gray-600">Interest Rate</p>
                  <p className="text-xl font-bold text-red-600">
                    {calculationResult.interestPercentage}%
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-3 text-blue-800">
                Payment Schedule
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-3 border text-left">Month</th>
                      <th className="py-2 px-3 border text-right">Payment</th>
                      <th className="py-2 px-3 border text-right">Principal</th>
                      <th className="py-2 px-3 border text-right">Interest</th>
                      <th className="py-2 px-3 border text-right">
                        Remaining Balance
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculationResult.monthlyBreakdown.map((payment) => (
                      <tr key={payment.month} className="hover:bg-gray-50">
                        <td className="py-2 px-3 border">{payment.month}</td>
                        <td className="py-2 px-3 border text-right">
                          ${payment.payment}
                        </td>
                        <td className="py-2 px-3 border text-right text-green-600">
                          ${payment.principalPaid}
                        </td>
                        <td className="py-2 px-3 border text-right text-red-600">
                          ${payment.interestPaid}
                        </td>
                        <td className="py-2 px-3 border text-right">
                          ${payment.remainingBalance}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
};
export default App;

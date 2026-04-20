export default function QuotaUsagePage() {
  const quotaData = [
    {
      title: "RESDEX",
      subtitle: "CV Access",
      total: 25000,
      usedAll: 16669,
      left: 8331,
      usedYou: 4102,
    },
    {
      title: "RESDEX",
      subtitle: "Nvite",
      total: 250000,
      usedAll: 4145,
      left: 245855,
      usedYou: 0,
    },
    {
      title: "JOB POSTING",
      subtitle: "Classified",
      total: 50,
      usedAll: 7,
      left: 43,
      usedYou: null,
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-gray-900">
          Quota usage
        </h1>
        <p className="text-sm text-gray-500">
          Track your and your company's quota
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quotaData.map((q, index) => {
          const percentage = Math.round(
            (q.usedAll / (q.usedAll + q.left)) * 100
          );

          return (
            <div
              key={index}
              className="bg-white border rounded-xl p-4 hover:shadow-sm transition"
            >
              <p className="text-xs font-semibold text-blue-600 uppercase">
                {q.title}
              </p>

              <p className="text-sm font-medium text-gray-800 mt-1">
                {q.total.toLocaleString()} {q.subtitle}
              </p>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>{q.usedAll.toLocaleString()} used by all</span>
                  <span>{q.left.toLocaleString()} left</span>
                </div>

                {q.usedYou !== null && (
                  <p className="text-xs text-gray-600 mt-1">
                    👤 {q.usedYou.toLocaleString()} used by you
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

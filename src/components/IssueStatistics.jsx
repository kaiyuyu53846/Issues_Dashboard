import { Card, CardContent } from './ui/card';

export default function IssueStatistics({ statistics }) {
  const {
    totalIssues,
    openIssues,
    closedIssues,
    highPriorityIssues,
    avgFailureRate,
    topTeams,
    topProjects
  } = statistics;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Issues */}
      <Card className="border border-gray-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Issues</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalIssues}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Open Issues */}
      <Card className="border border-gray-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Open Issues</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{openIssues}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🔴</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Closed Issues */}
      <Card className="border border-gray-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Closed Issues</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{closedIssues}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* High Priority Issues */}
      <Card className="border border-gray-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">High Priority</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{highPriorityIssues}</p>
              <p className="text-xs text-gray-500 mt-1">Failure Rate ≥ 8%</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Average Failure Rate */}
      <Card className="border border-gray-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Avg Failure Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{avgFailureRate.toFixed(1)}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Teams by Issue Count */}
      <Card className="border border-gray-300 col-span-1 md:col-span-2">
        <CardContent className="p-4">
          <p className="text-sm text-gray-600 font-medium mb-3">Top Teams by Issue Count</p>
          <div className="space-y-2">
            {topTeams.map((team, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{team.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${(team.count / topTeams[0].count) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-8 text-right">{team.count}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Projects by Issue Count */}
      <Card className="border border-gray-300">
        <CardContent className="p-4">
          <p className="text-sm text-gray-600 font-medium mb-3">Top Projects</p>
          <div className="space-y-2">
            {topProjects.map((project, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">{project.name}</span>
                <span className="text-gray-900 font-semibold">{project.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

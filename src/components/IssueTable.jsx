import { useState } from 'react';
import { Card, CardContent } from './ui/card';

export default function IssueTable({ filteredIssueGroups, onSort, sortKey, sortOrder, isIssueHighlighted }) {
  const SortIndicator = ({ column }) => (
    <span className="ml-1 text-gray-500">
      {sortKey === column ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
    </span>
  );

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'closed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'in progress':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getFailureRateColor = (rate) => {
    if (rate >= 8) return 'text-red-600 font-semibold';
    if (rate >= 5) return 'text-orange-600 font-medium';
    return 'text-gray-700';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Common Issues</h2>

      <div className="space-y-6">
        {filteredIssueGroups.map((group, idx) => (
          <Card key={idx} className="border border-gray-300">
            <CardContent className="p-4">
              {/* Group Header */}
              <div className="mb-3 pb-3 border-b border-gray-200">
                <h3 className="text-base font-semibold text-gray-900">{group.group}</h3>
                <p className="text-sm text-gray-600 mt-1">{group.summary}</p>
              </div>

              {/* Table Header */}
              <div className="grid grid-cols-13 gap-2 items-center bg-gray-100 px-3 py-2 rounded-md text-xs font-medium text-gray-700 mb-2">
                <div className="col-span-1 flex items-center cursor-pointer select-none" onClick={() => onSort('project')} title="Sort by Project">
                  Project <SortIndicator column="project" />
                </div>
                <div className="col-span-1 flex items-center cursor-pointer select-none" onClick={() => onSort('id')} title="Sort by Issue ID">
                  Issue ID <SortIndicator column="id" />
                </div>
                <div className="col-span-5 flex items-center cursor-pointer select-none" onClick={() => onSort('description')} title="Sort by Description">
                  Description <SortIndicator column="description" />
                </div>
                <div className="col-span-1 flex items-center cursor-pointer select-none" onClick={() => onSort('failureRate')} title="Sort by Failure Rate">
                  Failure Rate <SortIndicator column="failureRate" />
                </div>
                <div className="col-span-1 flex items-center cursor-pointer select-none" onClick={() => onSort('team')} title="Sort by Team">
                  Team <SortIndicator column="team" />
                </div>
                <div className="col-span-2 flex items-center cursor-pointer select-none" onClick={() => onSort('openDate')} title="Sort by Open Date">
                  Open Date <SortIndicator column="openDate" />
                </div>
                <div className="col-span-2 flex items-center cursor-pointer select-none" onClick={() => onSort('status')} title="Sort by Status">
                  Status <SortIndicator column="status" />
                </div>
              </div>

              {/* Table Body */}
              {group.issues.map(issue => {
                const isHighlighted = isIssueHighlighted(issue, group);
                return (
                  <div
                    key={issue.id}
                    className={`grid grid-cols-13 gap-2 items-center py-2 px-3 text-sm transition-colors ${
                      isHighlighted
                        ? 'bg-blue-50 hover:bg-blue-100'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="col-span-1 font-medium text-gray-800">{issue.project}</div>
                    <div className="col-span-1 text-blue-600 font-mono text-xs">{issue.id}</div>
                    <div className="col-span-5 text-gray-700">{issue.description}</div>
                    <div className={`col-span-1 ${getFailureRateColor(issue.failureRate)}`}>
                      {issue.failureRate}%
                    </div>
                    <div className="col-span-1 text-gray-600">{issue.team}</div>
                    <div className="col-span-2 text-gray-600 text-xs">{issue.openDate}</div>
                    <div className="col-span-2">
                      <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(issue.status)}`}>
                        {issue.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}

        {filteredIssueGroups.length === 0 && (
          <p className="text-sm text-gray-400 italic">No issues match the current filters.</p>
        )}
      </div>
    </div>
  );
}

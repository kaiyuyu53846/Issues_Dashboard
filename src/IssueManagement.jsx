// /mnt/data/issue_management_system_ui.jsx
import { useState, useRef, useEffect, useMemo, useDeferredValue } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LabelList, CartesianGrid } from 'recharts';
import { issueExamples, teamColors, teams, chartData } from '@/features/issues/data';
import { filterIssues, sortIssues, getWeeksAgo } from '@/features/issues/utils';

export default function IssueTrackerUI({ projectData }) {
  // === Project Info ===
  const currentProject = projectData?.name || 'ZKK';
  const cpuPlatform = projectData?.cpu?.map((c) => c.platform).join(', ') || 'Intel Raptor Lake H Refresh';
  const gpuModels = projectData?.gpu?.map((g) => g.model) || ['GN22-X2', 'GN22-X4', 'GN22-X6'];

  // === Filters / UI States ===
  const [selectedTeam, setSelectedTeam] = useState('All');
  const [selectedWeekRange, setSelectedWeekRange] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('Open');
  const [searchKeyword, setSearchKeyword] = useState('');
  const deferredKeyword = useDeferredValue(searchKeyword);

  // === Issue Table Sorting ===
  const [sortKey, setSortKey] = useState('id'); // 'id' | 'description' | 'team' | 'failureRate' | 'openDate' | 'status'
  const [sortAsc, setSortAsc] = useState(true);

  // Top10 / All view toggle
  const [showAll, setShowAll] = useState(false);

  // === Related Issues Drawer ===
  const [relatedIssues, setRelatedIssues] = useState([]);
  const [showRelated, setShowRelated] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);

  // === Related Sorting ===
  const [relatedSortKey, setRelatedSortKey] = useState('openDate');
  const [relatedSortAsc, setRelatedSortAsc] = useState(false);

  // === Chart Interactions ===
  const [highlightedTeam, setHighlightedTeam] = useState(null);

  // === Reset ===
  const handleResetFilters = () => {
    setSelectedTeam('All');
    setSelectedWeekRange('All');
    setSelectedStatus('Open');
    setSearchKeyword('');
    setSortKey('id');
    setSortAsc(true);
    setShowAll(false);
    setShowRelated(false);
    setSelectedIssue(null);
    setRelatedIssues([]);
    setRelatedSortKey('openDate');
    setRelatedSortAsc(false);
    setHighlightedTeam(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // === Date Helpers ===
  const today = useMemo(() => new Date(), []);
  const formattedDate = useMemo(() => today.toISOString().split('T')[0], [today]);

  // Last 5 weeks for chart focus
  const latestChartData = useMemo(() => chartData.slice(-5), []);

// === Top10 / All 基礎集（只在依賴變動時重算） ===
  const baseData = useMemo(() => {
    if (showAll) return issueExamples;
    return [...issueExamples]
      .filter((issue) => issue.status === 'Open')
      .sort((a, b) => b.failureRate - a.failureRate)
      .slice(0, 10);
  }, [showAll]);

  // === 過濾（含 team / week / status / keyword） ===
  const filteredIssues = useMemo(
    () =>
      filterIssues(baseData, {
        selectedWeekRange,
        selectedTeam,
        selectedStatus,
        keyword: deferredKeyword,
        today,
      }),
    [baseData, selectedWeekRange, selectedTeam, selectedStatus, deferredKeyword, today]
  );

  // === 排序結果（記憶化） ===
  const sortedIssues = useMemo(() => sortIssues(filteredIssues, sortKey, sortAsc), [filteredIssues, sortKey, sortAsc]);

  // === 表頭箭頭/切換 ===
  const handleSort = (key) => (sortKey === key ? setSortAsc(!sortAsc) : (setSortKey(key), setSortAsc(true)));
  const renderSortArrow = (key) =>
    sortKey === key && (sortAsc ? <span className="ml-1 text-gray-500">▲</span> : <span className="ml-1 text-gray-500">▼</span>);

  // === Team 顏色 / 刻度計算（記憶化） ===
  const { roundedMax, ticks } = useMemo(() => {
    const teamMaxValues = teams.map((team) => Math.max(...chartData.map((week) => week[team] || 0)));
    const maxIssueCount = Math.max(1, ...teamMaxValues);

    let tickStep;
    if (maxIssueCount <= 3) tickStep = 1;
    else if (maxIssueCount <= 10) tickStep = 2;
    else if (maxIssueCount <= 25) tickStep = 5;
    else if (maxIssueCount <= 50) tickStep = 10;
    else if (maxIssueCount <= 100) tickStep = 20;
    else tickStep = Math.ceil(maxIssueCount / 5 / 10) * 10;

    const maxRounded = Math.max(tickStep * 2, Math.ceil(maxIssueCount / tickStep) * tickStep);
    const tks = [];
    for (let i = 0; i <= maxRounded; i += tickStep) tks.push(i);

    return { roundedMax: maxRounded, ticks: tks };
  }, [chartData, teams]);

  // === Tooltip（保留原本展示，但清理為記憶化子元件） ===
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const weekData = chartData.find((d) => d.week === label);

      const teamStats = teams.map((team) => ({
        team,
        current: weekData[team] || 0,
        opened: weekData[`${team}_opened`] || 0,
        closed: weekData[`${team}_closed`] || 0,
        color: teamColors[team],
      }));

      const totalCurrent = teamStats.reduce((s, t) => s + t.current, 0);
      const totalOpened = teamStats.reduce((s, t) => s + t.opened, 0);
      const totalClosed = teamStats.reduce((s, t) => s + t.closed, 0);

      return (
        <div className="bg-white border rounded-md p-2 shadow-md text-sm font-medium text-center">
          <p className="font-semibold mb-2">{label}</p>

          <div className="grid grid-cols-4 gap-x-2 mb-1 text-gray-500 font-semibold text-xs">
            <span className="text-left">Team</span>
            <span>Current</span>
            <span className="text-green-600">Opened</span>
            <span className="text-red-500">Closed</span>
          </div>

          {teamStats.map((t, i) => (
            <div key={i} className="grid grid-cols-4 gap-x-2 font-mono text-[13px]">
              <span className="text-left" style={{ color: t.color }}>{t.team}</span>
              <span>{t.current}</span>
              <span className="text-green-600">{t.opened > 0 ? `+${t.opened}` : '—'}</span>
              <span className="text-red-500">{t.closed > 0 ? `-${t.closed}` : '—'}</span>
            </div>
          ))}

          <div className="mt-2 pt-1 border-t grid grid-cols-4 gap-x-2 font-semibold text-gray-700 text-[13px]">
            <span className="text-left">Total</span>
            <span>{totalCurrent}</span>
            <span className="text-green-600">+{totalOpened}</span>
            <span className="text-red-500">-{totalClosed}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap gap-3 justify-center select-none">
        {payload.map((entry, index) => (
          <div
            key={`legend-${index}`}
            onMouseDown={() => setHighlightedTeam(entry.value)}
            onMouseUp={() => setHighlightedTeam(null)}
            onMouseLeave={() => setHighlightedTeam(null)}
            className="flex items-center gap-1 cursor-pointer transition-all"
            title="長按可顯示資料點數字"
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor:
                  highlightedTeam && highlightedTeam !== entry.value ? '#d1d5db' : entry.color
              }}
            />
            <span
              style={{
                color:
                  highlightedTeam && highlightedTeam !== entry.value ? '#9ca3af' : entry.color
              }}
              className="text-sm"
            >
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // === Related Issue Demo ===
  const handleIssueClick = (issue) => {
    setSelectedIssue(issue);
    const relatedExamples = [
      { project: 'ZKA', id: 'ISSUE-28', description: 'Similar USB-C PD handshake timeout...', team: 'EE', failureRate: 8, openDate: '2025-10-20', status: 'Open' },
      { project: 'ZKA', id: 'ISSUE-16', description: 'USB-C charging failure...', team: 'EE', failureRate: 6, openDate: '2025-10-26', status: 'Closed' },
      { project: 'ZKM', id: 'ISSUE-25', description: 'Power negotiation unstable...', team: 'EE', failureRate: 5, openDate: '2025-11-02', status: 'Open' },
      { project: 'ZKN', id: 'ISSUE-31', description: 'BIOS boot delay under hybrid GPU mode', team: 'BIOS', failureRate: 7, openDate: '2025-10-30', status: 'Open' },
      { project: 'ZKO', id: 'ISSUE-32', description: 'EC fan table mismatch with BIOS version 1.4', team: 'EC', failureRate: 9, openDate: '2025-10-18', status: 'Open' },
      { project: 'ZKP', id: 'ISSUE-33', description: 'SSD not detected during POST intermittently', team: 'EE', failureRate: 8, openDate: '2025-10-16', status: 'Open' },
      { project: 'ZKO', id: 'ISSUE-34', description: 'Audio stuttering under heavy GPU load', team: 'Driver', failureRate: 4, openDate: '2025-11-05', status: 'Closed' },
      { project: 'ZKR', id: 'ISSUE-35', description: 'Type-C not delivering full power', team: 'EE', failureRate: 6, openDate: '2025-10-12', status: 'Closed' },
      { project: 'ZKR', id: 'ISSUE-36', description: 'Battery calibration drifts over time', team: 'Power', failureRate: 5, openDate: '2025-10-28', status: 'Open' },
      { project: 'ZKT', id: 'ISSUE-37', description: 'Fan curve anomaly under turbo boost', team: 'Thermal', failureRate: 6, openDate: '2025-10-15', status: 'Open' },
      { project: 'ZKM', id: 'ISSUE-38', description: 'Keyboard backlight not responding', team: 'ME', failureRate: 4, openDate: '2025-11-06', status: 'Open' },
      { project: 'ZKM', id: 'ISSUE-39', description: 'Panel color temperature drift', team: 'ME', failureRate: 3, openDate: '2025-10-29', status: 'Closed' },
      { project: 'ZKQ', id: 'ISSUE-40', description: 'USB hub not resuming after suspend', team: 'EE', failureRate: 8, openDate: '2025-11-04', status: 'Open' },
      { project: 'ZKM', id: 'ISSUE-41', description: 'BIOS password reset fails', team: 'BIOS', failureRate: 5, openDate: '2025-10-22', status: 'Closed' },
      { project: 'ZKS', id: 'ISSUE-42', description: 'Thermal pad compression loss over time', team: 'Thermal', failureRate: 7, openDate: '2025-10-26', status: 'Open' },
      { project: 'ZKM', id: 'ISSUE-43', description: 'SSD firmware crash during stress test', team: 'EE', failureRate: 10, openDate: '2025-11-01', status: 'Open' },
      { project: 'ZKV', id: 'ISSUE-44', description: 'Fan noise resonance under medium load', team: 'Thermal', failureRate: 4, openDate: '2025-10-18', status: 'Open' },
      { project: 'ZKO', id: 'ISSUE-45', description: 'Audio device not switching properly', team: 'Driver', failureRate: 6, openDate: '2025-10-27', status: 'Closed' },
      { project: 'ZKA', id: 'ISSUE-46', description: 'System freeze during hibernate resume', team: 'EE', failureRate: 9, openDate: '2025-10-31', status: 'Open' },
      { project: 'ZKL', id: 'ISSUE-47', description: 'BIOS downgrade fails to boot', team: 'BIOS', failureRate: 8, openDate: '2025-10-19', status: 'Closed' },
        ];
    setRelatedIssues(relatedExamples);
    setShowRelated(true);
  };


  // === Related Issue 統計 ===
  const relatedTeamStats = useMemo(() => {
    if (!relatedIssues.length) return [];

    const counts = relatedIssues.reduce((acc, issue) => {
      acc[issue.team] = (acc[issue.team] || 0) + 1;
      return acc;
    }, {});

    const total = relatedIssues.length;

    return Object.entries(counts)
      .map(([team, count]) => ({
        team,
        percent: ((count / total) * 100).toFixed(1),
      }))
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 3);
  }, [relatedIssues]);

  // === Related Table 滾動高度動態 ===
  const relatedTableRef = useRef(null);
  const firstRowRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(null);

  useEffect(() => {
    if (firstRowRef.current) {
      const rowHeight = firstRowRef.current.getBoundingClientRect().height;
      const totalHeight = rowHeight * 10; // 顯示 10 筆高度
      setContainerHeight(totalHeight);
    }
  }, [relatedIssues]);

  // === Related 排序 ===
  const handleRelatedSort = (key) =>
    relatedSortKey === key ? setRelatedSortAsc(!relatedSortAsc) : (setRelatedSortKey(key), setRelatedSortAsc(true));

  const renderRelatedSortArrow = (key) =>
    relatedSortKey === key && (relatedSortAsc ? <span className="ml-1 text-gray-500">▲</span> : <span className="ml-1 text-gray-500">▼</span>);

  // === 下拉選項 ===
  const teamOptions = useMemo(() => ['All', ...new Set(issueExamples.map((i) => i.team))], [issueExamples]);
  const weekOptions = useMemo(() => ([
    { label: 'All Weeks', value: 'All' },
    { label: 'Within 1 week', value: '1' },
    { label: '1–2 weeks', value: '1-2' },
    { label: '2–4 weeks', value: '2-4' },
    { label: 'Over 4 weeks', value: '4+' }
  ]), []);

  return (
    <div className="p-6 space-y-6">
      {/* === Project Info === */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
        <h1 className="text-2xl font-bold mb-2">Project: {currentProject}</h1>
        <p className="text-gray-700"><strong>CPU Platform:</strong> {cpuPlatform}</p>
        <p className="text-gray-700"><strong>GPU Models:</strong> {gpuModels.join(', ')}</p>
      </div>

      {/* === Issue List === */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold">
              Issue List {showAll ? '(All Issues)' : '(Top 10 Issues)'} —{' '}
              <span className="text-gray-500 text-sm">{formattedDate}</span>
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => alert('📤 Exporting issue list... (Demo only)')}
              title="匯出（示意）"
            >
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowAll(!showAll)}>
              {showAll ? 'Show Top 10' : 'Show All'}
            </Button>
          </div>
        </div>

        {/* === Filters === */}
        <div className="flex flex-wrap gap-4 mb-4 items-center">
          <Select value={selectedTeam} onValueChange={setSelectedTeam}>
            <SelectTrigger className="w-40" title="Filter by Team">
              <SelectValue placeholder="Filter by Team" />
            </SelectTrigger>
            <SelectContent>
              {teamOptions.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedWeekRange} onValueChange={setSelectedWeekRange}>
            <SelectTrigger className="w-40" title="Filter by Week Range">
              <SelectValue placeholder="Filter by Week Range" />
            </SelectTrigger>
            <SelectContent>
              {weekOptions.map((w) => (
                <SelectItem key={w.value} value={w.value}>{w.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-40" title="Filter by Status">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Search by keyword or ID..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-64"
              title="關鍵字搜尋（支援 ID 與描述）"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={handleResetFilters}
              className="bg-gray-100 hover:bg-gray-200"
              title="重置篩選"
            >
              Reset
            </Button>
          </div>
        </div>

        {/* === Table === */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                {[
                  ['id', 'Issue ID'],
                  ['description', 'Description'],
                  ['team', 'Team'],
                  ['failureRate', 'Failure Rate'],
                  ['openDate', 'Open Date'],
                  ['status', 'Status'],
                ].map(([key, label]) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    className="px-4 py-2 cursor-pointer select-none"
                    title={`Sort by ${label}`}
                  >
                    {label} {renderSortArrow(key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedIssues.map((issue) => {
                const weeksOpen = getWeeksAgo(today, issue.openDate);
                const isOverdue = issue.status === 'Open' && weeksOpen > 2; // 只有 open 且超過兩週才顯示
                const isClosed = issue.status === 'Closed';

                return (
                  <tr
                    key={issue.id}
                    className={`border-b hover:bg-gray-100 transition-colors ${
                      isClosed ? 'text-gray-400' : isOverdue ? 'bg-red-50' : ''
                    }`}
                  >
                    <td
                      className={`px-4 py-2 cursor-pointer ${isClosed ? 'text-gray-400' : 'text-blue-600'}`}
                      onClick={() => handleIssueClick(issue)}
                      title="查看相關問題"
                    >
                      {issue.id}
                    </td>

                    <td className="px-4 py-2 max-w-[480px] truncate" title={issue.description}>
                      {issue.description}
                    </td>

                    <td className="px-4 py-2">{issue.team}</td>
                    <td className="px-4 py-2">{issue.failureRate}%</td>

                    <td className="px-4 py-2 flex items-center gap-2">
                      <span>{issue.openDate}</span>
                      {isOverdue && (
                        <span
                          className="inline-block text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded"
                          title="Open 超過兩週"
                        >
                          Over 2 Weeks
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-2">{issue.status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* === Related Issues === */}
      {showRelated && (
        <div className="bg-white rounded-lg shadow-md p-4 relative">
          <button
            onClick={() => setShowRelated(false)}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 text-lg"
            title="關閉"
          >
            ✕
          </button>

          <h3 className="text-lg font-semibold mb-2">
            Related Issues for {currentProject} {selectedIssue?.id}
          </h3>

          {selectedIssue && (
            <div className="mb-4 bg-gray-50 border-l-4 border-blue-400 p-3 rounded text-gray-700 space-y-1">
              <p><strong>Issue Description:</strong> {selectedIssue.description}</p>
              <p><strong>Open Date:</strong> {selectedIssue.openDate}</p>
              <p><strong>Function Team:</strong> {selectedIssue.team}</p>
            </div>
          )}

          {/* === Function Team 百分比統計 === */}
          {relatedTeamStats.length > 0 && (
            <div className="mb-3 text-sm text-gray-500">
              {relatedTeamStats.map((t, i) => (
                <span key={t.team}>
                  {t.team}: {t.percent}%
                  {i < relatedTeamStats.length - 1 && ' · '}
                </span>
              ))}
            </div>
          )}

          <div
            ref={relatedTableRef}
            id="related-scroll-container"
            className="overflow-y-auto border rounded-lg"
            style={{ maxHeight: containerHeight ? `${containerHeight}px` : 'auto' }}
          >
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  {[
                    ['project', 'Project'],
                    ['id', 'Issue ID'],
                    ['description', 'Description'],
                    ['team', 'Team'],
                    ['failureRate', 'Failure Rate'],
                    ['openDate', 'Open Date'],
                    ['status', 'Status'],
                  ].map(([key, label]) => (
                    <th
                      key={key}
                      className="px-4 py-2 cursor-pointer select-none"
                      onClick={() => handleRelatedSort(key)}
                      title={`Sort by ${label}`}
                    >
                      {label} {renderRelatedSortArrow(key)}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {sortIssues(relatedIssues, relatedSortKey, relatedSortAsc).map((r, i) => (
                  <tr
                    key={`${r.id}-${i}`}
                    ref={i === 0 ? firstRowRef : null}
                    className="border-b hover:bg-gray-100 transition-colors"
                  >
                    <td className="px-4 py-2">{r.project}</td>
                    <td className="px-4 py-2">{r.id}</td>
                    <td className="px-4 py-2 max-w-[480px] truncate" title={r.description}>
                      {r.description}
                    </td>
                    <td className="px-4 py-2">{r.team}</td>
                    <td className="px-4 py-2">{r.failureRate}%</td>
                    <td className="px-4 py-2">{r.openDate}</td>
                    <td className="px-4 py-2">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* === Trend Chart === */}
      <div className="p-4 bg-white rounded-2xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Function Team Issue Trend ({currentProject})</h2>
          <p className="text-sm text-gray-500">(Hover to see issue count and weekly change)</p>
        </div>

        <ResponsiveContainer width="100%" height={340}>
          <LineChart data={latestChartData} margin={{ top: 40, right: 20, left: 50, bottom: 20 }}>
            <CartesianGrid stroke="#d3d5d9ff" strokeDasharray="10 3" vertical={false} />
            <XAxis dataKey="week" />
            <YAxis allowDecimals={false} domain={[0, roundedMax]} ticks={ticks} />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />

            {(highlightedTeam ? teams.filter((t) => t !== highlightedTeam) : teams).map((t) => {
              const isDimmed = Boolean(highlightedTeam && highlightedTeam !== t);

              return (
                <Line
                  key={t}
                  type="linear"
                  dataKey={t}
                  stroke={isDimmed ? '#d1d5db' : teamColors[t]}
                  strokeWidth={isDimmed ? 2 : 3}
                  strokeOpacity={isDimmed ? 0.4 : 0.9}
                  dot={{
                    r: isDimmed ? 0 : 4,
                    stroke: isDimmed ? '#d1d5db' : teamColors[t],
                    strokeWidth: 2,
                    fill: 'white',
                  }}
                  activeDot={{ r: 6, fill: isDimmed ? '#d1d5db' : teamColors[t] }}
                  animationDuration={highlightedTeam ? 200 : 0} // 放開後不重跑動畫，避免左到右的重繪
                  isAnimationActive={Boolean(highlightedTeam)}
                  z={isDimmed ? 1 : 5}
                />
              );
            })}

            {highlightedTeam && (
              <Line
                key={`${highlightedTeam}-focus`}
                type="linear"
                dataKey={highlightedTeam}
                stroke={teamColors[highlightedTeam]}
                strokeWidth={4.5}
                strokeOpacity={1}
                dot={{
                  r: 5,
                  stroke: teamColors[highlightedTeam],
                  strokeWidth: 2.5,
                  fill: 'white',
                }}
                activeDot={{ r: 7, fill: teamColors[highlightedTeam] }}
                animationDuration={200}
                isAnimationActive={true}
                z={10}
              >
                <LabelList
                  dataKey={highlightedTeam}
                  content={({ x, y, value, index }) => {
                    const offsetY = 20;
                    let dx = 0;
                    let dy = -offsetY;
                    let textAnchor = 'middle';

                    const totalPoints = latestChartData.length;
                    if (index === 0) {
                      textAnchor = 'start';
                      dx = 10;
                    } else if (index === totalPoints - 1) {
                      textAnchor = 'end';
                      dx = -10;
                    } else {
                      textAnchor = 'middle';
                      dx = 0;
                    }

                    return (
                      <text
                        x={x + dx}
                        y={y + dy}
                        textAnchor={textAnchor}
                        fill={teamColors[highlightedTeam]}
                        fontSize={14}
                        fontWeight={600}
                        style={{
                          textShadow: '0 0 2px white',
                          pointerEvents: 'none',
                          transition: 'all 0.1s ease',
                        }}
                      >
                        {value}
                      </text>
                    );
                  }}
                />
              </Line>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

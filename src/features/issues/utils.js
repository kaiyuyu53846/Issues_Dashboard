export const getWeeksAgo = (today, dateString) => {
  const date = new Date(dateString);
  const diffMs = today - date;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
};

export const filterIssues = (issues, { selectedWeekRange, selectedTeam, selectedStatus, keyword, today }) => {
  const kw = keyword.trim().toLowerCase();

  return issues.filter((issue) => {
    const weekDiff = getWeeksAgo(today, issue.openDate);

    const withinWeekRange =
      selectedWeekRange === 'All' ||
      (selectedWeekRange === '1' && weekDiff <= 1) ||
      (selectedWeekRange === '1-2' && weekDiff > 1 && weekDiff <= 2) ||
      (selectedWeekRange === '2-4' && weekDiff > 2 && weekDiff <= 4) ||
      (selectedWeekRange === '4+' && weekDiff > 4);

    const matchTeam = selectedTeam === 'All' || issue.team === selectedTeam;
    const matchStatus = selectedStatus === 'All' || issue.status === selectedStatus;

    const matchKeyword =
      kw.length === 0 ||
      issue.description.toLowerCase().includes(kw) ||
      issue.id.toLowerCase().includes(kw);

    return matchTeam && withinWeekRange && matchStatus && matchKeyword;
  });
};

export const sortIssues = (data, key, asc = true) => {
  const arr = [...data];
  const dir = asc ? 1 : -1;

  return arr.sort((a, b) => {
    if (key === 'failureRate') return (a[key] - b[key]) * dir;
    if (key === 'openDate') return (new Date(a[key]) - new Date(b[key])) * dir;

    const av = (a[key] ?? '').toString();
    const bv = (b[key] ?? '').toString();
    return av.localeCompare(bv) * dir;
  });
};

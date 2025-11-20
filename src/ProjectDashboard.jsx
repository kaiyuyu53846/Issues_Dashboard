import { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, ChevronDown, Check, ExternalLink } from "lucide-react";
import { projects } from '@/data/projects';
import { groupedIssues } from '@/data/issues';

/* ========= Styled Checkbox (灰色、2px角、含勾選動畫) ========= */
function StyledCheckbox({ checked, onChange }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      className={`w-4 h-4 flex items-center justify-center border cursor-pointer transition-all duration-200
        ${checked
          ? "bg-gray-700 border-gray-700 hover:shadow-[0_0_4px_rgba(100,100,100,0.5)]"
          : "border-gray-400 hover:border-gray-500 hover:bg-gray-50"
        } rounded-[2px]`}
    >
      {checked && <Check size={11} className="text-gray-100 animate-scaleIn" />}
    </div>
  );
}

/* ========= 動畫（如未在全域引入可放到你的 globals.css） ========= */
/*
@keyframes scaleIn {
  from { transform: scale(0.7); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.animate-scaleIn { animation: scaleIn 0.15s ease-out; }
*/

export default function ProjectDashboard({ onViewIssues }) {
  /* ---------- State ---------- */
  const [searchKeyword, setSearchKeyword] = useState('');       // 專案卡片搜尋（依專案名）
  const [selectedCPUs, setSelectedCPUs] = useState([]);         // 勾選的 CPU 型號
  const [selectedGPUs, setSelectedGPUs] = useState([]);         // 勾選的 GPU 型號
  const [showMore, setShowMore] = useState(false);              // 是否展開歷年專案
  const [selectedProjects, setSelectedProjects] = useState([]); // 勾選的專案名稱

  const [cpuMenuOpen, setCpuMenuOpen] = useState(false);
  const [gpuMenuOpen, setGpuMenuOpen] = useState(false);
  const [cpuMenuPos, setCpuMenuPos] = useState({ top: 0, left: 0 });
  const [gpuMenuPos, setGpuMenuPos] = useState({ top: 0, left: 0 });
  const [cpuMenuTimeout, setCpuMenuTimeout] = useState(null);
  const [gpuMenuTimeout, setGpuMenuTimeout] = useState(null);

  const cpuMenuRef = useRef(null);
  const gpuMenuRef = useRef(null);

  // Common Issues 狀態
  const [sortKey, setSortKey] = useState('openDate');
  const [sortOrder, setSortOrder] = useState('asc');

  const currentYear = new Date().getFullYear();

  const handleViewIssuesClick = (project) => {
    onViewIssues?.(project);
    // Bring IssueManagement into view immediately when rendered.
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  };

  /* ---------- 由資料動態建立系列→型號（基於所有專案） ---------- */
  const allGroupedCPUs = useMemo(() => {
    const map = {};
    projects.forEach(p => {
      p.cpu.forEach(({ series, platform }) => {
        if (!map[series]) map[series] = new Set();
        map[series].add(platform);
      });
    });
    return Object.fromEntries(
      Object.entries(map)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([series, set]) => [series, [...set].sort()])
    );
  }, [projects]);

  const allGroupedGPUs = useMemo(() => {
    const map = {};
    projects.forEach(p => {
      p.gpu.forEach(({ series, model }) => {
        if (!map[series]) map[series] = new Set();
        map[series].add(model);
      });
    });
    return Object.fromEntries(
      Object.entries(map)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([series, set]) => [series, [...set].sort()])
    );
  }, [projects]);

  /* ---------- 計算所有顯示的專案（用於生成 CPU/GPU 選項） ---------- */
  const projectsMatchingKeyword = useMemo(() => {
    return projects.filter(p => {
      // 如果專案被選中，則始終包含
      if (selectedProjects.includes(p.name)) {
        return true;
      }

      const keywordOK = p.name.toLowerCase().includes(searchKeyword.toLowerCase());

      const cpuOK = selectedCPUs.length === 0 || p.cpu.some(c => selectedCPUs.includes(c.platform));
      const gpuOK = selectedGPUs.length === 0 || p.gpu.some(g => selectedGPUs.includes(g.model));

      if (selectedCPUs.length > 0 && selectedGPUs.length > 0) {
        return keywordOK && cpuOK && gpuOK;
      } else if (selectedCPUs.length > 0) {
        return keywordOK && cpuOK;
      } else if (selectedGPUs.length > 0) {
        return keywordOK && gpuOK;
      } else {
        return keywordOK;
      }
    });
  }, [projects, searchKeyword, selectedCPUs, selectedGPUs, selectedProjects]);

  /* ---------- 基於當前符合條件的專案，動態生成 CPU/GPU 選項 ---------- */
  const groupedCPUs = useMemo(() => {
    const map = {};
    projectsMatchingKeyword.forEach(p => {
      p.cpu.forEach(({ series, platform }) => {
        if (!map[series]) map[series] = new Set();
        map[series].add(platform);
      });
    });
    return Object.fromEntries(
      Object.entries(map)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([series, set]) => [series, [...set].sort()])
    );
  }, [projectsMatchingKeyword]);

  const groupedGPUs = useMemo(() => {
    const map = {};
    projectsMatchingKeyword.forEach(p => {
      p.gpu.forEach(({ series, model }) => {
        if (!map[series]) map[series] = new Set();
        map[series].add(model);
      });
    });
    return Object.fromEntries(
      Object.entries(map)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([series, set]) => [series, [...set].sort()])
    );
  }, [projectsMatchingKeyword]);

  /* ---------- 動態可用 CPU / GPU 選項（考慮互相限制） ---------- */
  const availableCPUs = useMemo(() => {
    if (selectedGPUs.length === 0) return groupedCPUs;

    const allowedCPU = new Set();
    projectsMatchingKeyword.forEach(p => {
      if (p.gpu.some(g => selectedGPUs.includes(g.model))) {
        p.cpu.forEach(c => allowedCPU.add(c.platform));
      }
    });

    const filtered = {};
    Object.entries(groupedCPUs).forEach(([series, platforms]) => {
      const valid = platforms.filter(p => allowedCPU.has(p));
      if (valid.length > 0) filtered[series] = valid;
    });
    return filtered;
  }, [projectsMatchingKeyword, selectedGPUs, groupedCPUs]);

  const availableGPUs = useMemo(() => {
    if (selectedCPUs.length === 0) return groupedGPUs;

    const allowedGPU = new Set();
    projectsMatchingKeyword.forEach(p => {
      if (p.cpu.some(c => selectedCPUs.includes(c.platform))) {
        p.gpu.forEach(g => allowedGPU.add(g.model));
      }
    });

    const filtered = {};
    Object.entries(groupedGPUs).forEach(([series, models]) => {
      const valid = models.filter(g => allowedGPU.has(g));
      if (valid.length > 0) filtered[series] = valid;
    });
    return filtered;
  }, [projectsMatchingKeyword, selectedCPUs, groupedGPUs]);

  /* ---------- 專案卡片：智慧混合篩選 ---------- */
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      // 如果專案被選中，則始終顯示
      if (selectedProjects.includes(p.name)) {
        return true;
      }

      const keywordOK = p.name.toLowerCase().includes(searchKeyword.toLowerCase());

      const cpuOK =
        selectedCPUs.length === 0 ||
        p.cpu.some(c => selectedCPUs.includes(c.platform));

      const gpuOK =
        selectedGPUs.length === 0 ||
        p.gpu.some(g => selectedGPUs.includes(g.model));

      // 🧠 改進版 Smart Hybrid Logic
      // - 同時選 CPU & GPU → 必須同時符合（交集）
      // - 只選 CPU → 只看 CPU 是否符合
      // - 只選 GPU → 只看 GPU 是否符合
      // - 都沒選 → 全部顯示
      if (selectedCPUs.length > 0 && selectedGPUs.length > 0) {
        return keywordOK && cpuOK && gpuOK;
      } else if (selectedCPUs.length > 0) {
        return keywordOK && cpuOK;
      } else if (selectedGPUs.length > 0) {
        return keywordOK && gpuOK;
      } else {
        return keywordOK;
      }
    });
  }, [projects, searchKeyword, selectedCPUs, selectedGPUs, selectedProjects]);

  /* ---------- 自動清除不可見專案的選取狀態（僅限 CPU/GPU 篩選） ---------- */
  useEffect(() => {
    // 只有當 CPU 或 GPU 篩選改變時，才清除不符合條件的專案選取
    // 搜尋關鍵字不會影響專案選取狀態
    if (selectedCPUs.length === 0 && selectedGPUs.length === 0) {
      // 沒有 CPU/GPU 篩選時，不需要清除
      return;
    }

    const visibleProjectSet = new Set(
      projects.filter(p => {
        const cpuOK = selectedCPUs.length === 0 || p.cpu.some(c => selectedCPUs.includes(c.platform));
        const gpuOK = selectedGPUs.length === 0 || p.gpu.some(g => selectedGPUs.includes(g.model));

        if (selectedCPUs.length > 0 && selectedGPUs.length > 0) {
          return cpuOK && gpuOK;
        } else if (selectedCPUs.length > 0) {
          return cpuOK;
        } else if (selectedGPUs.length > 0) {
          return gpuOK;
        }
        return true;
      }).map(p => p.name)
    );

    const newSelectedProjects = selectedProjects.filter(name => visibleProjectSet.has(name));

    // 只有當選中的專案列表真的改變時才更新
    if (newSelectedProjects.length !== selectedProjects.length) {
      setSelectedProjects(newSelectedProjects);
    }
  }, [selectedCPUs, selectedGPUs]); // 只監聽 CPU/GPU 篩選變化

  /* ---------- 計算目前顯示專案對應的 CPU/GPU 型號 ---------- */
  // 只基於符合關鍵字/CPU/GPU篩選的專案，不包括僅因選定而顯示的專案
  const visibleCPUs = useMemo(() => {
    const set = new Set();
    filteredProjects.forEach(p => {
      // 排除僅因選定而顯示的專案
      if (selectedProjects.includes(p.name)) {
        // 檢查是否也符合關鍵字篩選
        const keywordOK = p.name.toLowerCase().includes(searchKeyword.toLowerCase());
        if (!keywordOK && searchKeyword.trim().length > 0) {
          return; // 僅因選定而顯示，不計入 CPU 選項
        }
      }
      p.cpu.forEach(c => set.add(c.platform));
    });
    return set;
  }, [filteredProjects, selectedProjects, searchKeyword]);

  const visibleGPUs = useMemo(() => {
    const set = new Set();
    filteredProjects.forEach(p => {
      // 排除僅因選定而顯示的專案
      if (selectedProjects.includes(p.name)) {
        // 檢查是否也符合關鍵字篩選
        const keywordOK = p.name.toLowerCase().includes(searchKeyword.toLowerCase());
        if (!keywordOK && searchKeyword.trim().length > 0) {
          return; // 僅因選定而顯示，不計入 GPU 選項
        }
      }
      p.gpu.forEach(g => set.add(g.model));
    });
    return set;
  }, [filteredProjects, selectedProjects, searchKeyword]);

  // 年份分組（以卡片篩選結果為準）
  const groupedByYear = useMemo(() => {
    return filteredProjects.reduce((acc, p) => {
      (acc[p.year] ||= []).push(p);
      return acc;
    }, {});
  }, [filteredProjects]);

  const currentProjects = groupedByYear[currentYear] || [];
  const otherYears = Object.keys(groupedByYear)
    .filter(y => parseInt(y) !== currentYear)
    .sort((a, b) => b - a);

  /* ---------- Menu：點擊外部關閉 ---------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cpuMenuRef.current && !cpuMenuRef.current.contains(e.target)) setCpuMenuOpen(false);
      if (gpuMenuRef.current && !gpuMenuRef.current.contains(e.target)) setGpuMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* ---------- Project Card Click Handler ---------- */
  const handleProjectClick = (projectName) => {
    setSelectedProjects(prev => {
      if (prev.includes(projectName)) {
        // 如果已選中，則取消選擇
        return prev.filter(p => p !== projectName);
      } else {
        // 如果未選中，則添加到選中列表
        return [...prev, projectName];
      }
    });
  };

  /* ---------- Reset（上半部 Project Filters） ---------- */
  const resetProjectFilters = () => {
    setSelectedCPUs([]);
    setSelectedGPUs([]);
    setSelectedProjects([]);
    setSearchKeyword('');
    // 重置 Common Issues 排序
    setSortKey('openDate');
    setSortOrder('asc');
    // 收回歷史年份專案
    setShowMore(false);
  };

  /* ---------- Issues：統一的區塊級篩選邏輯 ---------- */
  // 統一的判斷函數：檢查 issue 是否符合篩選條件（用於區塊顯示）
  const isIssueMatchingFilters = (issue, group) => {
    const keyword = searchKeyword.toLowerCase();

    // 1. 檢查專案是否符合 CPU/GPU 篩選
    const project = projects.find(p => p.name === issue.project);
    if (!project) return false;

    const cpuOK = selectedCPUs.length === 0 || project.cpu.some(c => selectedCPUs.includes(c.platform));
    const gpuOK = selectedGPUs.length === 0 || project.gpu.some(g => selectedGPUs.includes(g.model));

    let platformMatch = false;
    if (selectedCPUs.length > 0 && selectedGPUs.length > 0) {
      platformMatch = cpuOK && gpuOK;
    } else if (selectedCPUs.length > 0) {
      platformMatch = cpuOK;
    } else if (selectedGPUs.length > 0) {
      platformMatch = gpuOK;
    } else {
      platformMatch = true;
    }

    if (!platformMatch) return false;

    // 2. 檢查是否符合專案篩選
    const projectMatch = selectedProjects.length === 0 || selectedProjects.includes(issue.project);
    if (!projectMatch) return false;

    // 3. 如果專案被選中，則不檢查關鍵字（選中的專案的 issues 始終顯示）
    if (selectedProjects.length > 0 && selectedProjects.includes(issue.project)) {
      return true;
    }

    // 4. 檢查是否符合搜尋關鍵字（包括區塊名稱）
    if (keyword === '') return true;

    return (
      issue.project.toLowerCase().includes(keyword) ||
      issue.id.toLowerCase().includes(keyword) ||
      issue.description.toLowerCase().includes(keyword) ||
      group.group.toLowerCase().includes(keyword)
    );
  };

  // 判斷 issue 本身是否符合關鍵字（不包括區塊名稱，用於高亮顯示）
  const isIssueContentMatching = (issue, group) => {
    const keyword = searchKeyword.toLowerCase();

    // 1. 檢查專案是否符合 CPU/GPU 篩選
    const project = projects.find(p => p.name === issue.project);
    if (!project) return false;

    const cpuOK = selectedCPUs.length === 0 || project.cpu.some(c => selectedCPUs.includes(c.platform));
    const gpuOK = selectedGPUs.length === 0 || project.gpu.some(g => selectedGPUs.includes(g.model));

    let platformMatch = false;
    if (selectedCPUs.length > 0 && selectedGPUs.length > 0) {
      platformMatch = cpuOK && gpuOK;
    } else if (selectedCPUs.length > 0) {
      platformMatch = cpuOK;
    } else if (selectedGPUs.length > 0) {
      platformMatch = gpuOK;
    } else {
      platformMatch = true;
    }

    if (!platformMatch) return false;

    // 2. 如果專案被選中，高亮選定專案的 issues 或符合關鍵字的其他 issues
    if (selectedProjects.length > 0) {
      if (selectedProjects.includes(issue.project)) {
        return true; // 屬於選定專案，始終高亮
      }
      // 不屬於選定專案，檢查是否符合關鍵字（不包括專案名稱）
      if (keyword === '') return false; // 沒有關鍵字，不高亮
      return (
        issue.id.toLowerCase().includes(keyword) ||
        issue.description.toLowerCase().includes(keyword)
        // 注意：不包括 issue.project
      );
    }

    // 3. 沒有選定專案時，只有其他欄位符合關鍵字才高亮（不包括專案名稱）
    if (keyword === '') return false;

    return (
      issue.id.toLowerCase().includes(keyword) ||
      issue.description.toLowerCase().includes(keyword)
      // 注意：不包括 issue.project
    );
  };

  /* ---------- Issues：排序函數 ---------- */
  const compareValues = (a, b) => {
    if (sortKey === 'openDate') {
      return sortOrder === 'asc'
        ? new Date(a.openDate) - new Date(b.openDate)
        : new Date(b.openDate) - new Date(a.openDate);
    }
    const aVal = a[sortKey]?.toString().toLowerCase() ?? '';
    const bVal = b[sortKey]?.toString().toLowerCase() ?? '';
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  };

  /* ---------- Issues：以區塊為單位進行篩選 ---------- */
  const filteredIssueGroups = useMemo(() => {
    return groupedIssues
      .map(g => {
        // 檢查區塊中是否有任何一個 issue 符合所有篩選條件
        const hasMatch = g.issues.some(i => isIssueMatchingFilters(i, g));

        // 如果區塊有匹配項，顯示該區塊所有 issues（只排序，不過濾單個 issue）
        return {
          ...g,
          issues: hasMatch ? g.issues.sort(compareValues) : []
        };
      })
      .filter(g => g.issues.length > 0);
  }, [groupedIssues, searchKeyword, selectedCPUs, selectedGPUs, selectedProjects, projects, sortKey, sortOrder]);

  /* ---------- 計算可見專案名稱（用於統計和其他用途） ---------- */
  const visibleProjectNames = useMemo(() => {
    const names = new Set(filteredProjects.map(p => p.name));

    // 加入符合篩選條件的 issue 所屬專案（使用 isIssueContentMatching）
    filteredIssueGroups.forEach(g => {
      g.issues.forEach(i => {
        if (isIssueContentMatching(i, g)) {
          names.add(i.project);
        }
      });
    });

    return Array.from(names);
  }, [filteredProjects, filteredIssueGroups]);

  /* ---------- Issues：排序控制 ---------- */
  const handleSort = (key) => {
    if (key === sortKey) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortOrder('asc'); }
  };
  const SortIndicator = ({ column }) => (
    <span className="ml-1 text-gray-500">
      {sortKey === column ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
    </span>
  );

  /* ---------- Issues：Function Team 統計 ---------- */
  const getTeamStats = (issues) => {
    if (!issues || issues.length === 0) return [];
    const counts = issues.reduce((acc, i) => {
      acc[i.team] = (acc[i.team] || 0) + 1;
      return acc;
    }, {});
    const total = issues.length;
    return Object.entries(counts)
      .map(([team, count]) => ({ team, percent: ((count / total) * 100).toFixed(1) }))
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 3);
  };

  /* ---------- UI：Render ---------- */
  return (
    <div className="min-h-screen bg-gray-100">
      {/* ===== Project Overview ===== */}
      <div className="bg-white mt-8 mb-8 shadow-lg rounded-xl mx-4">
        <div className="p-8 pb-10">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-semibold text-gray-900">Project Overview</h1>
          </div>

        {/* 搜尋 + Reset */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Input
            type="text"
            placeholder="Search projects and issues..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full sm:w-72"
          />
          <Button variant="secondary" size="sm" onClick={resetProjectFilters} className="bg-gray-100 hover:bg-gray-200">
            Reset
          </Button>
        </div>

        {/* 篩選：CPU/GPU（系列→型號） */}
        <div className="space-y-2">
          {/* CPU */}
          <div className="flex flex-wrap gap-2 items-center relative" ref={cpuMenuRef}>
            <span className="text-sm font-medium text-gray-700">CPU：</span>
            {selectedCPUs.length === 0
              ? <span className="text-xs text-gray-500 px-2 py-1 border rounded-full bg-gray-50">All</span>
              : selectedCPUs.map(cpu => {
                  const active = visibleCPUs.has(cpu);
                  return (
                    <span
                      key={cpu}
                      className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border transition-colors duration-200 ${
                        active
                          ? "bg-blue-50 text-blue-700 border-blue-100"
                          : "bg-gray-50 text-gray-400 border-gray-200"
                      }`}
                    >
                      {cpu}
                      <button
                        onClick={() => setSelectedCPUs(selectedCPUs.filter(c => c !== cpu))}
                        className={`transition-colors ${
                          active ? "text-blue-400 hover:text-red-400" : "text-gray-400 hover:text-red-400"
                        }`}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  );
                })
            }

            <div className="relative">
              <button
                className="flex items-center text-xs px-2 py-1 border rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600"
                onClick={(e) => {
                  if (!cpuMenuOpen) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setCpuMenuPos({ top: rect.bottom + 4, left: rect.left });
                  }
                  setCpuMenuOpen(!cpuMenuOpen);
                  setGpuMenuOpen(false);
                }}
              >
                More <ChevronDown size={12} className="ml-1" />
              </button>
            </div>

            {cpuMenuOpen && (
              <div
                className="fixed bg-white border shadow-lg rounded-md z-50 w-64 animate-fadeIn"
                style={{ top: cpuMenuPos.top, left: cpuMenuPos.left }}
                onMouseEnter={() => { if (cpuMenuTimeout) { clearTimeout(cpuMenuTimeout); setCpuMenuTimeout(null); } }}
                onMouseLeave={() => { const t = setTimeout(() => setCpuMenuOpen(false), 600); setCpuMenuTimeout(t); }}
              >
                {Object.entries(availableCPUs).map(([series, models]) => (
                  <div key={series} className="relative group/series">
                    <div className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex justify-between items-center">
                      {series}
                      <ChevronDown size={14} className="transform rotate-[-90deg] text-gray-400 group-hover/series:text-gray-600" />
                    </div>
                    <div className="absolute top-0 left-full ml-1 group-hover/series:block hidden" style={{ zIndex: 60 }}>
                      {/* 防縫隙橋接 */}
                      <div className="absolute -left-1 top-0 w-1 h-full bg-transparent"></div>
                      <div className="bg-white border rounded-md shadow-md min-w-[220px]">
                        {models.map((cpu) => (
                          <label key={cpu} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <StyledCheckbox
                              checked={selectedCPUs.includes(cpu)}
                              onChange={(checked) => {
                                if (checked && !selectedCPUs.includes(cpu)) setSelectedCPUs([...selectedCPUs, cpu]);
                                else if (!checked) setSelectedCPUs(selectedCPUs.filter(c => c !== cpu));
                              }}
                            />
                            {cpu}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* GPU */}
          <div className="flex flex-wrap gap-2 items-center relative" ref={gpuMenuRef}>
            <span className="text-sm font-medium text-gray-700">GPU：</span>
            {selectedGPUs.length === 0
              ? <span className="text-xs text-gray-500 px-2 py-1 border rounded-full bg-gray-50">All</span>
              : selectedGPUs.map(gpu => {
                  const active = visibleGPUs.has(gpu);
                  return (
                    <span
                      key={gpu}
                      className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border transition-colors duration-200 ${
                        active
                          ? "bg-orange-50 text-orange-700 border-orange-100"
                          : "bg-gray-50 text-gray-400 border-gray-200"
                      }`}
                    >
                      {gpu}
                      <button
                        onClick={() => setSelectedGPUs(selectedGPUs.filter(g => g !== gpu))}
                        className={`transition-colors ${
                          active ? "text-orange-400 hover:text-red-400" : "text-gray-400 hover:text-red-400"
                        }`}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  );
                })
            }

            <div className="relative">
              <button
                className="flex items-center text-xs px-2 py-1 border rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600"
                onClick={(e) => {
                  if (!gpuMenuOpen) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setGpuMenuPos({ top: rect.bottom + 4, left: rect.left });
                  }
                  setGpuMenuOpen(!gpuMenuOpen);
                  setCpuMenuOpen(false);
                }}
              >
                More <ChevronDown size={12} className="ml-1" />
              </button>
            </div>

            {gpuMenuOpen && (
              <div
                className="fixed bg-white border shadow-lg rounded-md z-50 w-64 animate-fadeIn"
                style={{ top: gpuMenuPos.top, left: gpuMenuPos.left }}
                onMouseEnter={() => { if (gpuMenuTimeout) { clearTimeout(gpuMenuTimeout); setGpuMenuTimeout(null); } }}
                onMouseLeave={() => { const t = setTimeout(() => setGpuMenuOpen(false), 600); setGpuMenuTimeout(t); }}
              >
                {Object.entries(availableGPUs).map(([series, models]) => (
                  <div key={series} className="relative group/series">
                    <div className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex justify-between items-center">
                      {series}
                      <ChevronDown size={14} className="transform rotate-[-90deg] text-gray-400 group-hover/series:text-gray-600" />
                    </div>
                    <div className="absolute top-0 left-full ml-1 group-hover/series:block hidden" style={{ zIndex: 60 }}>
                      {/* 防縫隙橋接 */}
                      <div className="absolute -left-1 top-0 w-1 h-full bg-transparent"></div>
                      <div className="bg-white border rounded-md shadow-md min-w-[220px]">
                        {models.map((gpu) => (
                          <label key={gpu} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <StyledCheckbox
                              checked={selectedGPUs.includes(gpu)}
                              onChange={(checked) => {
                                if (checked && !selectedGPUs.includes(gpu)) setSelectedGPUs([...selectedGPUs, gpu]);
                                else if (!checked) setSelectedGPUs(selectedGPUs.filter(g => g !== gpu));
                              }}
                            />
                            {gpu}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      {/* ===== 當年度專案 ===== */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-semibold">
            {currentYear}
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Projects</h2>
        </div>
        {currentProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentProjects.map((p) => {
              const isSelected = selectedProjects.includes(p.name);
              return (
                <Card
                  key={p.name}
                  className={`relative transform transition-all duration-150 ease-out border-2 ${
                    isSelected
                      ? 'border-blue-600 bg-white shadow-[0_4px_12px_rgba(37,99,235,0.3)] scale-[1.02]'
                      : 'border-transparent hover:border-blue-300 hover:scale-[1.02] hover:shadow-lg'
                  }`}
                >
                  {/* Issue Button - Right Top Corner */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewIssuesClick(p);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors z-10"
                    title="View Issues"
                  >
                    <ExternalLink size={16} />
                  </button>

                  <CardContent className="p-4 cursor-pointer" onClick={() => handleProjectClick(p.name)}>
                    <h3 className={`text-lg font-semibold ${isSelected ? 'text-blue-600' : 'text-gray-800'}`}>
                      {p.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">CPU:</span> {p.cpu.map(c => c.platform).join(', ')}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">GPU:</span> {p.gpu.map(g => g.model).join(', ')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      ({[...new Set(p.cpu.map(c => c.series))].join(', ')} / {[...new Set(p.gpu.map(g => g.series))].join(', ')})
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-400 text-sm italic">No {currentYear} projects available.</p>
        )}
      </div>

      {/* 分隔線 + 展開按鈕 */}
      <div className="relative flex items-center justify-center mt-12 mb-8">
        <div className="w-full border-t border-gray-200"></div>
        <button
          onClick={() => setShowMore(!showMore)}
          className="group absolute -top-4 flex items-center justify-center w-9 h-9 rounded-full
                     bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300
                     transition-all duration-200 ease-out cursor-pointer shadow-sm"
          title={showMore ? 'Hide older projects' : 'Show more projects'}
        >
          <ChevronDown
            size={18}
            className={`text-gray-400 transition-transform duration-200 ease-out group-hover:text-gray-600 ${showMore ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* ===== 其他年份專案（依卡片篩選結果） ===== */}
      {showMore && otherYears.length > 0 && (
        <div className="space-y-6 mt-8">
          {otherYears.map((year, index) => (
            <div key={year} className="bg-gray-200/60 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gray-600 text-white px-3 py-1 rounded-md text-sm font-semibold">
                  {year}
                </div>
                <h2 className="text-lg font-semibold text-gray-800">Projects</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {groupedByYear[year].map((p) => {
                  const isSelected = selectedProjects.includes(p.name);
                  return (
                    <Card
                      key={p.name}
                      className={`relative transform transition-all duration-150 ease-out border-2 ${
                        isSelected
                          ? 'border-blue-600 bg-white shadow-[0_4px_12px_rgba(37,99,235,0.3)] scale-[1.02]'
                          : 'border-transparent hover:border-gray-400 hover:scale-[1.02] hover:shadow-lg'
                      }`}
                    >
                      {/* Issue Button - Right Top Corner */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewIssuesClick(p);
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors z-10"
                        title="View Issues"
                      >
                        <ExternalLink size={16} />
                      </button>

                      <CardContent className="p-4 cursor-pointer" onClick={() => handleProjectClick(p.name)}>
                        <h3 className={`text-lg font-semibold ${isSelected ? 'text-blue-600' : 'text-gray-800'}`}>
                          {p.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">CPU:</span> {p.cpu.map(c => c.platform).join(', ')}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">GPU:</span> {p.gpu.map(g => g.model).join(', ')}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          ({[...new Set(p.cpu.map(c => c.series))].join(', ')} / {[...new Set(p.gpu.map(g => g.series))].join(', ')})
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
      {showMore && otherYears.length === 0 && (
        <p className="text-gray-400 text-sm italic text-center mt-8">No older projects available.</p>
      )}
      </div>
    </div>

    {/* ===== Common Issues（依目前卡片可見專案） ===== */}
    <div className="bg-white mt-12 mb-8 shadow-lg rounded-xl mx-4">
      <div className="p-8 pb-10">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Common Issues</h1>
          </div>

        {/* Issues 群組卡片 */}
        <div className="space-y-8">
          {filteredIssueGroups.map(group => (
            <div key={group.group} className="rounded-xl border border-gray-100 shadow-sm p-6 bg-gray-50/50">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* 左側群組摘要 + Team 百分比 */}
                <div className="lg:col-span-1 flex flex-col justify-between border-r border-gray-200 pr-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{group.group}</h2>
                    <p className="text-sm text-gray-500">{group.summary}</p>
                  </div>
                  {getTeamStats(group.issues).length > 0 && (
                    <div className="text-sm text-gray-500 mt-4">
                      {getTeamStats(group.issues).map((t, i, arr) => (
                        <span key={t.team}>
                          {t.team}: {t.percent}%
                          {i < arr.length - 1 && ' · '}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 右側 Issue 表格 */}
                <div className="lg:col-span-4 divide-y border border-gray-200 rounded-lg shadow-sm bg-white">
                  {/* 表頭（含排序） */}
                  <div className="grid grid-cols-13 gap-2 text-sm font-bold text-gray-800 bg-gray-100 px-3 py-2 rounded-t-md">
                    <div className="col-span-2 flex items-center cursor-pointer select-none" onClick={() => handleSort('project')} title="Sort by Project">
                      Project <SortIndicator column="project" />
                    </div>
                    <div className="col-span-2 flex items-center cursor-pointer select-none" onClick={() => handleSort('id')} title="Sort by Issue ID">
                      Issue ID <SortIndicator column="id" />
                    </div>
                    <div className="col-span-4 flex items-center cursor-pointer select-none" onClick={() => handleSort('description')} title="Sort by Description">
                      Description <SortIndicator column="description" />
                    </div>
                    <div className="col-span-2 flex items-center cursor-pointer select-none" onClick={() => handleSort('team')} title="Sort by Function Team">
                      Function Team <SortIndicator column="team" />
                    </div>
                    <div className="col-span-1 flex items-center cursor-pointer select-none" onClick={() => handleSort('failureRate')} title="Sort by Failure Rate">
                      Failure <SortIndicator column="failureRate" />
                    </div>
                    <div className="col-span-1 flex items-center cursor-pointer select-none" onClick={() => handleSort('openDate')} title="Sort by Open Date">
                      Open Date <SortIndicator column="openDate" />
                    </div>
                    {/* 額外顯示狀態欄，排序鍵用 status */}
                    <div className="col-span-1 flex items-center cursor-pointer select-none" onClick={() => handleSort('status')} title="Sort by Status">
                      Status <SortIndicator column="status" />
                    </div>
                  </div>

                  {/* 表身 */}
                  {group.issues.map(issue => {
                    // 判斷這個 issue 本身是否符合篩選條件（不包括區塊名稱匹配）
                    const hasFilter = selectedCPUs.length > 0 || selectedGPUs.length > 0 || selectedProjects.length > 0 || searchKeyword.trim().length > 0;
                    const isHighlighted = hasFilter && isIssueContentMatching(issue, group);
                    return (
                      <div
                        key={issue.id}
                        className={`grid grid-cols-13 gap-2 items-center py-2 px-3 text-sm transition-colors ${
                          isHighlighted
                            ? 'bg-blue-50 hover:bg-blue-100'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <div className="col-span-2">{issue.project}</div>
                        <div className="col-span-2 text-blue-600 cursor-pointer" title="Click to view related issue">{issue.id}</div>
                        <div className="col-span-4 truncate" title={issue.description}>{issue.description}</div>
                        <div className="col-span-2">{issue.team}</div>
                        <div className="col-span-1">{issue.failureRate}%</div>
                        <div className="col-span-1 text-gray-600">{issue.openDate}</div>
                        <div className="col-span-1">{issue.status}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}

          {filteredIssueGroups.length === 0 && (
            <p className="text-sm text-gray-400 italic">No issues for current visible projects.</p>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}

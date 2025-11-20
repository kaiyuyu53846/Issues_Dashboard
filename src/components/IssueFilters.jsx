import { useState, useRef, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';

export default function IssueFilters({
  searchKeyword,
  setSearchKeyword,
  selectedCPUs,
  setSelectedCPUs,
  selectedGPUs,
  setSelectedGPUs,
  selectedTeams,
  setSelectedTeams,
  selectedStatus,
  setSelectedStatus,
  availableCPUs,
  availableGPUs,
  availableTeams,
  availableStatuses,
  onReset
}) {
  const [cpuMenuOpen, setCpuMenuOpen] = useState(false);
  const [gpuMenuOpen, setGpuMenuOpen] = useState(false);
  const [teamMenuOpen, setTeamMenuOpen] = useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);

  const cpuMenuRef = useRef(null);
  const gpuMenuRef = useRef(null);
  const teamMenuRef = useRef(null);
  const statusMenuRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cpuMenuRef.current && !cpuMenuRef.current.contains(e.target)) setCpuMenuOpen(false);
      if (gpuMenuRef.current && !gpuMenuRef.current.contains(e.target)) setGpuMenuOpen(false);
      if (teamMenuRef.current && !teamMenuRef.current.contains(e.target)) setTeamMenuOpen(false);
      if (statusMenuRef.current && !statusMenuRef.current.contains(e.target)) setStatusMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleCPU = (platform) => {
    setSelectedCPUs(prev =>
      prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
    );
  };

  const toggleGPU = (model) => {
    setSelectedGPUs(prev =>
      prev.includes(model) ? prev.filter(m => m !== model) : [...prev, model]
    );
  };

  const toggleTeam = (team) => {
    setSelectedTeams(prev =>
      prev.includes(team) ? prev.filter(t => t !== team) : [...prev, team]
    );
  };

  const toggleStatus = (status) => {
    setSelectedStatus(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Issue Filters</h2>
        <Button
          onClick={onReset}
          variant="outline"
          size="sm"
          className="text-sm"
        >
          Reset All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search Keyword */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Keyword
          </label>
          <Input
            type="text"
            placeholder="Search issues..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full"
          />
        </div>

        {/* CPU Filter */}
        <div ref={cpuMenuRef} className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CPU Platform
          </label>
          <button
            onClick={() => setCpuMenuOpen(!cpuMenuOpen)}
            className="w-full px-3 py-2 text-sm text-left bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {selectedCPUs.length > 0 ? `${selectedCPUs.length} selected` : 'All CPUs'}
          </button>
          {cpuMenuOpen && (
            <div className="absolute z-50 mt-1 w-full max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg">
              {Object.entries(availableCPUs).map(([series, platforms]) => (
                <div key={series} className="border-b border-gray-200 last:border-b-0">
                  <div className="px-3 py-2 bg-gray-100 text-xs font-semibold text-gray-700">
                    {series}
                  </div>
                  {platforms.map(platform => (
                    <label
                      key={platform}
                      className="flex items-center px-4 py-2 hover:bg-blue-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCPUs.includes(platform)}
                        onChange={() => toggleCPU(platform)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{platform}</span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* GPU Filter */}
        <div ref={gpuMenuRef} className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            GPU Model
          </label>
          <button
            onClick={() => setGpuMenuOpen(!gpuMenuOpen)}
            className="w-full px-3 py-2 text-sm text-left bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {selectedGPUs.length > 0 ? `${selectedGPUs.length} selected` : 'All GPUs'}
          </button>
          {gpuMenuOpen && (
            <div className="absolute z-50 mt-1 w-full max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg">
              {Object.entries(availableGPUs).map(([series, models]) => (
                <div key={series} className="border-b border-gray-200 last:border-b-0">
                  <div className="px-3 py-2 bg-gray-100 text-xs font-semibold text-gray-700">
                    {series}
                  </div>
                  {models.map(model => (
                    <label
                      key={model}
                      className="flex items-center px-4 py-2 hover:bg-blue-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedGPUs.includes(model)}
                        onChange={() => toggleGPU(model)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{model}</span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Team Filter */}
        <div ref={teamMenuRef} className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Team
          </label>
          <button
            onClick={() => setTeamMenuOpen(!teamMenuOpen)}
            className="w-full px-3 py-2 text-sm text-left bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {selectedTeams.length > 0 ? `${selectedTeams.length} selected` : 'All Teams'}
          </button>
          {teamMenuOpen && (
            <div className="absolute z-50 mt-1 w-full max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg">
              {availableTeams.map(team => (
                <label
                  key={team}
                  className="flex items-center px-4 py-2 hover:bg-blue-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedTeams.includes(team)}
                    onChange={() => toggleTeam(team)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">{team}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Status Filter */}
        <div ref={statusMenuRef} className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <button
            onClick={() => setStatusMenuOpen(!statusMenuOpen)}
            className="w-full px-3 py-2 text-sm text-left bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {selectedStatus.length > 0 ? `${selectedStatus.length} selected` : 'All Status'}
          </button>
          {statusMenuOpen && (
            <div className="absolute z-50 mt-1 w-full max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg">
              {availableStatuses.map(status => (
                <label
                  key={status}
                  className="flex items-center px-4 py-2 hover:bg-blue-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedStatus.includes(status)}
                    onChange={() => toggleStatus(status)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">{status}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

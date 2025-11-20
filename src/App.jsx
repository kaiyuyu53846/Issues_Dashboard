import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import ProjectDashboard from './ProjectDashboard'
import IssueManagement from './IssueManagement'

function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [selectedProject, setSelectedProject] = useState(null)

  const handleViewIssues = (project) => {
    setSelectedProject(project)
    setCurrentView('issues')
  }

  const handleBackToDashboard = () => {
    setCurrentView('dashboard')
    setSelectedProject(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'dashboard' && (
        <ProjectDashboard onViewIssues={handleViewIssues} />
      )}
      {currentView === 'issues' && (
        <div>
          {/* Back Button - Top Left */}
          <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
            <div className="px-6 py-4">
              <button
                onClick={handleBackToDashboard}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={18} strokeWidth={2.5} className="mt-[1px]" />
                <span className="font-medium">Back to Dashboard</span>
              </button>
            </div>
          </div>
          <IssueManagement projectData={selectedProject} />
        </div>
      )}
    </div>
  )
}

export default App

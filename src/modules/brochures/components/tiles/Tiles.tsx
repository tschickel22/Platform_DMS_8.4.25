/**
 * Brochure Builder - Dashboard Tiles
 * 
 * Main dashboard component showing overview tiles and quick actions.
 * Displays counts for templates and brochures, analytics summary,
 * and quick action buttons for creating brochures from different sources.
 * 
 * Tiles:
 * - Templates: Shows count and recent activity
 * - Brochures: Shows count and recent shares
 * - Analytics: Mini-summary of usage stats
 * - Quick Actions: Create from Inventory/Land/Listing/Quote
 * 
 * Navigation:
 * - All tiles link to appropriate views
 * - Quick actions navigate with source context
 * - No broken links, graceful fallbacks
 */

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Share2, 
  BarChart3, 
  Plus,
  Package,
  MapPin,
  Home,
  Calculator,
  TrendingUp,
  Clock,
  Users,
  Download
} from 'lucide-react'
import { useBrochureStore } from '../../store/useBrochureStore'
import { getSummary } from '../../utils/analytics'

/**
 * Individual tile component
 */
const DashboardTile: React.FC<{
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  onClick: () => void
  badge?: string
  trend?: { value: number; label: string }
  className?: string
}> = ({ title, value, subtitle, icon, onClick, badge, trend, className = '' }) => (
  <Card className={`cursor-pointer hover:shadow-md transition-shadow ${className}`} onClick={onClick}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="flex items-center space-x-2">
        {badge && <Badge variant="secondary" className="text-xs">{badge}</Badge>}
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      )}
      {trend && (
        <div className="flex items-center mt-2 text-xs">
          <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
          <span className="text-green-600">+{trend.value}</span>
          <span className="text-muted-foreground ml-1">{trend.label}</span>
        </div>
      )}
    </CardContent>
  </Card>
)

/**
 * Quick action button component
 */
const QuickAction: React.FC<{
  label: string
  description: string
  icon: React.ReactNode
  onClick: () => void
  disabled?: boolean
}> = ({ label, description, icon, onClick, disabled = false }) => (
  <Button
    variant="outline"
    className="h-auto p-4 flex items-start space-x-3 text-left hover:bg-gray-50"
    onClick={onClick}
    disabled={disabled}
  >
    <div className="flex-shrink-0 mt-0.5">{icon}</div>
    <div className="flex-1 min-w-0">
      <div className="font-medium text-sm">{label}</div>
      <div className="text-xs text-gray-600 mt-1">{description}</div>
    </div>
  </Button>
)

/**
 * Main tiles dashboard component
 */
export const Tiles: React.FC = () => {
  const navigate = useNavigate()
  const { listTemplates, listBrochures } = useBrochureStore()
  
  // Get current data
  const templates = listTemplates()
  const brochures = listBrochures()
  const analytics = getSummary()

  // Calculate recent activity
  const recentTemplates = templates.filter(t => {
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    return new Date(t.updatedAt) > dayAgo
  }).length

  const recentBrochures = brochures.filter(b => {
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    return new Date(b.createdAt) > dayAgo
  }).length

  // Navigation handlers
  const handleTemplatesClick = () => navigate('/brochures?tab=templates')
  const handleBrochuresClick = () => navigate('/brochures?tab=brochures')
  const handleAnalyticsClick = () => navigate('/brochures?tab=analytics')
  
  // Quick action handlers
  const handleQuickAction = (source: string, id?: string) => {
    const params = new URLSearchParams({ source })
    if (id) params.set('id', id)
    navigate(`/brochures/templates/new?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      {/* Overview tiles */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardTile
          title="Templates"
          value={templates.length}
          subtitle={`${recentTemplates} updated today`}
          icon={<FileText className="h-4 w-4 text-blue-600" />}
          onClick={handleTemplatesClick}
          trend={recentTemplates > 0 ? { value: recentTemplates, label: 'today' } : undefined}
        />
        
        <DashboardTile
          title="Brochures"
          value={brochures.length}
          subtitle={`${recentBrochures} created today`}
          icon={<Share2 className="h-4 w-4 text-green-600" />}
          onClick={handleBrochuresClick}
          trend={recentBrochures > 0 ? { value: recentBrochures, label: 'today' } : undefined}
        />
        
        <DashboardTile
          title="Total Shares"
          value={analytics.totalShares}
          subtitle={`${analytics.sharesThisWeek} this week`}
          icon={<Users className="h-4 w-4 text-purple-600" />}
          onClick={handleAnalyticsClick}
          badge={analytics.sharesThisWeek > 0 ? 'Active' : undefined}
        />
        
        <DashboardTile
          title="Downloads"
          value={analytics.totalDownloads}
          subtitle={`${analytics.downloadsThisWeek} this week`}
          icon={<Download className="h-4 w-4 text-orange-600" />}
          onClick={handleAnalyticsClick}
        />
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <QuickAction
              label="New from Inventory"
              description="Create brochure from vehicle inventory"
              icon={<Package className="w-5 h-5 text-blue-600" />}
              onClick={() => handleQuickAction('inventory')}
            />
            
            <QuickAction
              label="New from Land"
              description="Create brochure from land listing"
              icon={<MapPin className="w-5 h-5 text-green-600" />}
              onClick={() => handleQuickAction('land')}
            />
            
            <QuickAction
              label="New from Listing"
              description="Create brochure from property listing"
              icon={<Home className="w-5 h-5 text-purple-600" />}
              onClick={() => handleQuickAction('listing')}
            />
            
            <QuickAction
              label="New from Quote"
              description="Create brochure from quote builder"
              icon={<Calculator className="w-5 h-5 text-orange-600" />}
              onClick={() => handleQuickAction('quote')}
            />
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {templates.length === 0 && brochures.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No activity yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  Create your first template to get started
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Recent templates */}
                {templates.slice(0, 3).map((template) => (
                  <div 
                    key={template.id}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                    onClick={() => navigate(`/brochures/templates/${template.id}/edit`)}
                  >
                    <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{template.name}</p>
                      <p className="text-xs text-gray-600">
                        Updated {new Date(template.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {template.theme}
                    </Badge>
                  </div>
                ))}
                
                {/* Recent brochures */}
                {brochures.slice(0, 2).map((brochure) => {
                  const template = templates.find(t => t.id === brochure.templateId)
                  return (
                    <div 
                      key={brochure.id}
                      className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                      onClick={() => navigate(`/b/${brochure.publicId}`)}
                    >
                      <Share2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {template?.name || 'Untitled Brochure'}
                        </p>
                        <p className="text-xs text-gray-600">
                          Created {new Date(brochure.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {brochure.source && (
                        <Badge variant="secondary" className="text-xs">
                          {brochure.source.type}
                        </Badge>
                      )}
                    </div>
                  )
                })}
                
                {(templates.length > 3 || brochures.length > 2) && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full mt-2"
                    onClick={() => navigate('/brochures')}
                  >
                    View All Activity
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Analytics preview */}
      {analytics.totalShares > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Analytics Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{analytics.totalViews}</div>
                <div className="text-xs text-gray-600">Total Views</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{analytics.totalShares}</div>
                <div className="text-xs text-gray-600">Total Shares</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{analytics.totalDownloads}</div>
                <div className="text-xs text-gray-600">Downloads</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{analytics.ctaClicks}</div>
                <div className="text-xs text-gray-600">CTA Clicks</div>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleAnalyticsClick}
              >
                View Detailed Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Tiles
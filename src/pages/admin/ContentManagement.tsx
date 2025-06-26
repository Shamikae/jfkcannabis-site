import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Image, 
  Edit, 
  Trash2, 
  Eye, 
  Plus, 
  Search,
  Filter,
  Grid,
  List,
  MoreVertical,
  Calendar,
  User,
  Tag,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  Download,
  Upload,
  RefreshCw,
  Layout,
  Package,
  Gift,
  Home,
  ShoppingBag,
  Truck,
  Coffee,
  BookOpen,
  Crown,
  Settings,
  PenTool,
  Layers,
  Palette,
  Sparkles,
  Brain
} from 'lucide-react';
import PageEditor from '../../components/admin/PageEditor';
import MembershipEditor from '../../components/admin/MembershipEditor';
import SubscriptionEditor from '../../components/admin/SubscriptionEditor';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: string;
  category: string;
  tags: string[];
  status: 'published' | 'draft' | 'scheduled';
  publishDate: string;
  lastModified: string;
  views: number;
  comments: number;
  seoScore: number;
}

interface Banner {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  placement: 'home' | 'shop' | 'category' | 'global';
  status: 'active' | 'inactive' | 'scheduled';
  startDate: string;
  endDate: string;
  clicks: number;
  impressions: number;
}

interface Page {
  id: string;
  title: string;
  slug: string;
  description: string;
  featuredImage?: string;
  status: 'published' | 'draft';
  lastModified: string;
  views: number;
  type: 'page' | 'home' | 'shop' | 'delivery' | 'cafe' | 'memberships' | 'subscriptions';
}

interface AIBlogSuggestion {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  category: string;
  estimatedReadTime: number;
  relevanceScore: number;
  source: 'trends' | 'studies' | 'seasonal' | 'travel';
}

const ContentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pages');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<AIBlogSuggestion[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  // Editor states
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [creatingPage, setCreatingPage] = useState(false);
  const [editingMembership, setEditingMembership] = useState<string | null>(null);
  const [creatingMembership, setCreatingMembership] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<string | null>(null);
  const [creatingSubscription, setCreatingSubscription] = useState(false);

  useEffect(() => {
    // Mock data
    const mockBlogPosts: BlogPost[] = [
      {
        id: '1',
        title: 'Understanding Terpenes: The Aromatic Compounds in Cannabis',
        excerpt: 'Learn about how terpenes affect the aroma, flavor, and effects of different cannabis strains.',
        content: 'Full content here...',
        featuredImage: 'https://images.pexels.com/photos/7667724/pexels-photo-7667724.jpeg',
        author: 'Dr. Emily Chen',
        category: 'Education',
        tags: ['terpenes', 'science', 'effects'],
        status: 'published',
        publishDate: '2024-12-15T10:00:00Z',
        lastModified: '2024-12-14T15:30:00Z',
        views: 1250,
        comments: 23,
        seoScore: 85
      },
      {
        id: '2',
        title: 'The Entourage Effect: How Cannabinoids Work Together',
        excerpt: 'Discover how THC, CBD, and other cannabinoids interact to produce unique effects.',
        content: 'Full content here...',
        featuredImage: 'https://images.pexels.com/photos/7667551/pexels-photo-7667551.jpeg',
        author: 'Michael Rodriguez',
        category: 'Science',
        tags: ['cannabinoids', 'research', 'medical'],
        status: 'draft',
        publishDate: '',
        lastModified: '2024-12-18T09:15:00Z',
        views: 0,
        comments: 0,
        seoScore: 72
      },
      {
        id: '3',
        title: 'Cannabis and Creativity: What the Research Says',
        excerpt: 'Exploring the relationship between cannabis consumption and creative thinking.',
        content: 'Full content here...',
        featuredImage: 'https://images.pexels.com/photos/7667687/pexels-photo-7667687.jpeg',
        author: 'Jessica Williams',
        category: 'Lifestyle',
        tags: ['creativity', 'research', 'productivity'],
        status: 'scheduled',
        publishDate: '2024-12-25T08:00:00Z',
        lastModified: '2024-12-19T14:45:00Z',
        views: 0,
        comments: 0,
        seoScore: 78
      }
    ];

    // Mock banners
    const mockBanners: Banner[] = [
      {
        id: '1',
        title: 'Holiday Sale',
        description: '25% off all products',
        image: 'https://images.pexels.com/photos/7667724/pexels-photo-7667724.jpeg',
        link: '/sale',
        placement: 'home',
        status: 'active',
        startDate: '2024-12-15T00:00:00Z',
        endDate: '2024-12-31T23:59:59Z',
        clicks: 345,
        impressions: 2890
      },
      {
        id: '2',
        title: 'New Arrivals',
        description: 'Check out our latest products',
        image: 'https://images.pexels.com/photos/7667551/pexels-photo-7667551.jpeg',
        link: '/shop/new',
        placement: 'shop',
        status: 'scheduled',
        startDate: '2024-12-25T00:00:00Z',
        endDate: '2025-01-15T23:59:59Z',
        clicks: 0,
        impressions: 0
      }
    ];

    // Mock pages
    const mockPages: Page[] = [
      {
        id: 'home',
        title: 'Home Page',
        slug: '',
        description: 'Main landing page for JFK Cannabis',
        featuredImage: 'https://images.pexels.com/photos/7667641/pexels-photo-7667641.jpeg',
        status: 'published',
        lastModified: '2024-12-10T14:30:00Z',
        views: 12450,
        type: 'home'
      },
      {
        id: 'shop',
        title: 'Shop',
        slug: 'shop',
        description: 'Cannabis product catalog',
        featuredImage: 'https://images.pexels.com/photos/7667731/pexels-photo-7667731.jpeg',
        status: 'published',
        lastModified: '2024-12-12T10:15:00Z',
        views: 8790,
        type: 'shop'
      },
      {
        id: 'delivery',
        title: 'Delivery',
        slug: 'delivery',
        description: 'Cannabis delivery information',
        featuredImage: 'https://images.pexels.com/photos/2883510/pexels-photo-2883510.jpeg',
        status: 'published',
        lastModified: '2024-12-14T16:45:00Z',
        views: 3450,
        type: 'delivery'
      },
      {
        id: 'cafe',
        title: 'Cannabis Cafe',
        slug: 'cafe',
        description: 'JFK Cannabis Cafe information',
        featuredImage: 'https://images.pexels.com/photos/6306246/pexels-photo-6306246.jpeg',
        status: 'published',
        lastModified: '2024-12-15T11:20:00Z',
        views: 2890,
        type: 'cafe'
      },
      {
        id: 'memberships',
        title: 'Memberships',
        slug: 'memberships',
        description: 'Cannabis membership program',
        featuredImage: 'https://images.pexels.com/photos/3316926/pexels-photo-3316926.jpeg',
        status: 'published',
        lastModified: '2024-12-16T09:30:00Z',
        views: 1560,
        type: 'memberships'
      },
      {
        id: 'subscriptions',
        title: 'Subscription Boxes',
        slug: 'subscriptions',
        description: 'Cannabis subscription box service',
        featuredImage: 'https://images.pexels.com/photos/7667724/pexels-photo-7667724.jpeg',
        status: 'published',
        lastModified: '2024-12-17T13:45:00Z',
        views: 1890,
        type: 'subscriptions'
      },
      {
        id: 'about',
        title: 'About Us',
        slug: 'about',
        description: 'About JFK Cannabis',
        status: 'published',
        lastModified: '2024-12-18T15:10:00Z',
        views: 980,
        type: 'page'
      },
      {
        id: 'contact',
        title: 'Contact Us',
        slug: 'contact',
        description: 'Contact information',
        status: 'published',
        lastModified: '2024-12-19T10:25:00Z',
        views: 1230,
        type: 'page'
      },
      {
        id: 'faq',
        title: 'FAQ',
        slug: 'faq',
        description: 'Frequently asked questions',
        status: 'published',
        lastModified: '2024-12-20T14:15:00Z',
        views: 2340,
        type: 'page'
      }
    ];

    // AI-generated blog suggestions
    const mockAiSuggestions: AIBlogSuggestion[] = [
      {
        id: 'suggestion-1',
        title: 'Cannabis Tourism in New York: A Guide for International Travelers',
        description: 'Comprehensive guide for international tourists visiting New York who want to experience legal cannabis culture safely and responsibly.',
        keywords: ['cannabis tourism', 'international travelers', 'new york cannabis', 'jfk airport', 'legal cannabis'],
        category: 'Travel',
        estimatedReadTime: 12,
        relevanceScore: 92,
        source: 'travel'
      },
      {
        id: 'suggestion-2',
        title: 'CBN for Sleep: New Research Findings from 2025 Studies',
        description: 'Analysis of the latest scientific research on CBN\'s effectiveness for sleep improvement, dosage recommendations, and product selection.',
        keywords: ['cbn', 'sleep', 'research', 'insomnia', 'cannabinoids'],
        category: 'Science',
        estimatedReadTime: 15,
        relevanceScore: 89,
        source: 'studies'
      },
      {
        id: 'suggestion-3',
        title: 'Airport Layover Cannabis Guide: Making the Most of Your JFK Stopover',
        description: 'How to safely enjoy cannabis products during JFK Airport layovers, including delivery options, consumption areas, and legal considerations.',
        keywords: ['jfk airport', 'layover', 'cannabis delivery', 'airport lounge', 'connecting flights'],
        category: 'Travel',
        estimatedReadTime: 8,
        relevanceScore: 95,
        source: 'travel'
      },
      {
        id: 'suggestion-4',
        title: 'Winter Cannabis Strains: Seasonal Selections for Cold Weather',
        description: 'Curated list of cannabis strains particularly well-suited for winter months, focusing on mood elevation and seasonal affective disorder.',
        keywords: ['winter strains', 'seasonal cannabis', 'mood elevation', 'cold weather', 'seasonal affective disorder'],
        category: 'Seasonal',
        estimatedReadTime: 10,
        relevanceScore: 87,
        source: 'seasonal'
      },
      {
        id: 'suggestion-5',
        title: 'Terpene Profiles and Mood Enhancement: New Correlations from 2025 Research',
        description: 'Breaking down the latest scientific findings on how specific terpene profiles affect mood, with practical product recommendations.',
        keywords: ['terpenes', 'mood enhancement', 'scientific research', 'limonene', 'myrcene', 'linalool'],
        category: 'Science',
        estimatedReadTime: 14,
        relevanceScore: 91,
        source: 'studies'
      }
    ];

    setBlogPosts(mockBlogPosts);
    setBanners(mockBanners);
    setPages(mockPages);
    setAiSuggestions(mockAiSuggestions);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'draft':
      case 'inactive':
        return <XCircle className="h-4 w-4" />;
      case 'scheduled':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getPageIcon = (type: string) => {
    switch (type) {
      case 'home':
        return <Home className="h-5 w-5 text-blue-600" />;
      case 'shop':
        return <ShoppingBag className="h-5 w-5 text-green-600" />;
      case 'delivery':
        return <Truck className="h-5 w-5 text-orange-600" />;
      case 'cafe':
        return <Coffee className="h-5 w-5 text-amber-600" />;
      case 'memberships':
        return <Crown className="h-5 w-5 text-purple-600" />;
      case 'subscriptions':
        return <Package className="h-5 w-5 text-indigo-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (activeTab === 'blog') {
      if (selectedItems.length === blogPosts.length) {
        setSelectedItems([]);
      } else {
        setSelectedItems(blogPosts.map(post => post.id));
      }
    } else if (activeTab === 'banners') {
      if (selectedItems.length === banners.length) {
        setSelectedItems([]);
      } else {
        setSelectedItems(banners.map(banner => banner.id));
      }
    } else if (activeTab === 'pages') {
      if (selectedItems.length === pages.length) {
        setSelectedItems([]);
      } else {
        setSelectedItems(pages.map(page => page.id));
      }
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on items:`, selectedItems);
    // Implement bulk actions
    setSelectedItems([]);
  };

  const handleSavePage = (pageData: any) => {
    console.log('Saving page:', pageData);
    // Update pages list
    if (editingPage) {
      setPages(prev => prev.map(p => p.id === pageData.id ? pageData : p));
    } else {
      setPages(prev => [...prev, pageData]);
    }
    setEditingPage(null);
    setCreatingPage(false);
  };

  const handleSaveMembership = (tierData: any) => {
    console.log('Saving membership tier:', tierData);
    // Would update membership tiers in a real app
    setEditingMembership(null);
    setCreatingMembership(false);
  };

  const handleSaveSubscription = (planData: any) => {
    console.log('Saving subscription plan:', planData);
    // Would update subscription plans in a real app
    setEditingSubscription(null);
    setCreatingSubscription(false);
  };

  const handleCreateAiSuggestedPost = (suggestion: AIBlogSuggestion) => {
    console.log('Creating post from AI suggestion:', suggestion);
    // Would create a new draft post based on the suggestion
    alert(`Draft post created: "${suggestion.title}"`);
  };

  // If editing or creating content, show the appropriate editor
  if (editingPage || creatingPage) {
    return (
      <PageEditor 
        pageId={editingPage} 
        onBack={() => {
          setEditingPage(null);
          setCreatingPage(false);
        }}
        onSave={handleSavePage}
      />
    );
  }

  if (editingMembership || creatingMembership) {
    return (
      <MembershipEditor 
        tierId={editingMembership} 
        onBack={() => {
          setEditingMembership(null);
          setCreatingMembership(false);
        }}
        onSave={handleSaveMembership}
      />
    );
  }

  if (editingSubscription || creatingSubscription) {
    return (
      <SubscriptionEditor 
        planId={editingSubscription} 
        onBack={() => {
          setEditingSubscription(null);
          setCreatingSubscription(false);
        }}
        onSave={handleSaveSubscription}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600">Manage your website content and marketing materials</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn-outline flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button 
            className="btn-primary flex items-center"
            onClick={() => {
              if (activeTab === 'blog') {
                // Create new blog post
              } else if (activeTab === 'banners') {
                // Create new banner
              } else if (activeTab === 'pages') {
                setCreatingPage(true);
              } else if (activeTab === 'memberships') {
                setCreatingMembership(true);
              } else if (activeTab === 'subscriptions') {
                setCreatingSubscription(true);
              }
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            {activeTab === 'blog' ? 'New Post' : 
             activeTab === 'banners' ? 'New Banner' :
             activeTab === 'pages' ? 'New Page' :
             activeTab === 'memberships' ? 'New Tier' :
             activeTab === 'subscriptions' ? 'New Plan' : 'New Item'}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('pages')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
              activeTab === 'pages'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Layout className="h-4 w-4 mr-2" />
            Pages
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
              activeTab === 'blog'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FileText className="h-4 w-4 mr-2" />
            Blog Posts
          </button>
          <button
            onClick={() => setActiveTab('banners')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
              activeTab === 'banners'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Image className="h-4 w-4 mr-2" />
            Banners & Promotions
          </button>
          <button
            onClick={() => setActiveTab('memberships')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
              activeTab === 'memberships'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Crown className="h-4 w-4 mr-2" />
            Memberships
          </button>
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
              activeTab === 'subscriptions'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Package className="h-4 w-4 mr-2" />
            Subscription Boxes
          </button>
          <button
            onClick={() => setActiveTab('ai-suggestions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
              activeTab === 'ai-suggestions'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Brain className="h-4 w-4 mr-2" />
            AI Content Suggestions
          </button>
        </nav>
      </div>

      {/* Filters */}
      {activeTab !== 'ai-suggestions' && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              {activeTab === 'blog' && <option value="scheduled">Scheduled</option>}
            </select>

            {/* Category Filter - Only for Blog */}
            {activeTab === 'blog' && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Categories</option>
                <option value="education">Education</option>
                <option value="science">Science</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="medical">Medical</option>
              </select>
            )}

            {/* Placement Filter - Only for Banners */}
            {activeTab === 'banners' && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Placements</option>
                <option value="home">Home Page</option>
                <option value="shop">Shop Page</option>
                <option value="category">Category Pages</option>
                <option value="global">Global</option>
              </select>
            )}

            {/* Page Type Filter - Only for Pages */}
            {activeTab === 'pages' && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Page Types</option>
                <option value="home">Home Page</option>
                <option value="shop">Shop</option>
                <option value="delivery">Delivery</option>
                <option value="cafe">Cafe</option>
                <option value="memberships">Memberships</option>
                <option value="subscriptions">Subscriptions</option>
                <option value="page">Standard Pages</option>
              </select>
            )}
          </div>

          {/* View Controls */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={
                    activeTab === 'blog'
                      ? selectedItems.length === blogPosts.length && blogPosts.length > 0
                      : activeTab === 'banners'
                      ? selectedItems.length === banners.length && banners.length > 0
                      : activeTab === 'pages'
                      ? selectedItems.length === pages.length && pages.length > 0
                      : false
                  }
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">
                  {selectedItems.length > 0 ? `${selectedItems.length} selected` : 'Select all'}
                </span>
              </div>

              {selectedItems.length > 0 && (
                <div className="flex items-center space-x-2">
                  {activeTab === 'blog' && (
                    <button
                      onClick={() => handleBulkAction('publish')}
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      Publish
                    </button>
                  )}
                  <button
                    onClick={() => handleBulkAction('archive')}
                    className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                  >
                    Archive
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {activeTab === 'blog' 
                  ? blogPosts.length 
                  : activeTab === 'banners' 
                  ? banners.length 
                  : activeTab === 'pages'
                  ? pages.length
                  : 0} items
              </span>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'text-gray-400'}`}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-gray-400'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pages Tab */}
      {activeTab === 'pages' && (
        <div className="space-y-4">
          {pages.map(page => (
            <div 
              key={page.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-4 flex items-center">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(page.id)}
                  onChange={() => handleSelectItem(page.id)}
                  className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <div className="mr-3 p-2 bg-gray-100 rounded-lg">
                  {getPageIcon(page.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <h3 className="font-medium text-gray-900 mr-2">{page.title}</h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(page.status)}`}>
                      {getStatusIcon(page.status)}
                      <span className="ml-1 capitalize">{page.status}</span>
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <span className="mr-3">/{page.slug}</span>
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(page.lastModified).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Eye className="h-4 w-4 mr-1" />
                    {page.views.toLocaleString()}
                  </div>
                  <button 
                    className="p-1 text-gray-400 hover:text-gray-600"
                    onClick={() => window.open(`/${page.slug}`, '_blank')}
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    className="p-1 text-gray-400 hover:text-gray-600"
                    onClick={() => setEditingPage(page.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Blog Posts Tab */}
      {activeTab === 'blog' && (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {blogPosts.map(post => (
            <div 
              key={post.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {viewMode === 'grid' ? (
                <>
                  <div className="h-40 bg-gray-200 relative">
                    <img 
                      src={post.featuredImage} 
                      alt={post.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                        {getStatusIcon(post.status)}
                        <span className="ml-1 capitalize">{post.status}</span>
                      </span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(post.id)}
                        onChange={() => handleSelectItem(post.id)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-1">{post.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{new Date(post.publishDate || post.lastModified).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.tags.slice(0, 3).map(tag => (
                        <span 
                          key={tag}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          <span>{post.views}</span>
                        </div>
                        <div className="flex items-center">
                          <BarChart3 className="h-3 w-3 mr-1" />
                          <span>SEO: {post.seoScore}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-4 flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(post.id)}
                    onChange={() => handleSelectItem(post.id)}
                    className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                    <img 
                      src={post.featuredImage} 
                      alt={post.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <h3 className="font-medium text-gray-900 mr-2">{post.title}</h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                        {getStatusIcon(post.status)}
                        <span className="ml-1 capitalize">{post.status}</span>
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-1">{post.excerpt}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <User className="h-3 w-3 mr-1" />
                      <span className="mr-3">{post.author}</span>
                      <Calendar className="h-3 w-3 mr-1" />
                      <span className="mr-3">{new Date(post.publishDate || post.lastModified).toLocaleDateString()}</span>
                      <Eye className="h-3 w-3 mr-1" />
                      <span>{post.views}</span>
                    </div>
                  </div>
                  <div className="hidden md:flex flex-wrap gap-1 mr-4">
                    {post.tags.slice(0, 2).map(tag => (
                      <span 
                        key={tag}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        #{tag}
                      </span>
                    ))}
                    {post.tags.length > 2 && (
                      <span className="text-xs text-gray-500">+{post.tags.length - 2}</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Banners Tab */}
      {activeTab === 'banners' && (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {banners.map(banner => (
            <div 
              key={banner.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {viewMode === 'grid' ? (
                <>
                  <div className="h-40 bg-gray-200 relative">
                    <img 
                      src={banner.image} 
                      alt={banner.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(banner.status)}`}>
                        {getStatusIcon(banner.status)}
                        <span className="ml-1 capitalize">{banner.status}</span>
                      </span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(banner.id)}
                        onChange={() => handleSelectItem(banner.id)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2">{banner.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{banner.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <div className="flex items-center">
                        <Tag className="h-3 w-3 mr-1" />
                        <span className="capitalize">{banner.placement}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{new Date(banner.startDate).toLocaleDateString()} - {new Date(banner.endDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          <span>{banner.impressions}</span>
                        </div>
                        <div className="flex items-center">
                          <BarChart3 className="h-3 w-3 mr-1" />
                          <span>CTR: {banner.impressions ? ((banner.clicks / banner.impressions) * 100).toFixed(1) : 0}%</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-4 flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(banner.id)}
                    onChange={() => handleSelectItem(banner.id)}
                    className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                    <img 
                      src={banner.image} 
                      alt={banner.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <h3 className="font-medium text-gray-900 mr-2">{banner.title}</h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(banner.status)}`}>
                        {getStatusIcon(banner.status)}
                        <span className="ml-1 capitalize">{banner.status}</span>
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-1">{banner.description}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Tag className="h-3 w-3 mr-1" />
                      <span className="capitalize mr-3">{banner.placement}</span>
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{new Date(banner.startDate).toLocaleDateString()} - {new Date(banner.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 mr-4">
                    <div className="flex items-center text-xs text-gray-500">
                      <Eye className="h-3 w-3 mr-1" />
                      <span>{banner.impressions}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <BarChart3 className="h-3 w-3 mr-1" />
                      <span>CTR: {banner.impressions ? ((banner.clicks / banner.impressions) * 100).toFixed(1) : 0}%</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Memberships Tab */}
      {activeTab === 'memberships' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bronze Tier */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-2 bg-gradient-to-r from-amber-600 to-orange-600"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white mr-3">
                    <Star className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg">Bronze Explorer</h3>
                </div>
                <button 
                  className="text-primary-600 hover:text-primary-700"
                  onClick={() => setEditingMembership('bronze')}
                >
                  <Edit className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <div className="text-2xl font-bold text-neutral-900">
                  $19.99
                  <span className="text-base font-normal text-neutral-500">/month</span>
                </div>
                <div className="text-sm text-neutral-500">
                  $199.99/year
                </div>
              </div>
              
              <p className="text-neutral-600 mb-4 text-sm">Perfect for occasional cannabis users and beginners</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>5% discount on all purchases</span>
                </div>
                <div className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Monthly newsletter</span>
                </div>
                <div className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Access to member-only products</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                Active members: 156
              </div>
            </div>
          </div>
          
          {/* Silver Tier */}
          <div className="bg-white rounded-lg shadow-sm border-2 border-primary-600 overflow-hidden hover:shadow-md transition-shadow relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
            <div className="h-2 bg-gradient-to-r from-slate-400 to-slate-600"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-slate-400 to-slate-600 text-white mr-3">
                    <Crown className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg">Silver Connoisseur</h3>
                </div>
                <button 
                  className="text-primary-600 hover:text-primary-700"
                  onClick={() => setEditingMembership('silver')}
                >
                  <Edit className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <div className="text-2xl font-bold text-neutral-900">
                  $39.99
                  <span className="text-base font-normal text-neutral-500">/month</span>
                </div>
                <div className="text-sm text-neutral-500">
                  $399.99/year
                </div>
              </div>
              
              <p className="text-neutral-600 mb-4 text-sm">For regular users who appreciate quality and variety</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>10% discount on all purchases</span>
                </div>
                <div className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Bi-weekly curated product selections</span>
                </div>
                <div className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Access to premium member events</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                Active members: 234
              </div>
            </div>
          </div>
          
          {/* Gold Tier */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-2 bg-gradient-to-r from-yellow-500 to-amber-600"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-600 text-white mr-3">
                    <Zap className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Gold VIP</h3>
                    <span className="text-xs text-amber-600 font-medium">Approval Required</span>
                  </div>
                </div>
                <button 
                  className="text-primary-600 hover:text-primary-700"
                  onClick={() => setEditingMembership('gold')}
                >
                  <Edit className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <div className="text-2xl font-bold text-neutral-900">
                  $79.99
                  <span className="text-base font-normal text-neutral-500">/month</span>
                </div>
                <div className="text-sm text-neutral-500">
                  $799.99/year
                </div>
              </div>
              
              <p className="text-neutral-600 mb-4 text-sm">Ultimate cannabis experience for enthusiasts and travelers</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>15% discount on all purchases</span>
                </div>
                <div className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Private lounge access</span>
                </div>
                <div className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>Personal cannabis consultant</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                Active members: 78
              </div>
            </div>
          </div>
          
          {/* Add New Tier Card */}
          <div 
            className="bg-white rounded-lg shadow-sm border border-dashed border-gray-300 overflow-hidden hover:bg-gray-50 cursor-pointer"
            onClick={() => setCreatingMembership(true)}
          >
            <div className="p-6 flex flex-col items-center justify-center h-full">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Plus className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Add New Membership Tier</h3>
              <p className="text-sm text-gray-500 text-center">
                Create a new membership tier with custom benefits and pricing
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Subscriptions Tab */}
      {activeTab === 'subscriptions' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Weekly Plan */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-primary-100 p-3 rounded-full mr-3">
                    <Package className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="font-bold text-lg">Weekly Explorer</h3>
                </div>
                <button 
                  className="text-primary-600 hover:text-primary-700"
                  onClick={() => setEditingSubscription('weekly')}
                >
                  <Edit className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <div className="text-2xl font-bold text-neutral-900">
                  $49.99
                </div>
                <div className="text-sm text-neutral-500">
                  per week
                </div>
              </div>
              
              <p className="text-neutral-600 mb-4 text-sm">Perfect for daily users who love variety</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <Star className="h-4 w-4 text-primary-600 mr-2 flex-shrink-0" />
                  <span>3-4 premium products</span>
                </div>
                <div className="flex items-center text-sm">
                  <Star className="h-4 w-4 text-primary-600 mr-2 flex-shrink-0" />
                  <span>Mix of flower, edibles, and concentrates</span>
                </div>
                <div className="flex items-center text-sm">
                  <Star className="h-4 w-4 text-primary-600 mr-2 flex-shrink-0" />
                  <span>Educational materials included</span>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full inline-block mb-2">
                  Save 10%
                </div>
                <div className="text-sm text-neutral-500">
                  4 products included
                </div>
              </div>
            </div>
          </div>
          
          {/* Bi-Weekly Plan */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-primary-100 p-3 rounded-full mr-3">
                    <Package className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="font-bold text-lg">Bi-Weekly Discovery</h3>
                </div>
                <button 
                  className="text-primary-600 hover:text-primary-700"
                  onClick={() => setEditingSubscription('biweekly')}
                >
                  <Edit className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <div className="text-2xl font-bold text-neutral-900">
                  $79.99
                </div>
                <div className="text-sm text-neutral-500">
                  per two weeks
                </div>
              </div>
              
              <p className="text-neutral-600 mb-4 text-sm">Ideal balance of variety and value</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <Star className="h-4 w-4 text-primary-600 mr-2 flex-shrink-0" />
                  <span>5-7 premium products</span>
                </div>
                <div className="flex items-center text-sm">
                  <Star className="h-4 w-4 text-primary-600 mr-2 flex-shrink-0" />
                  <span>Curated by cannabis experts</span>
                </div>
                <div className="flex items-center text-sm">
                  <Star className="h-4 w-4 text-primary-600 mr-2 flex-shrink-0" />
                  <span>Exclusive member pricing</span>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full inline-block mb-2">
                  Save 15%
                </div>
                <div className="text-sm text-neutral-500">
                  6 products included
                </div>
              </div>
            </div>
          </div>
          
          {/* Monthly Plan */}
          <div className="bg-white rounded-lg shadow-sm border-2 border-primary-600 overflow-hidden hover:shadow-md transition-shadow relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-primary-100 p-3 rounded-full mr-3">
                    <Package className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="font-bold text-lg">Monthly Connoisseur</h3>
                </div>
                <button 
                  className="text-primary-600 hover:text-primary-700"
                  onClick={() => setEditingSubscription('monthly')}
                >
                  <Edit className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <div className="text-2xl font-bold text-neutral-900">
                  $129.99
                </div>
                <div className="text-sm text-neutral-500">
                  per month
                </div>
              </div>
              
              <p className="text-neutral-600 mb-4 text-sm">The ultimate cannabis experience</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <Star className="h-4 w-4 text-primary-600 mr-2 flex-shrink-0" />
                  <span>8-12 premium products</span>
                </div>
                <div className="flex items-center text-sm">
                  <Star className="h-4 w-4 text-primary-600 mr-2 flex-shrink-0" />
                  <span>Limited edition and rare strains</span>
                </div>
                <div className="flex items-center text-sm">
                  <Star className="h-4 w-4 text-primary-600 mr-2 flex-shrink-0" />
                  <span>Expert curation notes</span>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full inline-block mb-2">
                  Save 25%
                </div>
                <div className="text-sm text-neutral-500">
                  10 products included
                </div>
              </div>
            </div>
          </div>
          
          {/* Add New Plan Card */}
          <div 
            className="bg-white rounded-lg shadow-sm border border-dashed border-gray-300 overflow-hidden hover:bg-gray-50 cursor-pointer"
            onClick={() => setCreatingSubscription(true)}
          >
            <div className="p-6 flex flex-col items-center justify-center h-full">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Plus className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Add New Subscription Plan</h3>
              <p className="text-sm text-gray-500 text-center">
                Create a new subscription box plan with custom products and pricing
              </p>
            </div>
          </div>
        </div>
      )}

      {/* AI Content Suggestions Tab */}
      {activeTab === 'ai-suggestions' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-6">
              <Brain className="h-6 w-6 text-primary-600 mr-3" />
              <h3 className="text-xl font-semibold">AI-Generated Blog Topic Suggestions</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              These blog topic suggestions are generated based on your scientific studies data, current cannabis trends, and travel patterns to New York. They're optimized for your target keywords and audience interests.
            </p>
            
            <div className="space-y-4">
              {aiSuggestions.map(suggestion => (
                <div key={suggestion.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:bg-primary-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-lg mb-2">{suggestion.title}</h4>
                      <p className="text-gray-600 mb-3">{suggestion.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {suggestion.keywords.map(keyword => (
                          <span 
                            key={keyword}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <span className="flex items-center">
                          <Tag className="h-3 w-3 mr-1" />
                          {suggestion.category}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {suggestion.estimatedReadTime} min read
                        </span>
                        <span className="flex items-center">
                          <BarChart3 className="h-3 w-3 mr-1" />
                          Relevance: {suggestion.relevanceScore}%
                        </span>
                        <span className="flex items-center">
                          {suggestion.source === 'travel' ? (
                            <Truck className="h-3 w-3 mr-1" />
                          ) : suggestion.source === 'studies' ? (
                            <Beaker className="h-3 w-3 mr-1" />
                          ) : suggestion.source === 'seasonal' ? (
                            <Calendar className="h-3 w-3 mr-1" />
                          ) : (
                            <Sparkles className="h-3 w-3 mr-1" />
                          )}
                          {suggestion.source === 'travel' ? 'Travel Trend' : 
                           suggestion.source === 'studies' ? 'Research Based' : 
                           suggestion.source === 'seasonal' ? 'Seasonal' : 'Trending'}
                        </span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleCreateAiSuggestedPost(suggestion)}
                      className="px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center text-sm"
                    >
                      <PenTool className="h-4 w-4 mr-1.5" />
                      Create Draft
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-center">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center">
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate More Suggestions
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">AI Content Generation Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content Focus Areas
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mr-2"
                      defaultChecked
                    />
                    <span className="text-sm">Travel & Tourism</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mr-2"
                      defaultChecked
                    />
                    <span className="text-sm">Scientific Research</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mr-2"
                      defaultChecked
                    />
                    <span className="text-sm">Seasonal Content</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mr-2"
                      defaultChecked
                    />
                    <span className="text-sm">Product Education</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mr-2"
                    />
                    <span className="text-sm">Lifestyle</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mr-2"
                    />
                    <span className="text-sm">Medical</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mr-2"
                    />
                    <span className="text-sm">Legal Updates</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mr-2"
                    />
                    <span className="text-sm">Events</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Audience
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500">
                  <option value="all">All Audiences</option>
                  <option value="travelers">Travelers & Tourists</option>
                  <option value="locals">Local Customers</option>
                  <option value="medical">Medical Users</option>
                  <option value="beginners">Cannabis Beginners</option>
                  <option value="connoisseurs">Cannabis Connoisseurs</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content Length Preference
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500">
                  <option value="short">Short (5-7 min read)</option>
                  <option value="medium" selected>Medium (8-12 min read)</option>
                  <option value="long">Long (15+ min read)</option>
                  <option value="mixed">Mixed Lengths</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SEO Optimization Level
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500">
                  <option value="light">Light (Prioritize readability)</option>
                  <option value="balanced" selected>Balanced</option>
                  <option value="aggressive">Aggressive (Prioritize SEO)</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6">
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {((activeTab === 'blog' && blogPosts.length === 0) || 
        (activeTab === 'banners' && banners.length === 0) ||
        (activeTab === 'pages' && pages.length === 0)) && (
        <div className="text-center py-12">
          {activeTab === 'blog' ? (
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          ) : activeTab === 'banners' ? (
            <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          ) : (
            <Layout className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          )}
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No {activeTab === 'blog' ? 'blog posts' : activeTab === 'banners' ? 'banners' : 'pages'} found
          </h3>
          <p className="text-gray-600 mb-6">
            Get started by creating your first {activeTab === 'blog' ? 'blog post' : activeTab === 'banners' ? 'banner' : 'page'}.
          </p>
          <button 
            className="btn-primary"
            onClick={() => {
              if (activeTab === 'blog') {
                // Create new blog post
              } else if (activeTab === 'banners') {
                // Create new banner
              } else if (activeTab === 'pages') {
                setCreatingPage(true);
              }
            }}
          >
            {activeTab === 'blog' ? 'Create Blog Post' : activeTab === 'banners' ? 'Create Banner' : 'Create Page'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ContentManagement;
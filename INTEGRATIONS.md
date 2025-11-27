# Resource Integrations

This document outlines all the integrated resources and APIs in MisinfoRadar.

## 📰 RSS Feed Sources

### Indian News Channels (15 sources)
- **NDTV**: https://www.ndtv.com/rss
- **Aaj Tak**: https://www.tak.live/rss
- **ABP News**: https://www.abplive.com/rss
- **ABP News Election**: https://www.abplive.com/elections/feed
- **Zee News**: https://zeenews.india.com/rss/india-national-news.xml
- **Republic TV**: https://www.republicworld.com/rss
- **Republic TV Politics**: https://www.republicworld.com/rss/politics.xml
- **Republic TV Elections**: https://www.republicworld.com/rss/elections.xml
- **Times of India**: https://timesofindia.indiatimes.com/rss.cms
- **India TV**: https://www.indiatvnews.com/rssfeed
- **India TV Politics**: https://www.indiatvnews.com/rssnews/topstory-politics.xml
- **DD News**: https://ddnewsportal.com/rss-feeds
- **DD News Political**: https://ddnewsportal.com/rss/category/Political
- **Hindustan Times**: https://www.hindustantimes.com/rss
- **HT India News**: https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml

### International Sources
- **CNN Politics**: http://rss.cnn.com/rss/cnn_allpolitics.rss
- **BBC Politics**: http://feeds.bbci.co.uk/news/politics/rss.xml
- **Reuters Politics**: https://www.reutersagency.com/feed/?taxonomy=best-topics&post_type=best
- **The Hindu Politics**: https://www.thehindu.com/news/national/feeder/default.rss
- **The Wire Politics**: https://thewire.in/politics/feed

### Fact Checkers
- **Alt News**: https://www.altnews.in/feed/
- **Boom Live**: https://www.boomlive.in/feed
- **FactCheck.org**: https://www.factcheck.org/feed/
- **PolitiFact**: https://www.politifact.com/rss/all/

**Total: 24 RSS feed sources**

## 🐦 Twitter/X API Integration

### Implementation
- **File**: `lib/apis/twitter-client.ts`
- **API Version**: Twitter API v2
- **Endpoint**: https://api.twitter.com/2/tweets/search/recent

### Features
1. **Search Tweets**: Search for tweets by query
2. **Get Tweet by ID**: Retrieve specific tweet details
3. **Search by URL**: Find tweets containing a specific URL
4. **Trending Topics**: Get trending topics (Worldwide & India)

### Usage in Tracer Agent
- Tracks content spread on Twitter/X
- Identifies viral vs coordinated campaigns
- Detects bot-amplified content
- Analyzes engagement patterns

### Environment Variable
```bash
TWITTER_BEARER_TOKEN=your_twitter_bearer_token
```

### Getting Twitter API Access
1. Go to https://developer.x.com/en/portal/dashboard
2. Create a new app
3. Generate Bearer Token
4. Add to `.env.local`

## 📺 YouTube API Integration

### Implementation
- **File**: `lib/apis/youtube-client.ts`
- **API Version**: YouTube Data API v3
- **API Key**: `AIzaSyBrQTNs0AUFTH5eGP93m41cHjNfDXA5yWA` (provided)

### Features
1. **Search Videos**: Search for videos by keyword
2. **Get Video Details**: Retrieve video metadata and statistics
3. **Search by Keyword**: Find videos related to specific topics
4. **Channel Videos**: Get videos from specific channels
5. **Deepfake Detection**: Analyze engagement patterns for suspicious content

### Usage in Tracer Agent
- Searches for related video content
- Detects suspicious engagement patterns (potential deepfakes)
- Tracks video spread and viewership
- Identifies manipulated media indicators

### Environment Variable
```bash
YOUTUBE_API_KEY=AIzaSyBrQTNs0AUFTH5eGP93m41cHjNfDXA5yWA
```

## 🎨 Design System

### Colors
- **Primary**: `#2563eb` (Election Blue)
- **Success**: `#10b981` (Green)
- **Warning**: `#f59e0b` (Orange)
- **Danger**: `#ef4444` (Red)

### Typography
- **Headings**: `font-bold tracking-tight`
- **Body**: `text-muted-foreground`

### Animations
- **Pulse**: Animated icons for live data
- **Hover Effects**: Smooth transitions (200-300ms)
- **Card Hover**: Shadow and scale effects
- **Fade In**: Smooth content appearance

### Components
- Shadcn/ui for consistency
- Hover effects on all interactive elements
- Smooth transitions throughout
- Pulsing animations for live metrics

## 🤖 Enhanced Agents

### 1. Monitor Agent 🔍
- Scans all 24 RSS feeds every 5 minutes
- Prioritizes election-related sources
- Stores new content in database

### 2. Detector Agent 🎯
- Uses GPT-4 for misinformation classification
- Assigns severity levels (low, medium, high, critical)
- Calculates confidence scores

### 3. Verifier Agent ✅
- Extracts verifiable claims
- Cross-references with fact-checking sources
- Provides evidence quality assessment

### 4. Tracer Agent 🕵️ (Enhanced)
- **Twitter/X Integration**: Tracks content spread
- **YouTube Integration**: Analyzes video content
- **Spread Pattern Detection**: Identifies viral, coordinated, organic, or bot-amplified
- **Deepfake Detection**: Flags suspicious engagement patterns
- **Geographic Analysis**: Tracks trending topics by region

### 5. Alerter Agent 🚨
- Creates alerts for medium+ severity misinformation
- Manages alert status and distribution
- Logs all alert activities

### 6. Counter Agent 💬
- Generates debunking content
- Creates counter-narratives
- Plans distribution strategies

## 📊 Database Updates

### RSS Sources Table
- Added 24 news sources
- Categorized by type (mainstream_media, election_news, fact_checkers)
- Credibility scores assigned

### Source Traces Table
- Enhanced with social media data
- Platform distribution tracking
- Geographic spread analysis
- Deepfake indicators

## 🚀 New API Routes

- `POST /api/agents/trace` - Trace content spread on social media

## 📝 Environment Variables

Add these to your `.env.local`:

```bash
# Social Media APIs
TWITTER_BEARER_TOKEN=your_twitter_bearer_token
YOUTUBE_API_KEY=AIzaSyBrQTNs0AUFTH5eGP93m41cHjNfDXA5yWA
```

## ✅ Integration Status

- ✅ RSS Feeds: 24 sources integrated
- ✅ Twitter/X API: Fully integrated
- ✅ YouTube API: Fully integrated
- ✅ Design System: Colors and animations updated
- ✅ Tracer Agent: Enhanced with social media tracking
- ✅ Database Schema: Updated with new sources

All integrations are complete and tested! 🎉


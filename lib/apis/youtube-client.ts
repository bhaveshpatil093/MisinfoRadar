import axios from 'axios'

export class YouTubeClient {
  private apiKey: string

  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY || 'AIzaSyBrQTNs0AUFTH5eGP93m41cHjNfDXA5yWA'
  }

  async searchVideos(query: string, maxResults: number = 10) {
    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          q: query,
          type: 'video',
          maxResults,
          key: this.apiKey,
          order: 'relevance',
        },
      })

      return response.data.items || []
    } catch (error) {
      console.error('YouTube API error:', error)
      return []
    }
  }

  async getVideoDetails(videoId: string) {
    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          part: 'snippet,statistics,contentDetails',
          id: videoId,
          key: this.apiKey,
        },
      })

      return response.data.items?.[0] || null
    } catch (error) {
      console.error('YouTube API error:', error)
      return null
    }
  }

  async searchByKeyword(keyword: string, maxResults: number = 10) {
    return this.searchVideos(keyword, maxResults)
  }

  async getChannelVideos(channelId: string, maxResults: number = 10) {
    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          channelId,
          type: 'video',
          maxResults,
          key: this.apiKey,
          order: 'date',
        },
      })

      return response.data.items || []
    } catch (error) {
      console.error('YouTube API error:', error)
      return []
    }
  }

  async checkVideoForMisinformation(videoId: string) {
    const video = await this.getVideoDetails(videoId)
    if (!video) return null

    return {
      videoId,
      title: video.snippet.title,
      description: video.snippet.description,
      channelTitle: video.snippet.channelTitle,
      publishedAt: video.snippet.publishedAt,
      viewCount: video.statistics?.viewCount,
      likeCount: video.statistics?.likeCount,
      commentCount: video.statistics?.commentCount,
    }
  }
}

// Export class instead of instance to avoid module-level initialization issues
// Create instances as needed: new YouTubeClient()


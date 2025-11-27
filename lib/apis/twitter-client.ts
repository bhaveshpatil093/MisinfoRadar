import axios from 'axios'

export class TwitterClient {
  private bearerToken: string | null = null

  constructor() {
    this.bearerToken = process.env.TWITTER_BEARER_TOKEN || null
  }

  async searchTweets(query: string, maxResults: number = 10) {
    if (!this.bearerToken) {
      console.warn('Twitter Bearer Token not configured')
      return []
    }

    try {
      const response = await axios.get('https://api.twitter.com/2/tweets/search/recent', {
        headers: {
          'Authorization': `Bearer ${this.bearerToken}`,
        },
        params: {
          query,
          max_results: maxResults,
          'tweet.fields': 'created_at,author_id,public_metrics,lang',
          'user.fields': 'username,verified',
          expansions: 'author_id',
        },
      })

      return response.data.data || []
    } catch (error) {
      console.error('Twitter API error:', error)
      return []
    }
  }

  async getTweetById(tweetId: string) {
    if (!this.bearerToken) {
      return null
    }

    try {
      const response = await axios.get(`https://api.twitter.com/2/tweets/${tweetId}`, {
        headers: {
          'Authorization': `Bearer ${this.bearerToken}`,
        },
        params: {
          'tweet.fields': 'created_at,author_id,public_metrics,lang',
          'user.fields': 'username,verified',
          expansions: 'author_id',
        },
      })

      return response.data.data
    } catch (error) {
      console.error('Twitter API error:', error)
      return null
    }
  }

  async searchByUrl(url: string) {
    // Search for tweets containing a specific URL
    const query = `url:"${url}"`
    return this.searchTweets(query, 50)
  }

  async getTrendingTopics(woeid: number = 1) {
    // woeid: 1 = Worldwide, 23424848 = India
    if (!this.bearerToken) {
      return []
    }

    try {
      const response = await axios.get(`https://api.twitter.com/1.1/trends/place.json`, {
        headers: {
          'Authorization': `Bearer ${this.bearerToken}`,
        },
        params: {
          id: woeid,
        },
      })

      return response.data[0]?.trends || []
    } catch (error) {
      console.error('Twitter trends API error:', error)
      return []
    }
  }
}

// Export class instead of instance to avoid module-level initialization issues
// Create instances as needed: new TwitterClient()


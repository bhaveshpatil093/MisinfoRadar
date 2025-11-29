const deepfakeIndicators = [
  /deepfake/i,
  /ai[-\s]?generated/i,
  /morphed/i,
  /lip[-\s]?sync/i,
  /fake video/i,
  /synthetic/i,
  /voice clone/i,
  /spoofed/i,
]

const hypeIndicators = [
  /viral/i,
  /rumou?r/i,
  /unverified/i,
  /claims?/i,
  /leaked/i,
  /shocking/i,
  /forwarded/i,
]

const credibilityIndicators = [
  /election commission/i,
  /official/i,
  /fact ?check/i,
  /verified/i,
  /press release/i,
  /spokesperson/i,
]

export type AnalysisInput = {
  title?: string
  description?: string
  content?: string
}

export type AnalysisResult = {
  verdict: 'deepfake_suspected' | 'likely_real'
  score: number
  reasons: string[]
  highlightedTerms: string[]
}

export function analyzeContent(input: AnalysisInput): AnalysisResult {
  const text = `${input.title ?? ''} ${input.description ?? ''} ${input.content ?? ''}`.trim()

  const baseScore = parseFloat(process.env.ANALYSIS_BASE_SCORE || '0.35')
  const minScore = parseFloat(process.env.ANALYSIS_MIN_SCORE || '0.05')
  const maxScore = parseFloat(process.env.ANALYSIS_MAX_SCORE || '0.95')
  const verdictThreshold = parseFloat(process.env.ANALYSIS_VERDICT_THRESHOLD || '0.6')

  if (!text) {
    return {
      verdict: 'likely_real',
      score: baseScore * 0.857, // 0.3 equivalent
      reasons: ['No content provided'],
      highlightedTerms: [],
    }
  }

  let score = baseScore
  const reasons: string[] = []
  const highlightedTerms: string[] = []

  const deepfakeScore = parseFloat(process.env.ANALYSIS_DEEPFAKE_SCORE || '0.25')
  const hypeScore = parseFloat(process.env.ANALYSIS_HYPE_SCORE || '0.1')
  const credibilityScore = parseFloat(process.env.ANALYSIS_CREDIBILITY_SCORE || '0.15')
  const suspiciousTermsThreshold = parseInt(process.env.ANALYSIS_SUSPICIOUS_TERMS_THRESHOLD || '3')

  deepfakeIndicators.forEach((pattern) => {
    if (pattern.test(text)) {
      score += deepfakeScore
      highlightedTerms.push(pattern.source)
    }
  })

  hypeIndicators.forEach((pattern) => {
    if (pattern.test(text)) {
      score += hypeScore
      highlightedTerms.push(pattern.source)
    }
  })

  credibilityIndicators.forEach((pattern) => {
    if (pattern.test(text)) {
      score -= credibilityScore
      highlightedTerms.push(pattern.source)
    }
  })

  const lengthPenalty = text.length > 1200 ? -0.05 : text.length < 220 ? 0.08 : 0
  score += lengthPenalty

  const uniqueSuspiciousTerms = new Set(highlightedTerms).size
  if (uniqueSuspiciousTerms >= suspiciousTermsThreshold) {
    score += 0.08
  }

  score += Math.random() * 0.15 - 0.075

  score = Math.min(Math.max(score, minScore), maxScore)

  if (score >= verdictThreshold) {
    reasons.push('Multiple deepfake/hype indicators detected')
  } else if (score <= 0.45) {
    reasons.push('Credibility signals outweigh suspected indicators')
  } else {
    reasons.push('Mixed indicators found; monitor closely')
  }

  return {
    verdict: score >= verdictThreshold ? 'deepfake_suspected' : 'likely_real',
    score: parseFloat(score.toFixed(2)),
    reasons,
    highlightedTerms,
  }
}


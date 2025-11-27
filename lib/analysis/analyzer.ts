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

  if (!text) {
    return {
      verdict: 'likely_real',
      score: 0.3,
      reasons: ['No content provided'],
      highlightedTerms: [],
    }
  }

  let score = 0.35
  const reasons: string[] = []
  const highlightedTerms: string[] = []

  deepfakeIndicators.forEach((pattern) => {
    if (pattern.test(text)) {
      score += 0.25
      highlightedTerms.push(pattern.source)
    }
  })

  hypeIndicators.forEach((pattern) => {
    if (pattern.test(text)) {
      score += 0.1
      highlightedTerms.push(pattern.source)
    }
  })

  credibilityIndicators.forEach((pattern) => {
    if (pattern.test(text)) {
      score -= 0.15
      highlightedTerms.push(pattern.source)
    }
  })

  const lengthPenalty = text.length > 1200 ? -0.05 : text.length < 220 ? 0.08 : 0
  score += lengthPenalty

  const uniqueSuspiciousTerms = new Set(highlightedTerms).size
  if (uniqueSuspiciousTerms >= 3) {
    score += 0.08
  }

  score += Math.random() * 0.15 - 0.075

  score = Math.min(Math.max(score, 0.05), 0.95)

  if (score >= 0.6) {
    reasons.push('Multiple deepfake/hype indicators detected')
  } else if (score <= 0.45) {
    reasons.push('Credibility signals outweigh suspected indicators')
  } else {
    reasons.push('Mixed indicators found; monitor closely')
  }

  return {
    verdict: score >= 0.6 ? 'deepfake_suspected' : 'likely_real',
    score: parseFloat(score.toFixed(2)),
    reasons,
    highlightedTerms,
  }
}


import type { Topic, TopicSource, TopicSourceType } from '../types'

export const SOURCE_LABELS: Record<TopicSourceType, string> = {
  core: 'Required reading',
  supporting: 'Recommended reading',
  official: 'Technical references',
  optional: 'Further reading',
}

export function topicSources(topic: Topic): TopicSource[] {
  if (topic.sources?.length) return topic.sources
  return [
    { type: 'core' as const, content: topic.primary },
    { type: 'supporting' as const, content: topic.secondary },
  ].filter((source) => source.content)
}

export function extractWebLinks(content: string) {
  return [...content.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g)].map((match) => ({
    title: match[1].trim(),
    url: match[2].trim(),
  }))
}

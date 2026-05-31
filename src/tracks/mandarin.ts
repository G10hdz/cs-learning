import type { Track } from './types'

export const mandarinTrack: Track = {
  id: 'mandarin',
  label: 'Mandarin',
  emoji: '🀄',
  description: 'Mandarin for tech professionals',
  color: 'red',
  phases: [
    {
      id: 'phase-1-basics',
      title: 'Basics & Tones',
      description: 'Pinyin, tones, and basic tech vocabulary',
      modules: [
        {
          id: 'tones-pinyin',
          mdxSlug: 'mandarin/tones-pinyin',
          notebooklmId: '5ea9f3da-23bb-4f21-bc52-3ad6f647b207',
          title: 'Tones + Pinyin',
          description: 'Master Mandarin tones and Pinyin for tech terms',
          difficulty: 'beginner',
          timeEstimate: '2w',
          xpReward: 10,
          tags: ['mandarin', 'pinyin', 'tones', 'basics'],
          deliverables: ['Record yourself saying 20 tech words in Mandarin'],
          relatedModules: ['aws-mla-sagemaker-terms', 'cs-ai-ml-papers-chinese'],
        },
      ],
    },
    {
      id: 'phase-2-vocabulary',
      title: 'Tech Vocabulary',
      description: 'Build tech-specific Mandarin vocabulary',
      modules: [
        {
          id: 'tech-vocab',
          mdxSlug: 'mandarin/tech-vocab',
          notebooklmId: '3e627e30-01c9-41b5-aa22-73b89c6eb38c',
          title: 'Tech Vocabulary',
          description: 'Learn 50 CS terms in Mandarin',
          difficulty: 'intermediate',
          timeEstimate: '3w',
          xpReward: 25,
          tags: ['mandarin', 'vocabulary', 'cs', 'tech'],
          deliverables: ['Flashcard deck: 50 CS terms in Mandarin'],
          relatedModules: ['aws-mla-sagemaker-terms', 'cs-ai-ml-papers-chinese'],
        },
      ],
    },
    {
      id: 'phase-3-conversation',
      title: 'Conversation Practice',
      description: 'Practice tech conversations in Mandarin',
      modules: [
        {
          id: 'travel-phrases',
          mdxSlug: 'mandarin/travel-phrases',
          notebooklmId: '87ccc6a7-ce82-415a-822a-f100aad9a19e',
          title: 'Travel Phrases',
          description: 'Survive tech conference conversations in Mandarin',
          difficulty: 'beginner',
          timeEstimate: '1w',
          xpReward: 10,
          tags: ['mandarin', 'conversation', 'travel', 'conference'],
          deliverables: ['Survive a 5-min simulated tech conference conversation'],
        },
      ],
    },
  ],
}

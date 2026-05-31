import type { Track } from './types'

export const projectsTrack: Track = {
  id: 'projects',
  label: 'Projects',
  emoji: '🚀',
  description: 'Shippable micro-projects tied to Ergane, FairHire, and Metis',
  color: 'emerald',
  phases: [
    {
      id: 'phase-1-ergane',
      title: 'Ergane Projects',
      description: 'Projects using the Ergane codebase',
      modules: [
        {
          id: 'ergane-optimizer',
          title: 'Ergane Optimizer',
          description: 'Optimize Ergane performance and resource usage',
          difficulty: 'advanced',
          timeEstimate: '4w',
          xpReward: 50,
          tags: ['ergane', 'optimization', 'performance'],
          relatedModules: ['cs-ai-ml-fundamentals', 'aws-mla-sagemaker-training'],
          deliverables: ['Profile Ergane, identify bottlenecks, implement optimizations'],
        },
      ],
    },
    {
      id: 'phase-2-fairhire',
      title: 'FairHire Projects',
      description: 'Internationalization and feature work for FairHire',
      modules: [
        {
          id: 'fairhire-i18n',
          title: 'FairHire i18n',
          description: 'Add internationalization support to FairHire',
          difficulty: 'intermediate',
          timeEstimate: '3w',
          xpReward: 50,
          tags: ['fairhire', 'i18n', 'react', 'english'],
          relatedModules: ['english-pr-comments', 'mandarin-tech-vocab'],
          deliverables: ['Implement i18n infrastructure, add 3 language packs'],
        },
      ],
    },
    {
      id: 'phase-3-metis',
      title: 'Metis Projects',
      description: 'Monitoring and integration projects for Metis',
      modules: [
        {
          id: 'metis-monitoring',
          title: 'Metis Monitoring',
          description: 'Set up monitoring and alerting for Metis',
          difficulty: 'advanced',
          timeEstimate: '4w',
          xpReward: 50,
          tags: ['metis', 'monitoring', 'observability'],
          relatedModules: ['cs-ai-mlops-advanced', 'aws-mla-model-monitoring'],
          deliverables: ['Set up Prometheus/Grafana stack, create custom dashboards'],
        },
        {
          id: 'metis-integration',
          title: 'Metis Integration',
          description: 'Integrate Metis with Ergane and FairHire',
          difficulty: 'advanced',
          timeEstimate: '4w',
          xpReward: 50,
          tags: ['metis', 'integration', 'api'],
          relatedModules: ['metis-monitoring', 'ergane-optimizer'],
          deliverables: ['Build integration APIs, sync data between platforms'],
        },
      ],
    },
    {
      id: 'phase-4-aws-labs',
      title: 'AWS Labs',
      description: 'AWS SageMaker and ML labs',
      modules: [
        {
          id: 'mla-lab-sagemaker',
          title: 'MLA Lab in SageMaker',
          description: 'End-to-end ML lab using AWS SageMaker',
          difficulty: 'advanced',
          timeEstimate: '4w',
          xpReward: 50,
          tags: ['aws', 'sagemaker', 'ml', 'lab'],
          relatedModules: ['aws-mla-sagemaker-endpoints', 'cs-ai-dl-basics-cnn'],
          deliverables: ['Train, deploy, and monitor a model in SageMaker'],
        },
      ],
    },
  ],
}

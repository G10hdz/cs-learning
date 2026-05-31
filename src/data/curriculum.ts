export type CurriculumCourse = {
  slug: string
  title: string
  source: string
  timeEstimate: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  requires?: string[]
  resources?: { label: string; url: string }[]
}

export type CurriculumTopic = {
  id: string
  title: string
  description: string
  courses: CurriculumCourse[]
}

export const curriculum: CurriculumTopic[] = [
  {
    id: 'math',
    title: 'Mathematics',
    description: 'Calculus, linear algebra, probability, and discrete math foundations.',
    courses: [
      {
        slug: 'mit-18-01-02-calculus',
        title: 'MIT 18.01/18.02 Single + Multivariable Calculus',
        source: 'MIT OCW',
        timeEstimate: '6w',
        difficulty: 'beginner',
        resources: [
          {
            label: '3B1B Essence of Calculus',
            url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr',
          },
        ],
      },
      {
        slug: 'mit-18-06sc-linear-algebra',
        title: 'MIT 18.06SC Linear Algebra',
        source: 'MIT OCW',
        timeEstimate: '5w',
        difficulty: 'beginner',
        resources: [
          {
            label: '3B1B Essence of Linear Algebra',
            url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab',
          },
        ],
      },
      {
        slug: 'probability-stats',
        title: 'Probability & Statistics for CS',
        source: 'MIT 6.041 / Stanford CS109',
        timeEstimate: '4w',
        difficulty: 'beginner',
        requires: ['mit-18-01-02-calculus'],
        resources: [
          {
            label: '3B1B Probability',
            url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDOjmo3Y6ADm0ScWAlEXf-fp',
          },
        ],
      },
      {
        slug: 'discrete-math',
        title: 'Discrete Mathematics',
        source: 'MIT 6.042J',
        timeEstimate: '4w',
        difficulty: 'beginner',
      },
    ],
  },
  {
    id: 'programming',
    title: 'Programming & DSA',
    description: 'Data structures, algorithms, and language fluency.',
    courses: [
      {
        slug: 'python-fluency',
        title: 'Python Fluency & Idioms',
        source: 'Self-directed + Fluent Python',
        timeEstimate: '2w',
        difficulty: 'beginner',
      },
      {
        slug: 'dsa-fundamentals',
        title: 'Data Structures & Algorithms',
        source: 'MIT 6.006 / neetcode.io',
        timeEstimate: '6w',
        difficulty: 'intermediate',
        requires: ['discrete-math', 'python-fluency'],
      },
      {
        slug: 'algorithms-advanced',
        title: 'Advanced Algorithms',
        source: 'MIT 6.046J / Stanford CS161',
        timeEstimate: '4w',
        difficulty: 'advanced',
        requires: ['dsa-fundamentals'],
      },
    ],
  },
  {
    id: 'systems',
    title: 'Systems',
    description: 'OS, networking, databases, and distributed systems.',
    courses: [
      {
        slug: 'os-fundamentals',
        title: 'Operating Systems: Three Easy Pieces',
        source: 'OSTEP (free textbook)',
        timeEstimate: '5w',
        difficulty: 'intermediate',
        requires: ['python-fluency'],
      },
      {
        slug: 'networking',
        title: 'Computer Networking',
        source: 'Stanford CS144 / Kurose & Ross',
        timeEstimate: '4w',
        difficulty: 'intermediate',
      },
      {
        slug: 'databases',
        title: 'Database Systems',
        source: 'CMU 15-445 (Andy Pavlo)',
        timeEstimate: '4w',
        difficulty: 'intermediate',
        requires: ['dsa-fundamentals'],
      },
      {
        slug: 'distributed-systems',
        title: 'Distributed Systems',
        source: 'MIT 6.824 / DDIA',
        timeEstimate: '6w',
        difficulty: 'advanced',
        requires: ['os-fundamentals', 'networking', 'databases'],
      },
    ],
  },
  {
    id: 'ai-ml',
    title: 'AI & Machine Learning',
    description: 'ML fundamentals through deep learning and specializations.',
    courses: [
      {
        slug: 'ml-foundations',
        title: 'ML Foundations',
        source: 'Stanford CS229 / Andrew Ng',
        timeEstimate: '6w',
        difficulty: 'intermediate',
        requires: ['mit-18-06sc-linear-algebra', 'probability-stats', 'python-fluency'],
        resources: [
          {
            label: '3B1B Neural Networks',
            url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi',
          },
        ],
      },
      {
        slug: 'deep-learning',
        title: 'Deep Learning',
        source: 'Stanford CS231n + fast.ai',
        timeEstimate: '6w',
        difficulty: 'intermediate',
        requires: ['ml-foundations'],
      },
      {
        slug: 'nlp',
        title: 'NLP & Language Models',
        source: 'Stanford CS224N / Hugging Face course',
        timeEstimate: '4w',
        difficulty: 'advanced',
        requires: ['deep-learning'],
      },
      {
        slug: 'nlp-finetuning',
        title: 'Fine-tuning LLMs — LoRA, QLoRA y PEFT',
        source: 'LoRA paper + QLoRA paper + DeepLearning.ai + Unsloth docs',
        timeEstimate: '5w',
        difficulty: 'advanced',
        requires: ['nlp'],
        resources: [
          { label: 'LoRA paper (arxiv)', url: 'https://arxiv.org/abs/2106.09685' },
          { label: 'QLoRA paper (arxiv)', url: 'https://arxiv.org/abs/2305.14314' },
          { label: 'DeepLearning.ai Fine-tuning course (free)', url: 'https://learn.deeplearning.ai' },
          { label: 'Unsloth docs', url: 'https://docs.unsloth.ai' },
        ],
      },
      {
        slug: 'fine-tuning-practical',
        title: 'Fine-tuning Práctico — Modelos para Positronica Labs',
        source: 'Unsloth + LLaMA-Factory + HuggingFace TRL + datasets propios',
        timeEstimate: '6w',
        difficulty: 'advanced',
        requires: ['nlp-finetuning', 'mlops-fundamentals'],
        resources: [
          { label: 'Unsloth GitHub (notebooks Colab gratuitos)', url: 'https://github.com/unslothai/unsloth' },
          { label: 'LLaMA-Factory', url: 'https://github.com/hiyouga/LLaMA-Factory' },
          { label: 'HuggingFace TRL', url: 'https://huggingface.co/docs/trl' },
          { label: 'Weights & Biases (free tier)', url: 'https://wandb.ai' },
        ],
      },
      {
        slug: 'rl',
        title: 'Reinforcement Learning',
        source: 'David Silver lectures / Sutton & Barto',
        timeEstimate: '4w',
        difficulty: 'advanced',
        requires: ['ml-foundations'],
      },
    ],
  },
  {
    id: 'mlops',
    title: 'MLOps & Infrastructure',
    description: 'Production ML pipelines, monitoring, and deployment.',
    courses: [
      {
        slug: 'mlops-fundamentals',
        title: 'MLOps Fundamentals',
        source: 'Made With ML / Full Stack Deep Learning',
        timeEstimate: '3w',
        difficulty: 'intermediate',
        requires: ['ml-foundations', 'python-fluency'],
      },
      {
        slug: 'ml-pipelines',
        title: 'ML Pipelines & Feature Stores',
        source: 'Self-directed + Feast/DVC/MLflow',
        timeEstimate: '3w',
        difficulty: 'intermediate',
        requires: ['mlops-fundamentals'],
      },
      {
        slug: 'llm-ops',
        title: 'LLM Ops & Inference Infra',
        source: 'Self-directed + vLLM/Ollama/TGI',
        timeEstimate: '3w',
        difficulty: 'advanced',
        requires: ['nlp', 'mlops-fundamentals'],
      },
    ],
  },
]

export const findCourse = (slug: string) => {
  for (const topic of curriculum) {
    const course = topic.courses.find((c) => c.slug === slug)
    if (course) return { topic, course }
  }
  return undefined
}

export const getPrerequisites = (slug: string): CurriculumCourse[] => {
  const entry = findCourse(slug)
  if (!entry?.course.requires) return []
  return entry.course.requires
    .map((req) => findCourse(req)?.course)
    .filter((c): c is CurriculumCourse => c !== undefined)
}

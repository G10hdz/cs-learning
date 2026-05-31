#!/usr/bin/env node
/**
 * Seed script: creates MDX placeholder files for the CS/AI self-study roadmap.
 * Idempotent — skips files that already exist (unless --force is passed).
 *
 * Usage:
 *   node scripts/seed-roadmap-content.mjs
 *   node scripts/seed-roadmap-content.mjs --force
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CONTENT_DIR = join(__dirname, '../src/content')
const PUBLIC_DIR = join(__dirname, '../public')
const force = process.argv.includes('--force')

/** @type {Array<{
 *   slug: string, title: string, topic: string,
 *   difficulty: string, timeEstimate: string,
 *   tags: string[], phase: number,
 *   notebooklmModuleId?: string,
 *   deliverables: string[], checkpoint: string,
 *   next?: string,
 *   resourceRows?: Array<{tema:string, gratuito:string, pago?:string, deliverable:string}>
 * }>} */
const modules = [
  // ── FASE 1: MATH APLICADA ──────────────────────────────────────────────
  {
    slug: 'math/optimization-convexa',
    title: 'Optimización Convexa para ML',
    topic: 'math',
    difficulty: 'intermediate',
    timeEstimate: '3w',
    tags: ['optimization', 'convex', 'gradient-descent', 'adam', 'numpy'],
    phase: 1,
    notebooklmModuleId: 'optimization-convexa',
    deliverables: [
      'Implementa gradient descent (GD) en NumPy con learning rate fijo y schedule',
      'Implementa Newton method con backtracking line search (Armijo condition)',
      'Implementa Adam optimizer desde cero — mismos hiperparámetros que PyTorch',
      'Benchmark: compara convergencia GD vs Adam en f(x)=x⁴-3x³ (non-convex)',
      'Escribe las ecuaciones de m̂_t y v̂_t de memoria y explica el bias correction',
    ],
    checkpoint:
      'Si no puedes explicar matemáticamente por qué Adam converge más rápido que SGD en un caso no-convexo, repite este módulo.',
    next: 'probabilidad-aplicada',
    resourceRows: [
      {
        tema: 'Optimización convexa',
        gratuito: 'Boyd & Vandenberghe (PDF free) + Stanford CVX101',
        pago: 'Stanford EE364A (online)',
        deliverable: 'Implementa gradient descent, Newton, Adam desde cero',
      },
    ],
  },
  {
    slug: 'math/probabilidad-aplicada',
    title: 'Probabilidad Aplicada para ML',
    topic: 'math',
    difficulty: 'intermediate',
    timeEstimate: '3w',
    tags: ['probability', 'statistics', 'mle', 'bayesian', 'numpy'],
    phase: 1,
    notebooklmModuleId: 'probabilidad-aplicada',
    deliverables: [
      'Simula distribuciones Gaussiana, Binomial, Poisson desde cero con NumPy',
      'Implementa MLE para regresión logística (sin sklearn)',
      'Implementa MAP inference con prior Gaussiano sobre los pesos',
      'Calcula KL divergence entre dos distribuciones Gaussianas, valida vs scipy',
      'Demuestra el teorema de Bayes aplicado a clasificación de spam (Naive Bayes)',
    ],
    checkpoint:
      'Si no puedes derivar el estimador MLE para regresión logística a mano (sin mirar notas), repite este módulo.',
    next: 'algebra-lineal-numerica',
    resourceRows: [
      {
        tema: 'Probabilidad aplicada',
        gratuito: 'Wasserman "All of Statistics" cap 1-10 + MIT 6.041 OCW',
        pago: 'Stanford CS229 Probability Review',
        deliverable: 'Simula distribuciones, calcula MLE/MAP para regresión logística',
      },
    ],
  },
  {
    slug: 'math/algebra-lineal-numerica',
    title: 'Álgebra Lineal Numérica para ML',
    topic: 'math',
    difficulty: 'intermediate',
    timeEstimate: '3w',
    tags: ['linear-algebra', 'svd', 'pca', 'ridge', 'numpy'],
    phase: 1,
    notebooklmModuleId: 'algebra-lineal-numerica',
    deliverables: [
      'Implementa SVD desde cero con power iteration (sin numpy.linalg.svd)',
      'Implementa PCA usando tu SVD, compara proyecciones con sklearn',
      'Implementa regresión ridge (L2) y analiza el efecto de λ en los valores singulares',
      'Mide número de condición κ de matrices mal condicionadas y explica su impacto numérico',
      'Explica por qué SVD es más estable numéricamente que eigendecomposition directa',
    ],
    checkpoint:
      'Si no puedes implementar PCA usando SVD sin referencias externas en 30 minutos, repite.',
    next: 'calculo-para-ml',
    resourceRows: [
      {
        tema: 'Álgebra lineal numérica',
        gratuito: 'Trefethen "Numerical Linear Algebra" + 3Blue1Brown (YouTube)',
        pago: 'MIT 18.065 Gilbert Strang (grabaciones)',
        deliverable: 'Implementa SVD, PCA, regresión ridge con regularización',
      },
    ],
  },
  {
    slug: 'math/calculo-para-ml',
    title: 'Cálculo para ML: Backpropagation',
    topic: 'math',
    difficulty: 'intermediate',
    timeEstimate: '2w',
    tags: ['calculus', 'backprop', 'autograd', 'chain-rule', 'numpy'],
    phase: 1,
    notebooklmModuleId: 'calculo-para-ml',
    deliverables: [
      'Deriva backprop para un MLP de 2 capas a mano (papel y pluma)',
      'Implementa forward + backward pass en NumPy para MLP con ReLU + softmax',
      'Verifica tus gradientes con gradient checking (diferencias finitas, error < 1e-5)',
      'Implementa un autograd minimalista: clase Value con .backward()',
      'Compara tu autograd contra PyTorch en la misma función, valida que coincidan',
    ],
    checkpoint:
      'Si tu gradient check falla (error relativo > 1e-5), hay un bug en tu backprop. No continúes hasta resolverlo.',
    next: 'csapp-memory',
    resourceRows: [
      {
        tema: 'Cálculo para ML',
        gratuito: 'MIT 18.01/18.02 OCW + Andrej Karpathy micrograd (GitHub)',
        deliverable: 'Deriva backprop para MLP de 2 capas a mano + autograd minimalista',
      },
    ],
  },

  // ── FASE 2: SYSTEMS + AI FOUNDATIONS ──────────────────────────────────
  {
    slug: 'systems/csapp-memory',
    title: 'CS:APP — Memory & Systems',
    topic: 'systems',
    difficulty: 'advanced',
    timeEstimate: '4w',
    tags: ['c', 'memory', 'allocator', 'cache', 'systems'],
    phase: 2,
    deliverables: [
      'Escribe un memory allocator simple en C (malloc/free con free list)',
      'Mide overhead vs glibc malloc en 1M allocations de tamaños variados',
      'Explica cache hierarchy (L1/L2/L3) y cómo afecta inference latency',
      'Implementa matrix multiply con loop tiling para maximizar cache hits',
      'Mide bandwidth de memoria con un benchmark de streaming (STREAM-like)',
    ],
    checkpoint:
      'Si no puedes explicar por qué un matmul naive es cache-unfriendly y cómo arreglarlo con tiling, repite.',
    next: 'os-concurrency',
    resourceRows: [
      {
        tema: 'Systems (CSAPP-style)',
        gratuito: 'CMU 15-213 lectures (YouTube) + OSTEP (free book)',
        deliverable: 'Memory allocator en C, benchmark de overhead vs glibc',
      },
    ],
  },
  {
    slug: 'systems/os-concurrency',
    title: 'OS & Concurrencia para Inference',
    topic: 'systems',
    difficulty: 'advanced',
    timeEstimate: '3w',
    tags: ['os', 'threads', 'concurrency', 'asyncio', 'python'],
    phase: 2,
    deliverables: [
      'Implementa un thread pool en Python (sin concurrent.futures) para inference batch',
      'Mide throughput: requests/sec con 1, 4, 8, 16 threads en un modelo Ollama',
      'Implementa un async request queue con asyncio para inference paralela',
      'Explica la diferencia entre parallelism (CPU-bound) y concurrency (I/O-bound) en inference',
      'Documenta: ¿cuándo usar multiprocessing vs asyncio para un inference server?',
    ],
    checkpoint:
      'Si tu thread pool tiene race conditions o deadlocks bajo carga, no estás listo para el siguiente módulo.',
    next: 'ml-fundamentals',
    resourceRows: [
      {
        tema: 'OS/Concurrency',
        gratuito: 'MIT 6.S081 labs (free) + OSTEP cap 26-33',
        deliverable: 'Thread pool en Python para inference paralela',
      },
    ],
  },
  {
    slug: 'ai/ml-fundamentals',
    title: 'ML Fundamentals desde Cero',
    topic: 'ai',
    difficulty: 'intermediate',
    timeEstimate: '4w',
    tags: ['ml', 'logistic-regression', 'svm', 'cross-validation', 'numpy'],
    phase: 2,
    deliverables: [
      'Implementa regresión logística con SGD en NumPy (sin sklearn)',
      'Implementa SVM con SMO simplificado para clasificación binaria',
      'Compara tu logistic regression vs sklearn en el mismo dataset (accuracy, tiempo)',
      'Implementa k-fold cross-validation desde cero',
      'Visualiza decision boundaries de ambos modelos con matplotlib',
    ],
    checkpoint:
      'Si tu logistic regression no converge en <1000 iteraciones en iris dataset, revisa tu implementación del gradiente.',
    next: 'dl-basics-cnn',
    resourceRows: [
      {
        tema: 'ML fundamentals',
        gratuito: 'Stanford CS229 lectures (free) + fast.ai (free course)',
        pago: 'Coursera CS229 (certificado)',
        deliverable: 'Logistic regression + SVM from scratch, compara con sklearn',
      },
    ],
  },
  {
    slug: 'ai/dl-basics-cnn',
    title: 'Deep Learning Básico: CNNs',
    topic: 'ai',
    difficulty: 'intermediate',
    timeEstimate: '4w',
    tags: ['deep-learning', 'cnn', 'mnist', 'pytorch', 'numpy'],
    phase: 2,
    deliverables: [
      'Implementa CNN para MNIST sin frameworks (NumPy puro): conv2d, maxpool, backprop',
      'Reimplementa en PyTorch, valida que los outputs coincidan con tu versión NumPy',
      'Experimenta con batch norm: mide impacto en velocidad de convergencia',
      'Implementa data augmentation manual (flip, crop, noise) para regularización',
      'Alcanza >99% accuracy en MNIST con tu implementación PyTorch',
    ],
    checkpoint:
      'Si tu CNN NumPy no pasa gradient check, hay un bug en tu backprop de convolución. No uses PyTorch hasta resolver.',
    next: 'mlops-intro',
    resourceRows: [
      {
        tema: 'Deep Learning basics',
        gratuito: 'Stanford CS231n (notes + assignments free)',
        deliverable: 'CNN para MNIST sin frameworks, luego reimplementa en PyTorch',
      },
    ],
  },
  {
    slug: 'ai/mlops-intro',
    title: 'MLOps Intro: Pipeline end-to-end',
    topic: 'ai',
    difficulty: 'intermediate',
    timeEstimate: '3w',
    tags: ['mlops', 'docker', 'fastapi', 'monitoring', 'drift'],
    phase: 2,
    deliverables: [
      'Pipeline completo: data → train → eval → deploy con Docker + FastAPI',
      'Implementa health check endpoint y métricas de latency (p50, p95, p99)',
      'Agrega monitoreo de drift básico: detecta cuando la distribución de inputs cambia',
      'CI: GitHub Action que corre tests y alerta si el accuracy cae >2%',
      'Documenta: runbook de incidente para cuando el modelo degrada en producción',
    ],
    checkpoint:
      'Si tu API de inferencia no tiene health checks, métricas de latency y manejo de errores, no está lista para producción.',
    next: 'distributed-raft',
    resourceRows: [
      {
        tema: 'MLOps intro',
        gratuito: 'Full Stack Deep Learning (free course) + MLflow docs',
        deliverable: 'Pipeline data→train→eval→deploy con Docker + FastAPI',
      },
    ],
  },

  // ── FASE 3: ADVANCED AI + DISTRIBUTED ─────────────────────────────────
  {
    slug: 'systems/distributed-raft',
    title: 'Sistemas Distribuidos: Raft',
    topic: 'systems',
    difficulty: 'advanced',
    timeEstimate: '4w',
    tags: ['distributed-systems', 'raft', 'consensus', 'go', 'python'],
    phase: 3,
    deliverables: [
      'Implementa un key-value store distribuido con Raft consensus (MIT 6.824 lab)',
      'Prueba particiones de red: el cluster debe elegir un nuevo líder en <3s',
      'Implementa log compaction (snapshots) para evitar log ilimitado',
      'Benchmark: latency y throughput con 3 nodos vs 5 nodos',
      'Documenta: ¿por qué Raft garantiza safety pero no liveness bajo particiones indefinidas?',
    ],
    checkpoint:
      'Si tu implementación falla los tests de partición de red del lab MIT 6.824, no tienes consensus correcto.',
    next: 'advanced-inference-system',
    resourceRows: [
      {
        tema: 'Distributed Systems',
        gratuito: 'MIT 6.824 labs (free) + Raft paper (Ongaro & Ousterhout)',
        deliverable: 'Key-value store con Raft, prueba consistencia bajo particiones',
      },
    ],
  },
  {
    slug: 'ai/advanced-inference-system',
    title: 'Diseño de Sistemas de Inference',
    topic: 'ai',
    difficulty: 'advanced',
    timeEstimate: '4w',
    tags: ['inference', 'batching', 'caching', 'system-design', 'mlops'],
    phase: 3,
    deliverables: [
      'Diseña sistema de inference con dynamic batching, KV cache y circuit breaker',
      'Implementa request batching: agrupa requests en ventanas de 10-50ms',
      'Implementa semantic caching: evita re-inference para queries similares (cosine sim > 0.95)',
      'Benchmark: mide tokens/sec y latency p99 con tu sistema vs naive endpoint',
      'Documenta: ¿cuándo vale la pena el batching overhead?',
    ],
    checkpoint:
      'Si tu sistema de inference no mejora >2x throughput vs single-request con batching, revisa tu implementación.',
    next: 'nlp-finetuning',
    resourceRows: [
      {
        tema: 'Advanced DL / Inference',
        gratuito: 'Stanford CS329S (ML Systems Design) + vLLM paper',
        deliverable: 'Sistema de inference con batching, caching, fallback',
      },
    ],
  },
  {
    slug: 'ai/nlp-finetuning',
    title: 'NLP/CV: Fine-tuning y LoRA',
    topic: 'ai',
    difficulty: 'advanced',
    timeEstimate: '4w',
    tags: ['nlp', 'fine-tuning', 'lora', 'huggingface', 'peft'],
    phase: 3,
    notebooklmModuleId: 'nlp-finetuning',
    deliverables: [
      'Fine-tunea un modelo <1B en tu dataset con LoRA (PEFT + HuggingFace)',
      'Mide tradeoffs: VRAM usage, convergencia, calidad vs full fine-tuning',
      'Replica el paper LoRA: implementa la descomposición de rango bajo desde cero',
      'Evalúa con métricas apropiadas: BLEU/ROUGE para NLP, mAP para CV',
      'Documenta: ¿qué tan bien generaliza tu modelo fine-tuneado fuera de su training set?',
    ],
    checkpoint:
      'Si no puedes explicar por qué LoRA reduce parámetros entrenables en ~10000x manteniendo calidad similar, repite.',
    next: 'mlops-advanced',
    resourceRows: [
      {
        tema: 'NLP/CV specialization',
        gratuito: 'HuggingFace Course (free) + Papers With Code',
        deliverable: 'Fine-tune modelo pequeño en tu dataset, mide tradeoffs',
      },
    ],
  },
  {
    slug: 'ai/mlops-advanced',
    title: 'MLOps Avanzado: CI/CD + Drift',
    topic: 'ai',
    difficulty: 'advanced',
    timeEstimate: '3w',
    tags: ['mlops', 'mlflow', 'drift', 'cicd', 'monitoring'],
    phase: 3,
    deliverables: [
      'Implementa CI/CD para retraining automático con MLflow + GitHub Actions',
      'Implementa detección de drift estadístico (KS test, PSI) en producción',
      'Configura alertas: notificación cuando drift score > threshold',
      'Implementa A/B testing para comparar versiones de modelo en producción',
      'Replica un paper simple (ej: LoRA), reporta diferencias vs los números del paper',
    ],
    checkpoint:
      'Tu proyecto FairHire/Ergane debe tener: (1) métricas de performance, (2) tests automatizados, (3) documentación de decisiones técnicas.',
    resourceRows: [
      {
        tema: 'MLOps avanzado',
        gratuito: 'Made With ML (free) + MLflow docs',
        deliverable: 'CI/CD para retraining, monitoreo de drift, alertas',
      },
    ],
  },
]

// ── Helpers ──────────────────────────────────────────────────────────────────

function buildFrontmatter(m) {
  const tags = m.tags.map((t) => `  - ${t}`).join('\n')
  return [
    '---',
    `title: ${m.title}`,
    `topic: ${m.topic}`,
    `difficulty: ${m.difficulty}`,
    `timeEstimate: ${m.timeEstimate}`,
    `tags:`,
    tags,
    `phase: ${m.phase}`,
    m.notebooklmModuleId ? `notebooklmModuleId: ${m.notebooklmModuleId}` : null,
    '---',
  ]
    .filter((l) => l !== null)
    .join('\n')
}

function buildResourceTableProp(rows) {
  if (!rows?.length) return ''
  const rowsStr = rows
    .map((r) => {
      const pago = r.pago ? `, pago: '${r.pago}'` : ''
      return `  { tema: '${r.tema}', gratuito: '${r.gratuito}'${pago}, deliverable: '${r.deliverable}' }`
    })
    .join(',\n')
  return `<ResourceTable rows={[\n${rowsStr},\n]} />`
}

function buildDeliverableItems(m) {
  const items = m.deliverables.map((d) => `  '${d.replace(/'/g, "\\'")}'`).join(',\n')
  return `<DeliverableList moduleId="${m.slug.split('/').pop()}" items={[\n${items},\n]} />`
}

function buildNotebooklmBlock(m) {
  if (!m.notebooklmModuleId) return ''
  return `
{/* <!-- notebooklm-sync-start --> */}
> NotebookLM module: \`${m.notebooklmModuleId}\`

## NotebookLM Q&A
- **Q:** ¿Cuál es el concepto más importante de este módulo?
  **A:** (Pendiente de sincronización — ejecuta \`npm run sync\`)
{/* <!-- notebooklm-sync-end --> */}
`
}

function buildMdx(m) {
  const hasResources = !!(m.resourceRows?.length)
  const depth = m.slug.split('/').length
  const rel = depth > 1 ? '../'.repeat(depth - 1) : './'

  const imports = [
    hasResources ? `import ResourceTable from '${rel}components/ResourceTable'` : '',
    `import CheckpointCallout from '${rel}components/CheckpointCallout'`,
    `import DeliverableList from '${rel}components/DeliverableList'`,
    `import InteractiveCodeBlock from '${rel}components/InteractiveCodeBlock'`,
  ]
    .filter(Boolean)
    .join('\n')

  return `${buildFrontmatter(m)}

${imports}

# ${m.title}

> **Objetivo:** Completa los deliverables abajo antes de marcar este módulo como terminado.

${hasResources ? buildResourceTableProp(m.resourceRows) : ''}

## Deliverables

${buildDeliverableItems(m)}

<CheckpointCallout>
${m.checkpoint}
</CheckpointCallout>

## Starter Code

<InteractiveCodeBlock
  title="Placeholder — reemplaza con tu primer ejercicio"
  description="${m.title}"
  code={\`// TODO: starter code para ${m.title.replace(/`/g, "'")}
console.log('Módulo: ${m.title.replace(/`/g, "'").replace(/'/g, "\\'")}')
\`}
/>
${buildNotebooklmBlock(m)}
${m.next ? `**Siguiente módulo:** [[${m.next}]]` : '**Fin de esta fase.**'}
`
}

// ── Main ──────────────────────────────────────────────────────────────────────

let created = 0
let skipped = 0

for (const m of modules) {
  const filePath = join(CONTENT_DIR, `${m.slug}.mdx`)
  const dir = dirname(filePath)

  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })

  if (existsSync(filePath) && !force) {
    const existing = readFileSync(filePath, 'utf8')
    const isPlaceholder = existing.includes('// TODO: starter code')
    if (!isPlaceholder) {
      console.log(`  skip  ${m.slug}.mdx  (has custom content — use --force to overwrite)`)
      skipped++
      continue
    }
  }

  if (existsSync(filePath) && !force) {
    console.log(`  skip  ${m.slug}.mdx  (already exists)`)
    skipped++
    continue
  }

  writeFileSync(filePath, buildMdx(m), 'utf8')
  console.log(`  write ${m.slug}.mdx`)
  created++
}

// Write content-index.json for search pre-build
if (!existsSync(PUBLIC_DIR)) mkdirSync(PUBLIC_DIR, { recursive: true })
const index = modules.map((m) => ({
  id: m.slug.split('/').pop(),
  slug: m.slug.split('/').pop(),
  title: m.title,
  topic: m.topic,
  difficulty: m.difficulty,
  timeEstimate: m.timeEstimate,
  tags: m.tags,
  phase: m.phase,
}))
writeFileSync(join(PUBLIC_DIR, 'content-index.json'), JSON.stringify(index, null, 2), 'utf8')

console.log(`\nDone. Created: ${created}, Skipped: ${skipped}`)
console.log(`Wrote public/content-index.json (${index.length} modules)`)
console.log('\nRun `npm run dev` to preview at http://localhost:5173')

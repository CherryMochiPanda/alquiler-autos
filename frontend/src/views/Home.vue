<template>
  <section class="hero">
    <div class="blur-bg"></div>
    <div class="hero-content">
      <h1>{{ $t('home.hero.title') }}</h1>
      <p>{{ $t('home.hero.subtitle') }}</p>
      <div class="hero-buttons">
        <router-link to="/catalogo" class="btn">{{ $t('home.hero.ctaCatalog') }}</router-link>
        <router-link to="/reservar" class="btn alt">{{ $t('home.hero.ctaReserve') }}</router-link>
      </div>
    </div>
  </section>
  <section class="features">
  <div class="feature">
    <font-awesome-icon :icon="['fas', 'car']" class="icon" />
    <h3>{{ $t('home.features.varietyTitle') }}</h3>
    <p>{{ $t('home.features.varietyText') }}</p>
  </div>
  <div class="feature">
    <font-awesome-icon :icon="['fas', 'bolt']" class="icon" />
    <h3>{{ $t('home.features.fastTitle') }}</h3>
    <p>{{ $t('home.features.fastText') }}</p>
  </div>
  <div class="feature">
    <font-awesome-icon :icon="['fas', 'money-bill-wave']" class="icon" />
    <h3>{{ $t('home.features.priceTitle') }}</h3>
    <p>{{ $t('home.features.priceText') }}</p>
  </div>
  </section>
  <section class="timeline-loop">
  <h2>{{ $t('home.howItWorks') }}</h2>
  <div class="timeline-container">
    <!-- timeline line with inner progress bar we control from JS -->
    <div class="timeline-line" ref="timelineLine">
      <div class="timeline-progress" ref="timelineProgress"></div>
      <div v-for="(s,i) in dotStyles" :key="i" class="timeline-dot" :style="s"></div>
    </div>
    <div class="timeline-steps" ref="timelineSteps">
      <div :class="['step', { active: activeStep === 0 }]" id="step1" :ref="el => setStepRef(el,0)" tabindex="-1">
        <div class="circle">{{ completed[0] ? '✔' : '1' }}</div>
        <h3>{{ $t('home.steps.explore') }}</h3>
        <p class="step-desc" v-show="activeStep === 0">{{ $t('home.stepsDesc.explore') }}</p>
      </div>
      <div :class="['step', { active: activeStep === 1 }]" id="step2" :ref="el => setStepRef(el,1)" tabindex="-1">
        <div class="circle">{{ completed[1] ? '✔' : '2' }}</div>
        <h3>{{ $t('home.steps.pickDates') }}</h3>
        <p class="step-desc" v-show="activeStep === 1">{{ $t('home.stepsDesc.pickDates') }}</p>
      </div>
      <div :class="['step', { active: activeStep === 2 }]" id="step3" :ref="el => setStepRef(el,2)" tabindex="-1">
        <div class="circle">{{ completed[2] ? '✔' : '3' }}</div>
        <h3>{{ $t('home.steps.confirm') }}</h3>
        <p class="step-desc" v-show="activeStep === 2">{{ $t('home.stepsDesc.confirm') }}</p>
      </div>
      <div :class="['step', { active: activeStep === 3 }]" id="step4" :ref="el => setStepRef(el,3)" tabindex="-1">
        <div class="circle">{{ completed[3] ? '✔' : '4' }}</div>
        <h3>{{ $t('home.steps.enjoy') }}</h3>
        <p class="step-desc" v-show="activeStep === 3">{{ $t('home.stepsDesc.enjoy') }}</p>
      </div>
    </div>
  </div>
  </section>
  <section class="featured-cars">
  <h2>{{ $t('home.featured') }}</h2>
  <div class="car-grid">
    <CarCard v-for="auto in featuredAutos" :key="auto.id" :auto="auto" :coverImage="auto.cover" variant="featured" @view="viewCar" />
  </div>
  </section>

  <section class="testimonials">
  <h2>{{ $t('home.testimonials') }}</h2>
  <div class="testimonial-grid">
    <div class="testimonial">
      <p>“AutoRent me salvó en mi viaje a Varadero. El proceso fue rápido y el auto estaba impecable.”</p>
      <h4>— Laura G.</h4>
    </div>
    <div class="testimonial">
      <p>“Reservé desde mi celular en 5 minutos. ¡Muy fácil y sin sorpresas!”</p>
      <h4>— Ernesto P.</h4>
    </div>
    <div class="testimonial">
      <p>“Excelente atención y variedad de autos. Recomiendo AutoRent a todos mis amigos.”</p>
      <h4>— Yanelis M.</h4>
    </div>
  </div>
  </section>
</template>
<script setup>
import CarCard from '../components/CarCard.vue'
import { autos } from '../data/autos'
import { useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()

// timeline control
const progress = ref(0) // 0..1 (kept for possible UI debugging)
const activeStep = ref(0) // 0..3
const timelineLine = ref(null)
const timelineProgress = ref(null)
const timelineSteps = ref(null)
const stepEls = []
const stepPositions = []
const dotStyles = ref([])
const completed = ref([])
let rafId = null

function setStepRef(el, idx) {
  stepEls[idx] = el
}

function computeStepPositions() {
  if (!timelineLine.value) return
  // measure container and steps to position the line exactly below the squares
  const containerRect = timelineLine.value.parentElement.getBoundingClientRect()
  const lineRect = timelineLine.value.getBoundingClientRect()
  const left = lineRect.left
  const width = lineRect.width
  // compute a top value so the line sits directly below the bottom of the step elements
  let maxBottom = 0
  for (let i = 0; i < stepEls.length; i++) {
    const el = stepEls[i]
    if (!el) continue
    const rect = el.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    // track the maximum bottom to place the line underneath
    if (rect.bottom > maxBottom) maxBottom = rect.bottom
    const pos = (centerX - left) / width
    stepPositions[i] = Math.min(Math.max(pos, 0), 1)
    // update dot style for template (as percent)
    dotStyles.value[i] = { left: `${Math.min(Math.max(pos, 0), 1) * 100}%` }
  }

  // ensure completed array tracks steps
  completed.value = new Array(stepPositions.length).fill(false)

  if (maxBottom > 0) {
    // place the line a few pixels below the lowest step (relative to the container)
    const gap = 12
    const topPx = Math.round(maxBottom - containerRect.top + gap)
    timelineLine.value.style.top = `${topPx}px`
    // ensure the container is tall enough so the line never ends up behind the steps
    try {
      const lineHeight = timelineLine.value.getBoundingClientRect().height || 10
      const requiredMin = topPx + lineHeight + 8 // small padding
      const parent = timelineLine.value.parentElement
      if (parent) {
        parent.style.minHeight = `${requiredMin}px`
        // add a small smooth transition on mobile so layout change isn't abrupt
        parent.style.transition = 'min-height 280ms ease'
      }
    } catch (e) {
      // ignore measurement errors
    }
  }
}

function startTimeline() {
  // segment-based animation: go from 0 -> firstPoint (quick), then for each segment
  // keep the previous step active while the line travels to the next point.
  const totalCycle = 8000 // ms full cycle approx
  const initialApproach = 300
  const travelPerSegment = Math.max(600, Math.floor((totalCycle - initialApproach) / Math.max(1, stepPositions.length - 1)))
  const pauseOnTouch = 600 // ms pause when a point is first touched

  let cancelled = false

  function setProgress(p) {
    progress.value = p
    if (timelineProgress.value) timelineProgress.value.style.transform = `scaleX(${p})`
    // NOTE: color is now discrete per step (set when activeStep changes) to avoid
    // continuous color shifts during travel. See setActiveColor(index).
    // update completed flags when progress passes a step position
    for (let i = 0; i < stepPositions.length; i++) {
      const pos = stepPositions[i] || 0
      // small epsilon to avoid rounding issues
      completed.value[i] = p + 0.0001 >= pos
    }

    // programmatic scrolling: move the steps container along with progress so user
    // cannot manually scroll but the row follows the line.
    try {
      const container = timelineSteps.value
      if (container) {
        const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth)
        // set scrollLeft proportional to progress
        container.scrollLeft = Math.round(p * maxScroll)
      }
    } catch (e) { /* ignore */ }
  }

  // discrete colors per step (rgb arrays)
  const stepColors = [
    [0, 200, 255], // blue
    [255, 140, 30], // orange
    [255, 140, 30], // orange (confirm)
    [24, 200, 100] // green
  ]

  function setActiveColor(index) {
    try {
      const container = timelineLine.value && timelineLine.value.parentElement
      if (!container) return
      const idx = Math.max(0, Math.min(stepColors.length - 1, index))
      const c = stepColors[idx]
      container.style.setProperty('--active-rgb', `${c[0]}, ${c[1]}, ${c[2]}`)
    } catch (e) { /* ignore */ }
  }

  async function animateTo(from, to, duration) {
    return new Promise(resolve => {
      const start = performance.now()
      const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      function frame(now) {
        if (cancelled) return resolve()
        const t = Math.min(1, (now - start) / duration)
        const eased = easeInOutCubic(t)
        const val = from + (to - from) * eased
        setProgress(val)
        if (t < 1) rafId = requestAnimationFrame(frame)
        else resolve()
      }
      rafId = requestAnimationFrame(frame)
    })
  }

  async function playLoop() {
    // ensure positions are ready
    const pts = stepPositions.slice().sort((a,b)=>a-b)
    if (!pts.length) return
    // initial approach to first point
    await animateTo(0, pts[0], initialApproach)
  // touch first point
  activeStep.value = 0
  setActiveColor(0)
  await new Promise(r => setTimeout(r, pauseOnTouch))

    // for each segment, travel from pts[i] to pts[i+1] while keeping activeStep = i
    for (let i = 0; i < pts.length - 1; i++) {
      // travel while keeping current step active
      await animateTo(pts[i], pts[i+1], travelPerSegment)
      // when arrived, activate next step (discrete color change here)
      activeStep.value = i+1
      setActiveColor(i+1)
      // small pause to let user read
      await new Promise(r => setTimeout(r, pauseOnTouch))
    }

    // reached last point: pause, then reset instantly and loop
    await new Promise(r => setTimeout(r, pauseOnTouch))
    if (cancelled) return
  // reset instantly without animation to avoid reverse wave
  setProgress(0)
  activeStep.value = 0
  setActiveColor(0)
    // loop
    if (!cancelled) playLoop()
  }

  playLoop()

  // expose cancel via rafId and cancelled flag
  rafId = { cancel: () => { cancelled = true } }
}

onMounted(async () => {
  // wait for layout
  await nextTick()
  computeStepPositions()
  // recompute on resize
  window.addEventListener('resize', computeStepPositions)
  // recompute if the steps container scrolls (mobile horizontal scroll)
  if (timelineSteps.value) {
    timelineSteps.value.addEventListener('scroll', computeStepPositions, { passive: true })
  }
  startTimeline()
})

onUnmounted(() => {
  // rafId may be an object when using playLoop cancel
  if (rafId && typeof rafId === 'number') cancelAnimationFrame(rafId)
  else if (rafId && rafId.cancel) rafId.cancel()
  window.removeEventListener('resize', computeStepPositions)
  if (timelineSteps.value) timelineSteps.value.removeEventListener('scroll', computeStepPositions)
})

// derive featured autos from localStorage (admin can set destacado) or fallback to data file
const localAutos = JSON.parse(localStorage.getItem('autos') || 'null') || autos
let featuredAutos = (localAutos.filter(a => a.destacado)).slice(0, 3)
// fallback older behavior: if none marked, pick the default ids
if (!featuredAutos.length) {
  const ids = ['sedan', 'suv', 'deportivo']
  featuredAutos = ids.map(id => localAutos.find(a => a.id === id)).filter(Boolean)
}

function viewCar(id) {
  router.push({ path: '/detalle-auto', query: { auto: id } })
}

function reserveCar(id) {
  router.push({ path: '/reservar', query: { auto: id } })
}
</script>
<style scoped>
.hero {
  background: var(--bg-color);
  color: var(--text-color);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 6rem 2rem;
  min-height: 80vh;
  overflow: hidden;
  
}

.blur-bg {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 120%;
  height: 120%;
  background: radial-gradient(circle at 30% 30%, #00f0ff33, transparent 70%),
              radial-gradient(circle at 70% 70%, #0077cc33, transparent 70%);
  filter: blur(80px);
  z-index: 0;
  animation: moveGlow 20s ease-in-out infinite alternate;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 700px;
}

h1 {
  font-size: 8rem;
  font-weight: 800;
  color: var(--text-color);
  text-shadow: var(--neon-shadow);
  border-radius: 12px;
  padding: 0.5rem 1rem;
  animation: glowShift 6s ease-in-out infinite;
}


p {
  font-size: 3rem;
  font-weight: 400;
  margin-bottom: 2.5rem;
  color: var(--text-color);
}


.hero-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn {
  background-color: var(--accent-color);
  color: #fff;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  text-decoration: none;
  box-shadow: var(--neon-shadow);
  transition: transform 0.3s ease;
}

.btn:hover {
  transform: scale(1.05);
}

.btn.alt {
  background-color: transparent;
  border: 2px solid var(--accent-color);
  color: var(--accent-color);
}

/* Responsive adjustments */
@media (max-width: 900px) {
  h1 {
    font-size: 3.2rem;
    line-height: 1.05;
    padding: 0.25rem 0.5rem;
  }
  p {
    font-size: 1.1rem;
    margin-bottom: 1.25rem;
  }
  .hero {
    padding: 3.5rem 1.25rem;
    min-height: 60vh;
  }
  .hero-buttons {
    flex-direction: column;
    gap: 0.6rem;
  }
  .btn, .btn.alt, .btn-primary, .btn-secondary {
    width: 100%;
    max-width: 320px;
  }
  .car-grid {
    flex-direction: column;
    align-items: center;
  }
  .car-card {
    width: 95%;
    max-width: 520px;
  }
  .car-card img {
    width: 100%;
    height: 220px;
    object-fit: cover;
  }
}

/* Slight desktop tweak so featured cards keep their nice width but adapt if screen is narrow */
@media (min-width: 901px) and (max-width: 1200px) {
  .car-card {
    width: 360px;
  }
  .car-card img {
    width: 100%;
    height: 220px;
  }
}

.features {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  padding: 4rem 2rem;
  background-color: var(--bg-color);
  color: var(--text-color);
}

.feature {
  flex: 1 1 250px;
  max-width: 300px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--divider-color);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
}

.feature:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 15px var(--accent-color);
}

.feature h3 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--accent-color);
}

.feature p {
  font-size: 1.5rem;
  line-height: 1.5;
}

.icon {
  font-size: 2.5rem;
  color: var(--accent-color);
  margin-bottom: 1rem;
}

.how-it-works {
  padding: 4rem 2rem;
  background-color: var(--bg-color);
  color: var(--text-color);
  text-align: center;
}

.how-it-works h2 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: var(--accent-color);
}

.steps {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
}

.step {
  flex: 1 1 220px;
  max-width: 250px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--divider-color);
  border-radius: 12px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
}

.step:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 15px var(--accent-color);
}

.step h3 {
  font-size: 1.2rem;
  margin: 1rem 0 0.5rem;
}

.step p {
  font-size: 0.95rem;
  line-height: 1.4;
}

.timeline-loop {
  padding: 4rem 2rem;
  text-align: center;
  background-color: var(--bg-color);
  color: var(--text-color);
}

.timeline-loop h2 {
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: var(--accent-color);
}

.timeline-steps {
  display: flex;
  justify-content: center;
  gap: 3rem;
}

.step {
  width: 200px;
  padding: 2rem 1rem;
  font-size: 1rem;
  border-radius: 16px;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--divider-color);
  backdrop-filter: blur(10px);
  text-align: center;
  transform: scale(1);
  box-shadow: none;
}

.step h3 {
  font-size: 1.2rem;
  margin-top: 0.5rem;
  color: var(--text-color);
}

.circle {
  width: 60px;
  height: 60px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  border: 3px solid var(--accent-color);
  color: var(--accent-color);
  font-weight: bold;
  font-size: 1.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.timeline-container {
  position: relative;
  padding: 2rem 0;
  overflow: hidden;
}


.timeline-line {
  position: absolute;
  left: 10%;
  right: 10%;
  top: calc(50% + 72px); /* place clearly below the squares */
  height: 10px; /* thicker line */
  z-index: 0;
  border-radius: 8px;
  background: rgba(255,255,255,0.06);
  overflow: hidden;
}

/* ensure the line doesn't capture pointer events and stays visually behind steps */
.timeline-line { pointer-events: none; }

.timeline-progress {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background: var(--accent-color);
  transform-origin: left center;
  transform: scaleX(0);
  will-change: transform;
}

.timeline-dot {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--bg-color);
  border: 3px solid var(--accent-color);
  box-shadow: 0 4px 14px rgba(0,0,0,0.15);
  z-index: 2;
}


@keyframes drawLine {
  0% {
    transform: scaleX(0);
    opacity: 0.9;
  }
  60% {
    transform: scaleX(1);
    opacity: 1;
  }
  100% {
    transform: scaleX(1);
    opacity: 0.9;
  }
}


@keyframes lineProgress {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

.timeline-steps {
  display: flex;
  justify-content: space-around;
  position: relative;
  z-index: 3; /* ensure steps sit above dots and line */
}

/* Mobile: keep steps in a single horizontal row and allow touch scroll instead of wrapping */
@media (max-width: 700px) {
  .timeline-steps {
    flex-wrap: nowrap;
    overflow-x: hidden; /* prevent user scroll; we drive scroll programmatically */
    -webkit-overflow-scrolling: touch;
    gap: 1rem;
    padding: 0.5rem 1rem;
    justify-content: flex-start;
    touch-action: none;
  }
  .timeline-container {
    padding-bottom: 3.5rem; /* make room for the line */
  }
  .step {
    min-width: 160px;
    width: auto;
    padding: 1.2rem 0.8rem;
  }
  .circle { width: 50px; height: 50px; font-size: 1.2rem }
  .timeline-line { left: 5%; right: 5%; }
}



/* Animación base */

/* removed continuous pulse animation to rely on JS-driven .step.active transitions */

/* Use CSS variable to stagger pulses cleanly */
.step {
  width: 200px;
  padding: 2rem 1rem;
  font-size: 1rem;
  border-radius: 16px;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--divider-color);
  backdrop-filter: blur(10px);
  text-align: center;
  transform: scale(1);
  box-shadow: none;
  /* more subtle and smoother transition when activated */
  transition: transform 420ms cubic-bezier(.22,.9,.3,1), box-shadow 420ms cubic-bezier(.22,.9,.3,1);
}

.step.active {
  transform: translateY(-8px) scale(1.04);
  /* stronger, more blurred shadow (uses --active-rgb) */
  box-shadow: 0 18px 60px rgba(0,0,0,0.22), 0 0 50px rgba(var(--active-rgb, 0,200,255),0.18);
}

/* highlight the circle when active (glow) */
.step.active .circle {
  background: rgb(var(--active-rgb, 0,200,255));
  color: #000;
  border-color: transparent;
  box-shadow: 0 14px 40px rgba(0,0,0,0.22), 0 0 40px rgba(var(--active-rgb, 0,200,255),0.16);
  transform: scale(1.06);
}

.circle {
  transition: background 360ms cubic-bezier(.22,.9,.3,1), color 360ms cubic-bezier(.22,.9,.3,1), box-shadow 360ms cubic-bezier(.22,.9,.3,1), transform 360ms cubic-bezier(.22,.9,.3,1), border-color 360ms cubic-bezier(.22,.9,.3,1);
}

.step-desc {
  margin-top: 0.6rem;
  font-size: 0.95rem;
  color: var(--text-color);
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  transition: opacity 250ms ease, max-height 250ms ease;
}
.step.active .step-desc {
  opacity: 1;
  max-height: 160px;
}

/* Delays for ordered activation */
#step1 { --delay: 0s; }
#step2 { --delay: 1.6s; }
#step3 { --delay: 3.2s; }
#step4 { --delay: 4.8s; }


@keyframes pulse {
  0% {
    box-shadow: 0 0 0px var(--accent-color);
  }
  50% {
    box-shadow: 0 0 20px var(--accent-color);
  }
  100% {
    box-shadow: 0 0 0px var(--accent-color);
  }
}



@keyframes moveGlow {
  0% {
    transform: translateX(-50%) translateY(0);
  }
  100% {
    transform: translateX(-50%) translateY(-20px);
  }
}


@keyframes glowShift {
  0% {
    text-shadow: 0 0 10px #00f0ff, 0 0 20px #00f0ff;
    border-color: #00f0ff;
  }
  50% {
    text-shadow: 0 0 10px #0077cc, 0 0 20px #0077cc;
    border-color: #0077cc;
  }
  100% {
    text-shadow: 0 0 10px #00f0ff, 0 0 20px #00f0ff;
    border-color: #00f0ff;
  }
}

.featured-cars {
  padding: 4rem 2rem;
  text-align: center;
  background-color: var(--bg-color);
  color: var(--text-color);
}

.featured-cars h2 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: var(--accent-color);
}

.car-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
}

.car-card {
  width: 450px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--divider-color);
  border-radius: 12px;
  padding: 1.5rem;
  font-size: 1rem;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
}

.car-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 15px var(--accent-color);
}

.car-card img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.car-card h3 {
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
}

.car-card p {
  font-size: 1rem;
  margin-bottom: 1rem;
}

.car-card button {
  background-color: transparent;
  border: 2px solid var(--accent-color);
  color: var(--accent-color);
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.car-card button:hover {
  background-color: #00c0ff;
  color: #000000;
}

.testimonials {
  padding: 4rem 2rem;
  background-color: var(--bg-color);
  color: var(--text-color);
  text-align: center;
}

.testimonials h2 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: var(--accent-color);
}

.testimonial-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
}

.testimonial p {
  font-size: 1rem;
  line-height: 1.4;
}


.testimonial {
  max-width: 300px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--divider-color);
  border-radius: 12px;
  padding: 2rem;
  font-style: italic;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
}

.testimonial:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 15px var(--accent-color);
}

.testimonial h4 {
  margin-top: 1rem;
  font-weight: bold;
  color: var(--accent-color);
}

.image-placeholder {
  width: 100%;
  height: 180px;
  background-color: #2c2c2c;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 0.9rem;
  font-style: italic;
  border: 1px dashed var(--accent-color);
}
</style>
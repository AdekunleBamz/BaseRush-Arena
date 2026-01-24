/**
 * Animations Utility
 * CSS animations and JavaScript animation helpers
 */

/**
 * CSS Keyframe animations as JS objects
 */
export const keyframes = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0 },
  },
  slideInUp: {
    from: { transform: 'translateY(20px)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
  },
  slideInDown: {
    from: { transform: 'translateY(-20px)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
  },
  slideInLeft: {
    from: { transform: 'translateX(-20px)', opacity: 0 },
    to: { transform: 'translateX(0)', opacity: 1 },
  },
  slideInRight: {
    from: { transform: 'translateX(20px)', opacity: 0 },
    to: { transform: 'translateX(0)', opacity: 1 },
  },
  scaleIn: {
    from: { transform: 'scale(0.9)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
  },
  scaleOut: {
    from: { transform: 'scale(1)', opacity: 1 },
    to: { transform: 'scale(0.9)', opacity: 0 },
  },
  bounce: {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-10px)' },
  },
  pulse: {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.5 },
  },
  spin: {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
  shake: {
    '0%, 100%': { transform: 'translateX(0)' },
    '25%': { transform: 'translateX(-5px)' },
    '75%': { transform: 'translateX(5px)' },
  },
  wiggle: {
    '0%, 100%': { transform: 'rotate(0deg)' },
    '25%': { transform: 'rotate(-3deg)' },
    '75%': { transform: 'rotate(3deg)' },
  },
  glow: {
    '0%, 100%': { boxShadow: '0 0 5px var(--primary-color)' },
    '50%': { boxShadow: '0 0 20px var(--primary-color)' },
  },
}

/**
 * Animation durations (ms)
 */
export const durations = {
  instant: 0,
  fast: 150,
  normal: 300,
  slow: 500,
  verySlow: 1000,
}

/**
 * Easing functions
 */
export const easings = {
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  // Custom cubic beziers
  easeInQuad: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
  easeOutQuad: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  easeInOutQuad: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
  easeInCubic: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
  easeOutCubic: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  easeInOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  easeInExpo: 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
  easeOutExpo: 'cubic-bezier(0.19, 1, 0.22, 1)',
  easeInOutExpo: 'cubic-bezier(1, 0, 0, 1)',
  easeOutBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  easeInBack: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
}

/**
 * Animate an element with a CSS animation
 * @param {HTMLElement} element - Element to animate
 * @param {string} animationName - Name of the animation
 * @param {object} options - Animation options
 */
export function animate(element, animationName, options = {}) {
  return new Promise((resolve) => {
    const {
      duration = durations.normal,
      easing = easings.ease,
      fill = 'forwards',
      delay = 0,
    } = options

    const animation = element.animate(
      Object.entries(keyframes[animationName] || {}).map(([key, value]) => value),
      {
        duration,
        easing,
        fill,
        delay,
      }
    )

    animation.onfinish = () => resolve(animation)
    animation.oncancel = () => resolve(animation)
  })
}

/**
 * Fade in an element
 */
export async function fadeIn(element, duration = durations.normal) {
  element.style.display = ''
  return animate(element, 'fadeIn', { duration })
}

/**
 * Fade out an element
 */
export async function fadeOut(element, duration = durations.normal) {
  await animate(element, 'fadeOut', { duration })
  element.style.display = 'none'
}

/**
 * Slide in from a direction
 */
export function slideIn(element, direction = 'up', duration = durations.normal) {
  const animationMap = {
    up: 'slideInUp',
    down: 'slideInDown',
    left: 'slideInLeft',
    right: 'slideInRight',
  }
  return animate(element, animationMap[direction], { duration })
}

/**
 * Stagger animations for a list of elements
 */
export async function stagger(elements, animationName, options = {}) {
  const { staggerDelay = 50, ...animationOptions } = options
  
  const animations = Array.from(elements).map((element, index) =>
    animate(element, animationName, {
      ...animationOptions,
      delay: index * staggerDelay,
    })
  )

  return Promise.all(animations)
}

/**
 * Add entrance animation on element mount
 */
export function animateOnMount(element, animationName = 'fadeIn', options = {}) {
  if (!element) return

  element.style.opacity = '0'
  requestAnimationFrame(() => {
    animate(element, animationName, options)
  })
}

/**
 * Create a spring animation
 */
export function spring(element, targetStyles, options = {}) {
  const { stiffness = 100, damping = 10, mass = 1 } = options

  // Simple spring physics simulation
  const duration = Math.sqrt(mass / stiffness) * 1000 * 4
  
  return element.animate([targetStyles], {
    duration,
    easing: easings.spring,
    fill: 'forwards',
  })
}

/**
 * Shake element (error feedback)
 */
export function shake(element) {
  return animate(element, 'shake', { duration: 400 })
}

/**
 * Pulse element (attention)
 */
export function pulse(element, count = 2) {
  return element.animate(
    [
      { opacity: 1 },
      { opacity: 0.5 },
      { opacity: 1 },
    ],
    {
      duration: 500,
      iterations: count,
    }
  )
}

/**
 * Number counter animation
 */
export function animateNumber(element, from, to, duration = 1000) {
  const startTime = performance.now()
  const difference = to - from

  function update(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    // Ease out quad
    const eased = 1 - (1 - progress) * (1 - progress)
    const current = from + difference * eased

    element.textContent = Math.round(current).toLocaleString()

    if (progress < 1) {
      requestAnimationFrame(update)
    }
  }

  requestAnimationFrame(update)
}

/**
 * Typewriter effect
 */
export function typewriter(element, text, options = {}) {
  const { speed = 50, startDelay = 0 } = options

  return new Promise((resolve) => {
    element.textContent = ''
    let index = 0

    setTimeout(() => {
      const interval = setInterval(() => {
        element.textContent = text.slice(0, index + 1)
        index++

        if (index >= text.length) {
          clearInterval(interval)
          resolve()
        }
      }, speed)
    }, startDelay)
  })
}

/**
 * Confetti effect (for celebrations)
 */
export function confetti(container, options = {}) {
  const {
    count = 50,
    colors = ['#FFD700', '#00ff88', '#ff6b35', '#4ecdc4', '#a855f7'],
    duration = 3000,
  } = options

  const particles = []

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div')
    particle.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
      pointer-events: none;
      z-index: 9999;
      left: ${50 + (Math.random() - 0.5) * 20}%;
      top: -10px;
    `
    container.appendChild(particle)
    particles.push(particle)

    const angle = Math.random() * Math.PI * 2
    const velocity = 2 + Math.random() * 3
    const vx = Math.cos(angle) * velocity
    const vy = Math.sin(angle) * velocity - 5
    const rotation = Math.random() * 720 - 360

    particle.animate(
      [
        { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
        { transform: `translate(${vx * 100}px, ${window.innerHeight + 100}px) rotate(${rotation}deg)`, opacity: 0 },
      ],
      {
        duration: duration + Math.random() * 1000,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }
    ).onfinish = () => particle.remove()
  }
}

export default {
  keyframes,
  durations,
  easings,
  animate,
  fadeIn,
  fadeOut,
  slideIn,
  stagger,
  animateOnMount,
  spring,
  shake,
  pulse,
  animateNumber,
  typewriter,
  confetti,
}

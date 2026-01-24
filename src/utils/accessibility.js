/**
 * Accessibility Utilities
 * Helpers for building accessible UI components
 */

/**
 * Generate a unique ID for accessibility purposes
 */
let idCounter = 0
export function generateId(prefix = 'br') {
  return `${prefix}-${++idCounter}`
}

/**
 * Announce message to screen readers
 * @param {string} message - Message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
export function announce(message, priority = 'polite') {
  if (typeof document === 'undefined') return

  let announcer = document.getElementById('br-announcer')
  
  if (!announcer) {
    announcer = document.createElement('div')
    announcer.id = 'br-announcer'
    announcer.setAttribute('aria-live', priority)
    announcer.setAttribute('aria-atomic', 'true')
    announcer.style.cssText = `
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    `
    document.body.appendChild(announcer)
  }

  // Clear and set message
  announcer.textContent = ''
  announcer.setAttribute('aria-live', priority)
  
  // Use setTimeout to ensure the DOM change is registered
  setTimeout(() => {
    announcer.textContent = message
  }, 100)
}

/**
 * Get appropriate aria-label for a value
 */
export function getAriaLabel(value, type = 'text') {
  if (type === 'currency') {
    return `${value} ETH`
  }
  if (type === 'percentage') {
    return `${value} percent`
  }
  if (type === 'countdown') {
    const parts = value.split(':')
    if (parts.length === 3) {
      return `${parts[0]} hours, ${parts[1]} minutes, ${parts[2]} seconds remaining`
    }
    if (parts.length === 2) {
      return `${parts[0]} minutes, ${parts[1]} seconds remaining`
    }
  }
  return String(value)
}

/**
 * Handle keyboard navigation for menus and lists
 * @param {KeyboardEvent} event - Keyboard event
 * @param {HTMLElement[]} items - Array of focusable items
 * @param {object} options - Options
 */
export function handleArrowNavigation(event, items, options = {}) {
  const { 
    loop = true, 
    orientation = 'vertical',
    onSelect,
    onEscape,
  } = options

  const currentIndex = items.findIndex(item => item === document.activeElement)
  let nextIndex = currentIndex

  const prevKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft'
  const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight'

  switch (event.key) {
    case prevKey:
      event.preventDefault()
      nextIndex = currentIndex - 1
      if (nextIndex < 0) {
        nextIndex = loop ? items.length - 1 : 0
      }
      items[nextIndex]?.focus()
      break

    case nextKey:
      event.preventDefault()
      nextIndex = currentIndex + 1
      if (nextIndex >= items.length) {
        nextIndex = loop ? 0 : items.length - 1
      }
      items[nextIndex]?.focus()
      break

    case 'Home':
      event.preventDefault()
      items[0]?.focus()
      break

    case 'End':
      event.preventDefault()
      items[items.length - 1]?.focus()
      break

    case 'Enter':
    case ' ':
      event.preventDefault()
      onSelect?.(items[currentIndex], currentIndex)
      break

    case 'Escape':
      event.preventDefault()
      onEscape?.()
      break
  }
}

/**
 * Trap focus within an element
 * @param {HTMLElement} container - Container element
 */
export function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  const firstFocusable = focusableElements[0]
  const lastFocusable = focusableElements[focusableElements.length - 1]

  const handleKeyDown = (event) => {
    if (event.key !== 'Tab') return

    if (event.shiftKey) {
      if (document.activeElement === firstFocusable) {
        event.preventDefault()
        lastFocusable.focus()
      }
    } else {
      if (document.activeElement === lastFocusable) {
        event.preventDefault()
        firstFocusable.focus()
      }
    }
  }

  container.addEventListener('keydown', handleKeyDown)
  firstFocusable?.focus()

  return () => {
    container.removeEventListener('keydown', handleKeyDown)
  }
}

/**
 * Get ARIA props for a dialog
 */
export function getDialogProps(id, title, description) {
  return {
    role: 'dialog',
    'aria-modal': true,
    'aria-labelledby': title ? `${id}-title` : undefined,
    'aria-describedby': description ? `${id}-description` : undefined,
  }
}

/**
 * Get ARIA props for tabs
 */
export function getTabListProps(id) {
  return {
    role: 'tablist',
    id: `${id}-tablist`,
  }
}

export function getTabProps(id, index, selected) {
  return {
    role: 'tab',
    id: `${id}-tab-${index}`,
    'aria-selected': selected,
    'aria-controls': `${id}-panel-${index}`,
    tabIndex: selected ? 0 : -1,
  }
}

export function getTabPanelProps(id, index, selected) {
  return {
    role: 'tabpanel',
    id: `${id}-panel-${index}`,
    'aria-labelledby': `${id}-tab-${index}`,
    tabIndex: 0,
    hidden: !selected,
  }
}

/**
 * Get ARIA props for a menu
 */
export function getMenuProps(id) {
  return {
    role: 'menu',
    id,
    'aria-orientation': 'vertical',
  }
}

export function getMenuItemProps(disabled = false) {
  return {
    role: 'menuitem',
    'aria-disabled': disabled,
    tabIndex: disabled ? -1 : 0,
  }
}

/**
 * Get ARIA props for a combobox
 */
export function getComboboxProps(id, isOpen, activeIndex) {
  return {
    role: 'combobox',
    'aria-expanded': isOpen,
    'aria-controls': `${id}-listbox`,
    'aria-activedescendant': activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined,
    'aria-haspopup': 'listbox',
  }
}

export function getOptionProps(id, index, selected) {
  return {
    role: 'option',
    id: `${id}-option-${index}`,
    'aria-selected': selected,
  }
}

/**
 * Get ARIA props for a progress bar
 */
export function getProgressProps(value, min = 0, max = 100, label) {
  return {
    role: 'progressbar',
    'aria-valuenow': value,
    'aria-valuemin': min,
    'aria-valuemax': max,
    'aria-valuetext': label || `${Math.round((value / max) * 100)}%`,
  }
}

/**
 * Get ARIA props for a tooltip
 */
export function getTooltipProps(id, content) {
  return {
    trigger: {
      'aria-describedby': id,
    },
    tooltip: {
      id,
      role: 'tooltip',
    },
  }
}

/**
 * Get ARIA props for a switch/toggle
 */
export function getSwitchProps(checked, label) {
  return {
    role: 'switch',
    'aria-checked': checked,
    'aria-label': label,
  }
}

/**
 * Get ARIA props for a slider
 */
export function getSliderProps(value, min, max, step, label) {
  return {
    role: 'slider',
    'aria-valuenow': value,
    'aria-valuemin': min,
    'aria-valuemax': max,
    'aria-valuetext': String(value),
    'aria-label': label,
  }
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Check if user prefers high contrast
 */
export function prefersHighContrast() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-contrast: high)').matches
}

/**
 * Visually hidden styles (for screen readers only)
 */
export const visuallyHiddenStyle = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: '0',
}

/**
 * Skip link styles
 */
export const skipLinkStyle = {
  ...visuallyHiddenStyle,
  '&:focus': {
    position: 'fixed',
    top: '10px',
    left: '10px',
    width: 'auto',
    height: 'auto',
    clip: 'auto',
    padding: '1rem',
    zIndex: 9999,
    backgroundColor: 'var(--card-bg)',
    color: 'var(--text-color)',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  },
}

export default {
  generateId,
  announce,
  getAriaLabel,
  handleArrowNavigation,
  trapFocus,
  getDialogProps,
  getTabListProps,
  getTabProps,
  getTabPanelProps,
  getMenuProps,
  getMenuItemProps,
  getComboboxProps,
  getOptionProps,
  getProgressProps,
  getTooltipProps,
  getSwitchProps,
  getSliderProps,
  prefersReducedMotion,
  prefersHighContrast,
  visuallyHiddenStyle,
  skipLinkStyle,
}

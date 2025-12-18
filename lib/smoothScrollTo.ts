/**
 * Smooth scroll utility with custom easing
 * 
 * Provides consistent, cinematic scroll animation using requestAnimationFrame
 * with easeInOutCubic easing function.
 */

/**
 * Easing function: easeInOutCubic
 * Creates a smooth acceleration and deceleration curve
 */
function easeInOutCubic(t: number): number {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2
}

/**
 * Smoothly scrolls to a target position
 * 
 * @param targetY - Target scroll position in pixels
 * @param duration - Animation duration in milliseconds (default: 750ms)
 * @param onComplete - Optional callback when animation completes
 */
export function smoothScrollTo(
  targetY: number,
  duration: number = 750,
  onComplete?: () => void
): void {
  const startY = window.scrollY
  const distance = targetY - startY
  const startTime = performance.now()

  // If distance is very small, skip animation
  if (Math.abs(distance) < 1) {
    window.scrollTo(0, targetY)
    onComplete?.()
    return
  }

  function animate(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = easeInOutCubic(progress)
    const currentY = startY + distance * eased

    window.scrollTo(0, currentY)

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      // Ensure we end exactly at target
      window.scrollTo(0, targetY)
      onComplete?.()
    }
  }

  requestAnimationFrame(animate)
}

/**
 * Smoothly scrolls to a target element
 * 
 * @param element - Target HTML element
 * @param offset - Additional offset in pixels (e.g., for navbar height)
 * @param duration - Animation duration in milliseconds (default: 750ms)
 * @param onComplete - Optional callback when animation completes
 */
export function smoothScrollToElement(
  element: HTMLElement,
  offset: number = 0,
  duration: number = 750,
  onComplete?: () => void
): void {
  const rect = element.getBoundingClientRect()
  const targetY = rect.top + window.scrollY - offset
  smoothScrollTo(targetY, duration, onComplete)
}


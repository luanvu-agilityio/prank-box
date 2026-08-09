export const createCrackPath = (originX: number, originY: number) => {
  const rayCount = 7
  const createSegment = (_: undefined, rayIndex: number) => {
    const angle = (Math.PI * 2 * rayIndex) / rayCount + (Math.random() - 0.5) * 0.35
    const length = 80 + Math.random() * 100
    const endX = originX + Math.cos(angle) * length
    const endY = originY + Math.sin(angle) * length
    const bendX = originX + Math.cos(angle) * length * 0.45 + (Math.random() - 0.5) * 18
    const bendY = originY + Math.sin(angle) * length * 0.45 + (Math.random() - 0.5) * 18
    const branchAngle = angle + (Math.random() > 0.5 ? 0.65 : -0.65)
    const branchLength = 24 + Math.random() * 34
    const branchStartX = originX + Math.cos(angle) * length * 0.55
    const branchStartY = originY + Math.sin(angle) * length * 0.55
    const branchEndX = branchStartX + Math.cos(branchAngle) * branchLength
    const branchEndY = branchStartY + Math.sin(branchAngle) * branchLength
    return `M ${originX} ${originY} L ${bendX} ${bendY} L ${endX} ${endY} M ${branchStartX} ${branchStartY} L ${branchEndX} ${branchEndY}`
  }

  return Array.from({ length: rayCount }, createSegment).join(' ')
}

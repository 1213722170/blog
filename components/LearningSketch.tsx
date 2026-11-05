/** A code-native notebook drawing with no external image or font requests. */
export function LearningSketch() {
  const layers = [[52, 104, 156], [38, 82, 126, 170], [64, 144]];
  return <div className="learning-sketch" aria-hidden="true">
    <div className="sketch-topline"><span>NOTES ON LEARNING</span><span>手记 / 01</span></div>
    <svg viewBox="0 0 380 235" fill="none">
      <defs><pattern id="notebook-grid" width="19" height="19" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.7" fill="currentColor" opacity="0.16" /></pattern></defs>
      <rect width="380" height="235" fill="url(#notebook-grid)" />
      {[0, 1].map((layer) => layers[layer].flatMap((y, i) => layers[layer + 1].map((nextY, j) => <line key={layer + "-" + i + "-" + j} x1={76 + layer * 110} y1={y + 12} x2={186 + layer * 110} y2={nextY + 12} stroke="currentColor" opacity="0.19" />)))}
      {layers.map((nodes, layer) => nodes.map((y, i) => <circle key={layer + "-" + i} cx={76 + layer * 110} cy={y + 12} r="7" className={layer === 1 ? "sketch-node-filled" : "sketch-node"} stroke="currentColor" />))}
      <path d="M66 211h239m-6-4 6 4-6 4" stroke="currentColor" opacity="0.4" />
      <text x="71" y="229" fill="currentColor" fontSize="10" opacity="0.6">输入</text><text x="176" y="229" fill="currentColor" fontSize="10" opacity="0.6">理解</text><text x="285" y="229" fill="currentColor" fontSize="10" opacity="0.6">输出</text>
      <text x="320" y="70" fill="currentColor" fontFamily="Georgia, serif" fontStyle="italic" fontSize="17">ŷ</text>
    </svg>
    <div className="sketch-bottomline"><span>寻找一个更好的 f(x)</span><span className="sketch-handwriting">keep learning.</span></div>
  </div>;
}

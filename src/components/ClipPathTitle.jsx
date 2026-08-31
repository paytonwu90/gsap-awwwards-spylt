const ClipPathTitle = ({ title, color, bg, className, borderColor }) => {
  return (
    <div className="general-title">
      <div
        style={{
          borderColor,
          clipPath: "polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)"
        }}
        className={`${className} border-[.5vw] text-nowrap opacity-0`}
      >
        <div
          className="pb-5 px-3 md:px-14 pt-3 md:pt-0"
          style={{
            backgroundColor: bg,
          }}
        >
          <h2 style={{ color }}>{title}</h2>
        </div>
      </div>
    </div>
  )
}

export default ClipPathTitle

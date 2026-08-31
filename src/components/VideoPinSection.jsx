import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useMediaQuery } from "react-responsive"

const VideoPinSection = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 })

  useGSAP(() => {
    if (isMobile) return;
    gsap.to(".video-box", {
      clipPath: "circle(100% at 50% 50%)",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: ".vd-pin-section",
        start: "0% top",
        end: "250% top",
        scrub: 1.5,
        // pin 期間會動態操作 .vd-pin-section 的 transform,相關的 CSS 位置調整
        // 要用 margin 而非 translate,原因見 index.css 的 .vd-pin-section 註解。
        pin: true,
      },
    })
  })
  
  return (
    <section className="vd-pin-section">
      <div
        style={{ clipPath: isMobile ? "circle(100% at 50% 50%)" : "circle(6% at 50% 50%)" }} 
        className="size-full video-box"
      >
        <video src="/videos/pin-video.mp4" playsInline autoPlay loop muted></video>

        <div className="abs-center scale-200 md:scale-100">
          <img src="/images/circle-text.svg" className="spin-circle" alt="circle-text" />
          <div className="play-btn">
            <img src="/images/play.svg" className="size-[3vw] ml-[0.5vw]" alt="play-btn" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default VideoPinSection

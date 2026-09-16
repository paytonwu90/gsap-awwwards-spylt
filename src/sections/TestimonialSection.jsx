import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useMediaQuery } from "react-responsive"
import { cards } from "../constants"

const TestimonialSection = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 })

  useGSAP(() => {
    // 手機版 VideoPinSection 沒有 pin，只是一般高度的區塊，
    // 套用 -100vh 會讓它一開始就被蓋住看不到，所以只在桌面版套用。
    if (!isMobile) {
      gsap.set(".testimonials-section", {
        marginTop: "-100vh",
      });
    }

    const titleTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".testimonials-section",
        start: "top bottom",
        end: "200% top",
        scrub: true,
      },
    });
    titleTl.to(".testimonials-section .first-title", {
      xPercent: 60,
    })
    .to(".testimonials-section .sec-title", {
      xPercent: 25,
    }, "<")
    .to(".testimonials-section .third-title", {
      xPercent: -50,
    }, "<");

    const pinTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".testimonials-section",
        start: "10% top",
        end: "200% top",
        scrub: 1.5,
        pin: true,
      },
    });

    // 明確把每張卡片該轉的角度告訴 GSAP，不要讓它自己解析 CSS 的 rotate-z-*：
    // dev server（Vite HMR 動態插入 <style>）CSS 生效時機不保證跟 GSAP 同步，
    // GSAP 只在第一次操作 transform 時解析一次並快取，解析失敗就永久遺失旋轉角度。
    gsap.set(".testimonials-section .vd-card", {
      rotation: (i) => cards[i].rotationDeg,
    });

    pinTl.from(".testimonials-section .vd-card", {
      yPercent: 150,
      stagger: 0.8,
      ease: "power1.inOut"
    });

  });

  return (
    <section className="testimonials-section">
      <div className="absolute size-full flex flex-col items-center pt-[5vw]">
        <h1 className="text-black first-title">What's</h1>
        <h1 className="text-light-brown sec-title">Everyone</h1>
        <h1 className="text-black third-title">Talking</h1>
      </div>

      <div className="pin-box">
        {
          cards.map((card, index) => (
            <div
              key={index}
              className={`vd-card ${card.translation} ${card.rotation}`}
              onMouseEnter={(e) => {
                e.currentTarget.querySelector('video').play();
              }}
              onMouseLeave={(e) => {
                e.currentTarget.querySelector('video').pause();
              }}
            >
              <video
                src={card.src}
                className="size-full object-cover"
                playsInline
                loop
                muted
              />
            </div>
          ))
        }
      </div>
    </section>
  )
}

export default TestimonialSection

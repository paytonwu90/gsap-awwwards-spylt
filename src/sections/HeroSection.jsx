import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { SplitText } from "gsap/SplitText"

const HeroSection = () => {
  useGSAP(() => {
    const titleSplit = SplitText.create(".hero-title", {
      type: "chars"
    });

    const tl = gsap.timeline({ delay: 1 });

    tl.to(".hero-content", {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power1.inOut",
    })
    .to(".hero-text-scroll", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 1,
      ease: "circ.out",
    }, "<")
    .from(titleSplit.chars, {
      y: "100%",
      duration: 0.5,
      ease: "power2.out",
      stagger: 0.02,
    }, "-=0.5");


    // scrollTrigger 觸發稍微旋轉
    gsap.to(".hero-container", {
      rotation: 7,
      scale: 0.9,
      yPercent: 30,
      scrollTrigger: {
        trigger: ".hero-container",
        start: "1% top",
        end: "bottom top",
        scrub: true,
      }
    });
  });

  return (
    <section className="bg-main-bg">
      <div className="hero-container">
        <img
          src="/images/static-img.png"
          alt="Hero"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 object-auto scale-100 md:scale-150"
        />
        <div className="hero-content opacity-0">
          <div className="overflow-hidden">
            <h1 className="hero-title">Freaking Delicious</h1>
          </div>
          <div
            style={{
              clipPath: "polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)",
            }}
            className="hero-text-scroll"
          >
            <h1 className="hero-subtitle">Protein + Caffeine</h1>
          </div>
          <h2>
            Live life to the fullest with SPYLT: Shatter boredom and embrace your inner kid with every deliciously smooth chug.
          </h2>
          <button className="hero-button">
            <span>Chug a SPYLT</span>
          </button>
        </div>
      </div>
    </section>
  )
}

export default HeroSection

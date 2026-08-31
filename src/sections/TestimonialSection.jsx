import { useRef } from "react"
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cards } from "../constants"

const TestimonialSection = () => {
  const vdRefs = useRef([]);

  useGSAP(() => {
    gsap.set(".testimonials-section", {
      marginTop: "-100vh",
    });

    const titleTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".testimonials-section",
        start: "top bottom",
        end: "200% top",
        scrub: true,
        // markers: true,
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
  });

  const handlePlay = (index) => {
    const video = vdRefs.current[index];
    console.log(video);
    video?.querySelector('video')?.play();
  }
  const handlePause = (index) => {
    // console.log('mouse leave, target:', vdRefs.current[index]);
    // e.target.querySelector('video').pause();
  }
  return (
    <section className="testimonials-section">
      <div className="absolute size-full flex flex-col items-center pt-[5vw]">
        <h1 className="text-black first-title">What's</h1>
        <h1 className="text-light-brown sec-title">Everyone</h1>
        <h1 className="text-black third-title">Talking</h1>
      </div>

      <div className="pin-box">
        {
          // cards.map((card, index) => (
          //   <div
          //     ref={(el) => (vdRefs.current[index] = el)}
          //     key={index}
          //     className={`vd-card ${card.translation} ${card.rotation}`}
          //     onMouseEnter={(e) => {
          //       console.log('mouse enter, currentTarget:', e.currentTarget);
          //       e.currentTarget.querySelector('video').play();
          //     }}
          //     onMouseLeave={(e) => {
          //       console.log('mouse leave, currentTarget:', e.currentTarget);
          //       e.currentTarget.querySelector('video').pause();
          //     }}
          //     // onMouseEnter={() => handlePlay(index)}
          //     // onMouseLeave={() => handlePause(index)}
          //   >
          //     <video
          //       src={card.src}
          //       className="size-full object-cover"
          //       playsInline
          //       loop
          //       muted
          //     />
          //   </div>
          // ))
        }
      </div>
    </section>
  )
}

export default TestimonialSection

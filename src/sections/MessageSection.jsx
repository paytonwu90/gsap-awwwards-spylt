import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import SplitText from "gsap/SplitText"

const MessageSection = () => {
  useGSAP(() => {
    // autoSplit + onSplit: 字型是非同步載入的，若在字型就緒前 split，量到的文字寬度會是錯的（造成版面跑掉/文字被裁切）。
    // autoSplit 會在字型真正載入完成時自動重新 split 一次，動畫要寫在 onSplit 裡才會套用到重新拆分後、量測正確的元素上。
    SplitText.create(".first-message", {
      type: "words",
      autoSplit: true,
      onSplit: (self) => {
        // 用 fromTo 明講起始色，不要用 to() 讓 GSAP 讀 computed style 當起點：
        // 實測 Firefox 在動畫剛開始播放的當下，偶爾會讀到還沒 resolve 完繼承色的中間態（算成黑色），是時序競爭，fromTo 直接跳過這次讀取。
        gsap.fromTo(self.words, {
          color: "#faeade10",
        }, {
          color: "#faeade",
          ease: "power1.in",
          stagger: 1,
          scrollTrigger: {
            trigger: ".message-content",
            start: "top 80%",
            end: "30% center",
            scrub: true,
          },
        });
      },
    });

    SplitText.create(".second-message", {
      type: "words",
      autoSplit: true,
      onSplit: (self) => {
        gsap.fromTo(self.words, {
          color: "#faeade10",
        }, {
          color: "#faeade",
          ease: "power1.in",
          stagger: 1,
          scrollTrigger: {
            trigger: ".second-message",
            start: "top center",
            end: "bottom center",
            scrub: true,
          },
        });
      },
    });

    SplitText.create(".message-content p", {
      type: "words, lines",
      linesClass: "paragraph-line",
      autoSplit: true,
      onSplit: (self) => {
        gsap.from(self.words, {
          yPercent: 300,
          rotate: 3,
          duration: 1,
          stagger: 0.01,
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: ".message-content p",
            start: "top 60%",
          },
        });
      },
    });

    gsap.to(".msg-text-scroll", {
      delay: 0.3,
      duration: 1,
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      ease: "circ.inOut",
      scrollTrigger: {
        trigger: ".msg-text-scroll",
        start: "top 60%",
      },
    });
  })

  
  return (
    <section className="message-content">
      <div className="container mx-auto relative flex-center py-28">
        <div className="w-full h-full">
          <div className="msg-wrapper">
            <h1 className="first-message">Stir up your fearless past and</h1>

            <div
              className="msg-text-scroll"
              style={{
                clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
              }}
            >
              <div className="bg-light-brown md:pb-5 pb-3 px-5">
                <h2 className="text-red-brown">Fuel Up</h2>
              </div>
            </div>

            <h1 className="second-message">
              your future with every gulp of Perfect Protein
            </h1>
          </div>

          <div className="flex-center md:mt-20 mt-10">
            <div className="max-w-md px-10 flex-center overflow-hidden">
              <p>
                Rev up your rebel spirit and feed the adventure of life with
                SPYLT, where you're one chug away from epic nostalgia and
                fearless fun.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MessageSection

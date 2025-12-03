const AnimatedPets = () => {
  return (
    <>
      {/* Animated Cute Pets */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Chó chạy từ trái sang phải */}
        <div className="absolute bottom-20 left-0 animate-dog-run">
          <div className="text-8xl drop-shadow-2xl">🐕</div>
        </div>

        {/* Mèo nhảy từ phải sang trái */}
        <div className="absolute top-40 right-0 animate-cat-jump">
          <div className="text-7xl drop-shadow-2xl">🐱</div>
        </div>

        {/* Chó con vui vẻ */}
        <div className="absolute top-20 left-10 animate-bounce-slow">
          <div className="text-6xl drop-shadow-xl">🐶</div>
        </div>

        {/* Mèo con dễ thương */}
        <div className="absolute bottom-40 right-20 animate-wiggle">
          <div className="text-6xl drop-shadow-xl">😺</div>
        </div>

        {/* Chó Husky */}
        <div className="absolute top-1/2 left-10 animate-circle">
          <div className="text-7xl drop-shadow-2xl">🐺</div>
        </div>

        {/* Mèo ngủ */}
        <div className="absolute top-32 right-32 animate-float-slow">
          <div className="text-6xl drop-shadow-xl">😸</div>
        </div>

        {/* Chó Poodle */}
        <div className="absolute bottom-1/3 left-1/4 animate-dance">
          <div className="text-7xl drop-shadow-2xl">🐩</div>
        </div>

        {/* Mèo mặt tim */}
        <div className="absolute top-1/3 right-1/4 animate-heart-beat">
          <div className="text-6xl drop-shadow-xl">😻</div>
        </div>

        {/* Dấu chân bay */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl opacity-20 animate-paw-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`
            }}
          >
            🐾
          </div>
        ))}

        {/* Xương và cá */}
        <div className="absolute top-1/4 left-1/3 animate-spin-slow">
          <div className="text-5xl opacity-30">🦴</div>
        </div>
        <div className="absolute bottom-1/4 right-1/3 animate-spin-reverse">
          <div className="text-5xl opacity-30">🐟</div>
        </div>
      </div>

      {/* Animations CSS */}
      <style jsx>{`
        @keyframes dog-run {
          0% { transform: translateX(-200px) scaleX(1); }
          48% { transform: translateX(calc(100vw + 100px)) scaleX(1); }
          50% { transform: translateX(calc(100vw + 100px)) scaleX(-1); }
          98% { transform: translateX(-200px) scaleX(-1); }
          100% { transform: translateX(-200px) scaleX(1); }
        }
        @keyframes cat-jump {
          0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
          25% { transform: translateX(-30vw) translateY(-50px) rotate(-10deg); }
          50% { transform: translateX(-60vw) translateY(0) rotate(0deg); }
          75% { transform: translateX(-90vw) translateY(-50px) rotate(10deg); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        @keyframes circle {
          0% { transform: rotate(0deg) translateX(100px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(100px) rotate(-360deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        @keyframes dance {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(-15deg); }
          50% { transform: translateY(0) rotate(0deg); }
          75% { transform: translateY(-20px) rotate(15deg); }
        }
        @keyframes heart-beat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        @keyframes paw-float {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.2; }
          50% { transform: translateY(-100px) rotate(180deg); opacity: 0.4; }
          100% { transform: translateY(-200px) rotate(360deg); opacity: 0; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-dog-run { animation: dog-run 20s linear infinite; }
        .animate-cat-jump { animation: cat-jump 15s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce 3s ease-in-out infinite; }
        .animate-wiggle { animation: wiggle 2s ease-in-out infinite; }
        .animate-circle { animation: circle 20s linear infinite; }
        .animate-float-slow { animation: float-slow 4s ease-in-out infinite; }
        .animate-dance { animation: dance 3s ease-in-out infinite; }
        .animate-heart-beat { animation: heart-beat 1.5s ease-in-out infinite; }
        .animate-paw-float { animation: paw-float linear infinite; }
        .animate-spin-slow { animation: spin-slow 10s linear infinite; }
        .animate-spin-reverse { animation: spin-reverse 8s linear infinite; }
      `}</style>
    </>
  )
}

export default AnimatedPets

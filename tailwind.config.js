export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Inter", "ui-sans-serif", "system-ui"],
        serif: ["Cormorant Garamond", "Georgia", "serif"]
      },
      colors: {
        void: "#04050d",
        roseglow: "#ff7cbf",
        aurora: "#74d6ff",
        violetstar: "#9a82ff"
      },
      boxShadow: {
        halo: "0 0 80px rgba(255,124,191,.34)",
        bluehalo: "0 0 80px rgba(116,214,255,.28)"
      }
    }
  },
  plugins: []
};

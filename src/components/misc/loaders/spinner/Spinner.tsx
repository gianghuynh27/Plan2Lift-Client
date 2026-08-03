import "./Spinner.css";

export default function Spinner({ size = 40, color = "#3b82f6" }) {
  return (
    <div className="spinner-container" role="status" aria-label="loading">
      <svg
        className="spinner"
        viewBox="0 0 50 50"
        style={{ width: size, height: size }}
      >
        <circle
          className="path"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke={color}
          strokeWidth="4"
        />
      </svg>
    </div>
  );
}

import { Link } from "react-router-dom";

export default function Brand() {
  return (
    <Link className="brand-link" to="/feed" aria-label="Running Friends home">
      <img className="brand-mark" src="/running-social-mark.svg" alt="" />
      <span>Running Friends</span>
    </Link>
  );
}

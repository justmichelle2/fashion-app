import { useParams } from "react-router-dom";

export default function BookTailoring() {
  const { designerId } = useParams();
  return <div className="p-6">Book Tailoring {designerId}</div>;
}

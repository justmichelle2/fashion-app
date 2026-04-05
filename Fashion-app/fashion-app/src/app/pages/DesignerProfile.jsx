import { useParams } from "react-router-dom";

export default function DesignerProfile() {
  const { id } = useParams();
  return <div className="p-6">Designer Profile {id}</div>;
}

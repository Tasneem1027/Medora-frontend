import { useEffect, useState } from "react";

export default function useResource(loader, fallback = []) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState("");

  useEffect(() => {
    let active = true;
    const load = () => {
      setLoading(true);
      Promise.resolve()
        .then(loader)
        .then((result) => {
        if (active) {
          setData(result);
          setWarning("");
        }
        })
        .catch(() => {
        if (active) {
          setData(fallback);
          setWarning("Could not load the locally saved demo data.");
        }
        })
        .finally(() => {
        if (active) setLoading(false);
      });
    };
    load();
    const refresh = () => load();
    window.addEventListener("medora:data-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      active = false;
      window.removeEventListener("medora:data-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [loader, fallback]);

  return { data, setData, loading, warning, setWarning };
}

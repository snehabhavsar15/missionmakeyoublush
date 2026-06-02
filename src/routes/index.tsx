import { createFileRoute } from "@tanstack/react-router";
import Experience from "@/components/birthday/Experience";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "missionmakeyoublush 💌" },
      { name: "description", content: "a cinematic interactive birthday letter for bf dada." },
      { property: "og:title", content: "missionmakeyoublush 💌" },
      { property: "og:description", content: "a cinematic interactive birthday letter." },
    ],
  }),
  component: Index,
});

function Index() {
  return <Experience />;
}

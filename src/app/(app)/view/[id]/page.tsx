import { getPresentationById } from "@/app/actions/presentation";
import PresentationViewer from "@/components/presentation-viewer";
import { PPTData } from "@/app/actions/ai-ppt";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewPresentationPage({ params }: PageProps) {
  const { id } = await params;
  const ppt = await getPresentationById(id);

  return (
    <PresentationViewer
      id={ppt.id}
      title={ppt.title}
      content={ppt.content as PPTData}
      themeId={ppt.themeId}
    />
  );
}

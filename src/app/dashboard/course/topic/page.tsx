import TopicDetailPage from "./TopicDetailPage";

export default async function TopicDetailWrapper({
  searchParams,
}: {
  searchParams: Promise<{ topicId: string; title: string }>;
}) {
  const { topicId, title } = await searchParams;

  return <TopicDetailPage topicId={topicId} title={title} />;
}

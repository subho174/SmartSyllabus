import TopicDetailPage from "./TopicDetailPage";

export default async function TopicDetailWrapper({
  searchParams,
}: {
  searchParams: Promise<{ topicId: string }>;
}) {
  const { topicId } = await searchParams;

  return <TopicDetailPage topicId={topicId} />;
}

import HeroChapter from '@/components/chapters/HeroChapter';
import StoryChapters from '@/components/chapters/StoryChapters';
import IndustriesChapter from '@/components/chapters/IndustriesChapter';
import GlobalChapter from '@/components/chapters/GlobalChapter';
import QuoteChapter from '@/components/chapters/QuoteChapter';
import ChapterRail from '@/components/ChapterRail';

/** Home: the 13-chapter scroll story from the concept images (simplified on phones, see StoryChapters). */
export default function Home() {
  return (
    <>
      <ChapterRail />
      <HeroChapter />
      <StoryChapters />
      <IndustriesChapter />
      <GlobalChapter />
      <QuoteChapter />
    </>
  );
}

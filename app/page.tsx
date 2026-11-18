import HeroChapter from '@/components/chapters/HeroChapter';
import InsideChapter from '@/components/chapters/InsideChapter';
import PlantChapter from '@/components/chapters/PlantChapter';
import ProductChapters from '@/components/chapters/ProductChapters';
import IndustriesChapter from '@/components/chapters/IndustriesChapter';
import GlobalChapter from '@/components/chapters/GlobalChapter';
import QuoteChapter from '@/components/chapters/QuoteChapter';
import ChapterRail from '@/components/ChapterRail';

/** Home: the 13-chapter scroll story from the concept images. */
export default function Home() {
  return (
    <>
      <ChapterRail />
      <HeroChapter />
      <InsideChapter />
      <PlantChapter />
      <ProductChapters />
      <IndustriesChapter />
      <GlobalChapter />
      <QuoteChapter />
    </>
  );
}

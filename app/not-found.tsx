import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="grid min-h-[80vh] place-items-center pt-24">
      <div className="wrap text-center">
        <p className="eyebrow">404</p>
        <h1 className="font-display mt-3 text-[clamp(36px,5vw,60px)] font-bold">This line has no pressure.</h1>
        <p className="mt-4 text-[16px] text-ink-2">The page you were looking for isn&apos;t here.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="btn btn-red">Home</Link>
          <Link href="/products" className="btn btn-ghost">Products</Link>
        </div>
      </div>
    </section>
  );
}

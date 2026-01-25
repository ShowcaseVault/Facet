export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar will be rendered by the page because it needs data */}
      {/* We just provide the container structure here if needed, 
          but actually since Sidebar is data-dependent, 
          we might want the Page to handle the full flex layout 
          OR we can use a Layout if we fetch data in Layout? 
          
          Next.js App Router Layouts can fetch data too. 
          But for now let's keep it simple and let the Page handle the structure 
          since the sidebar content varies heavily.
      */}
      {children} 
    </div>
  );
}

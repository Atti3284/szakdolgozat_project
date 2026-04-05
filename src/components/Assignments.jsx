import Navigation from './Navigation';
import Sidebar from './Sidebar';

export default function Assignments() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold">Feladatok</h1>
          <p className="text-gray-600">Itt lesznek majd a beadandó feladataid.</p>
        </main>
      </div>
    </div>
  );
}
import Navigation from './Navigation';
import Sidebar from './Sidebar';

export default function Assignments() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold">Naptár</h1>
          <p className="text-gray-600">Itt lessz majd a naptár, ahol láthatod a határidőket és hasonló időhöz kötött dolgokat.</p>
        </main>
      </div>
    </div>
  );
}
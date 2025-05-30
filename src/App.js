import logo from './logo.svg';
import './App.css';
import Hero from './components/Hero';
import Container_3D from './components/Container_3D';

function App() {
  return (
    <div className='h-[600vh]'>
      <header className='h-[100vh] w-full bg-[#1d1c1c]'>
        <Hero/>
      </header>
      <main className='bg-[#1d1c1c] sticky top-0'>
        <Container_3D/>
      </main>
      
    </div>
  );
}

export default App;

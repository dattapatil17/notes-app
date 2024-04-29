import './App.css';
import NotesArea from './components/NotesArea';

function App() {
  const handleDragStart = (event) => {
    event.dataTransfer.setData('text', event.target.innerHTML)
  }

  return (
    <div className='window'>
    <NotesArea/>
    <div className='text-grid'>
      <div className="sample-text" id="text-1" onDragStart={handleDragStart}>Take dog for a walk.</div>
      <div className="sample-text" id="text-2" onDragStart={handleDragStart}>Debug code</div>
      <div className="sample-text" id="text-3" onDragStart={handleDragStart}>Get groceries</div>
      <div className="sample-text" id="text-4" onDragStart={handleDragStart}>Write unit tests.</div>
      <div className="sample-text" id="text-5" onDragStart={handleDragStart}>Schedule a meet with manager.</div>
    </div>
    </div>
  );
}

export default App;
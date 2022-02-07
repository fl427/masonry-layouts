import './App.scss';

const genHeight = (): number => {
    return Math.floor(Math.random() * 200 + 100);
}

function App() {
    return (
        <div className="App">
            {Array(16).fill(0).map((_, idx) => {
                const height = genHeight();
                return (
                    <div key={idx} className='card' style={{ height }}>
                        idx: {idx} height: {height}
                    </div>
                )
            })}
        </div>
    );
}

export default App;

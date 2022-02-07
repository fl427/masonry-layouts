import './App.scss';

const genHeight = (): number => {
    return Math.floor(Math.random() * 200 + 100);
}

const genClass = (): string => {
    const classes = ['short', 'tall', 'taller'];
    const idx = Math.floor(Math.random() * 3);
    return classes[idx];
}

function App() {
    return (
        <div className="App">
            {Array(10).fill(0).map((_, idx) => {
                const height = genHeight();
                return (
                    <div key={idx} className={`card ${genClass()}`}>
                        idx: {idx} height: {height}
                    </div>
                )
            })}
        </div>
    );
}

export default App;

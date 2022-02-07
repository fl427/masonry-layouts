import { useEffect, useReducer, useRef, useState } from 'react';
// todo: 懒加载
import './App.scss';

type State = {
    mainMenuList: string[],
    list1: HTMLImageElement[],
    list2: HTMLImageElement[],
    list3: HTMLImageElement[],
    list4: HTMLImageElement[],
}

type Action = {
    type: string;
    payload: HTMLImageElement;
}

const initialState: State = {
    mainMenuList: [
        "https://picsum.photos/id/1/200/300",
        "https://picsum.photos/id/17/200/400",
        "https://picsum.photos/id/18/200/100",
        "https://picsum.photos/id/109/200/200",
        "https://picsum.photos/id/1069/200/600",
        "https://picsum.photos/id/12/200/200",
        "https://picsum.photos/id/130/200/100",
        "https://picsum.photos/id/203/200/100",
        "https://picsum.photos/id/109/200/200",
        "https://picsum.photos/id/11/200/100",
    ],
    list1: [],
    list2: [],
    list3: [],
    list4: [],
}

const reducer = (state: State, action: Action): State => {
    let newState;
    switch (action.type) {
        case 'list1':
            newState = { ...state, list1: [...state.list1, action.payload] };
            break;
        case 'list2':
            newState = { ...state, list2: [...state.list2, action.payload] };
            break;
        case 'list3':
            newState = { ...state, list3: [...state.list3, action.payload] };
            break;
        case 'list4':
            newState = { ...state, list4: [...state.list4, action.payload] };
            break;
        default:
            throw new Error();
    }
    return newState;
}

function App() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const refs = useRef<(HTMLDivElement | null)[]>([]);

    const [listHeights, setListHeights] = useState<number[]>([0, 0, 0, 0]);

    const getHeight = (idx: number) => {
        console.log('height', refs.current[idx], refs.current[idx]?.offsetHeight);

        return refs.current[idx]?.offsetHeight ?? 0;
    }

    // 分配内容
    useEffect(() => {

        const images = state.mainMenuList.map((img) => {
            const newImg = new Image();
            newImg.src = img;
            return newImg;
        })
        console.log('images', images[0].height);

        window.onload = () => {
            images.forEach((img, idx) => {
                const imgHeight = img.height * (233 / img.width);

                const currMin = Math.min(...listHeights);
                const currMinIdx = listHeights.indexOf(currMin);
                console.log(imgHeight, currMin, currMinIdx);

                let newH: number[] = [];
                if (currMinIdx === 0) {
                    newH = [listHeights[0] += imgHeight, listHeights[1], listHeights[2], listHeights[3]];
                } else if (currMinIdx === 1) {
                    newH = [listHeights[0], listHeights[1] += imgHeight, listHeights[2], listHeights[3]];
                } else if (currMinIdx === 2) {
                    newH = [listHeights[0], listHeights[1], listHeights[2] += imgHeight, listHeights[3]];
                } else if (currMinIdx === 3) {
                    newH = [listHeights[0], listHeights[1], listHeights[2], listHeights[3] += imgHeight];
                }
                setListHeights(newH);

                switch (currMinIdx) {
                    case 0:
                        dispatch({ type: 'list1', payload: img });
                        break;
                    case 1:
                        dispatch({ type: 'list2', payload: img });
                        break;
                    case 2:
                        dispatch({ type: 'list3', payload: img });
                        break;
                    case 3:
                        dispatch({ type: 'list4', payload: img });
                        break;
                    default:
                        throw new Error();
                }
            })
        };

    }, [listHeights, state.mainMenuList]);

    return (
        <div className="App">
            <div className='col col0' ref={el => refs.current[0] = el}>
                {state.list1.map((img, idx) => {
                    return (
                        <div key={idx} className={'card'}>
                            <img src={img.src} alt="img" />
                        </div>
                    )
                })}
            </div>
            <div className='col col1' ref={el => refs.current[1] = el}>
                {state.list2.map((img, idx) => {
                    return (
                        <div key={idx} className={'card'}>
                            <img src={img.src} alt="img" />
                        </div>
                    )
                })}
            </div>
            <div className='col col2' ref={el => refs.current[2] = el}>
                {state.list3.map((img, idx) => {
                    return (
                        <div key={idx} className={'card'}>
                            <img src={img.src} alt="img" />
                        </div>
                    )
                })}
            </div>
            <div className='col col3' ref={el => refs.current[3] = el}>
                {state.list4.map((img, idx) => {
                    return (
                        <div key={idx} className={'card'}>
                            <img src={img.src} alt="img" />
                        </div>
                    )
                })}
            </div>
            {/* {Array(10).fill(0).map((_, idx) => {
        const height = genHeight();
        return (
          <div key={idx} className={`card ${genClass()}`}>
            idx: {idx} height: {height}
          </div>
        )
      })} */}
        </div>
    );
}

export default App;

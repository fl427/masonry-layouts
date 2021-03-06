// http://www.noobyard.com/article/p-ouaieffr-gr.html
// https://cloud.tencent.com/developer/article/1347789
// https://blog.csdn.net/thickhair_cxy/article/details/108879467
// https://juejin.cn/post/7012924144618569764
// https://juejin.cn/post/6963071339108237319
// https://juejin.cn/post/6844904051310592014
import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDebounce } from './hooks/useDebounce';
import LazyImage from './components/lazy-image';
// todo: 懒加载
import './App.scss';
import { HeightArrAction, HeightArrStateType, RootState } from './store';

const imageSources = [
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
  "https://images.unsplash.com/photo-1536329583941-14287ec6fc4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1644926566295-f2421386df89?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1644761058126-33eded8935fc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1644916081578-f86b7d7b04d5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxNHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60",
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
  "https://images.unsplash.com/photo-1536329583941-14287ec6fc4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1644926566295-f2421386df89?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1644761058126-33eded8935fc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1644916081578-f86b7d7b04d5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxNHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60",
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
  "https://images.unsplash.com/photo-1536329583941-14287ec6fc4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1644926566295-f2421386df89?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1644761058126-33eded8935fc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1644916081578-f86b7d7b04d5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxNHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60",
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
  "https://images.unsplash.com/photo-1536329583941-14287ec6fc4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1644926566295-f2421386df89?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1644761058126-33eded8935fc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1644916081578-f86b7d7b04d5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxNHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60",
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
  "https://images.unsplash.com/photo-1536329583941-14287ec6fc4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1644926566295-f2421386df89?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1644761058126-33eded8935fc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1644916081578-f86b7d7b04d5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxNHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60",
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
  "https://images.unsplash.com/photo-1536329583941-14287ec6fc4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1644926566295-f2421386df89?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1644761058126-33eded8935fc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1644916081578-f86b7d7b04d5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxNHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60",
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
  "https://images.unsplash.com/photo-1536329583941-14287ec6fc4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1644926566295-f2421386df89?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1644761058126-33eded8935fc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1644916081578-f86b7d7b04d5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxNHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60",
];

type MasonryImageAttrs = 'sourceWidth' | 'sourceHeight' | 'masonryWidth' | 'masonryHeight' | 'offsetY' | 'offsetX';
// 管理每一个内部图片实例
export class MasonryImage {
  src: string;             // 图片src
  imageHtmlIns?: HTMLImageElement; // 图片存放在DOM树种的实例
  sourceWidth?: number;    // 原始图片宽度
  sourceHeight?: number;   // 原始图片高度
  masonryWidth?: number;   // 瀑布流中显示宽度
  masonryHeight?: number;  // 瀑布流中显示高度
  offsetY?: number; // 距离顶部距离 top
  offsetX?: number; // 距离左侧距离 left
  id?: number;

  constructor(source: string, imageHtmlIns?: HTMLImageElement, info?: { sourceWidth?: number, sourceHeight?: number, masonryWidth?: number, masonryHeight?: number }, id?: number) {
    this.src = source;
    this.imageHtmlIns = imageHtmlIns;
    this.sourceWidth = info?.sourceWidth;
    this.sourceHeight = info?.sourceHeight;
    this.masonryWidth = info?.masonryWidth;
    this.masonryHeight = info?.masonryHeight;
    this.id = id;
  }

  public setAttributes(attr: MasonryImageAttrs, value: number) {
    this[attr] = value;
  }
}
interface IProps {
  xAxisGap?: number; // 图片横向间距
  yAxisGap?: number; // 图片纵向间距
}

// 创建内部元素
// 此处我们直接返回创建的元素，由于接下来我们使用了await loadImgHeights方法，进行了预加载，因此能够取得元素的高度
const createItem = (src: string): HTMLImageElement => {
  const img = new Image();
  img.className = 'waterfall-img';
  img.src = src;
  return img;
};

// 并行加载，获取每一个图片的高度
const loadImgHeights = (imgs: string[], itemWidth: number): Promise<MasonryImage[]> => {
  return new Promise((resolve, reject) => {
    const length = imgs.length
    const masonryImages: MasonryImage[] = [];

    let count = 0
    const load = (index: number) => {
      let img = createItem(imgs[index]);
      const checkIfFinished = () => {
        count++
        if (count === length) {
          resolve(masonryImages)
        }
      }
      img.onload = () => {
        // 显示在瀑布流中的高度按照固定宽度以及图片比例计算
        const itemHeight = itemWidth * (img.height / img.width)
        const masonryImageIns = new MasonryImage(imgs[index], img, { sourceWidth: img.width, sourceHeight: img.height, masonryWidth: itemWidth, masonryHeight: itemHeight }, idff++);
        masonryImages[index] = masonryImageIns;
        checkIfFinished()
      }
      img.onerror = () => {
        masonryImages[index] = new MasonryImage('');
        checkIfFinished()
      }
      img.src = imgs[index]
    }
    imgs.forEach((img, index) => load(index))
  })
}

const itemWidth = 235; // 每一项子元素的宽度，即图片在瀑布流中显示宽度，保证每一项等宽不等高

const pageTable = {
  0: {   // pageIdx
    start: 0,   // 当前页的第一张图的idx
    end: 10,    // 当前页的最后一张图的idx
  },
  1: {
    start: 11,
    end: 21,
  }
}

let idff = 0;

const App: React.FC<IProps> = ({ xAxisGap = 4, yAxisGap = 10 }) => {

  const [masonryImages, setMasonryImages] = useState<MasonryImage[]>([]); // 记录目前的图片实例列表
  const loadedIdx = useRef<number>(0); // 用于对已经完成布局定位的元素计数，每次懒加载新增元素时，都只对新增的元素进行布局定位，而之前的元素则不再布局

  const heightArrStore = useSelector<RootState, HeightArrStateType>((state: HeightArrStateType) => state);
  const heightArrRef = React.useRef<number[]>(); // 记录每列的高度
  const waterfallDivRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  // 从接口获取图片src列表
  const handleGetImages = (params?: { start?: number, end?: number }): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      resolve(imageSources.slice(0, params?.start));
    });
  };

  // 获取heightArr数组中最小列的索引
  const getMinIndex = (array: number[]): number => {
    const min = Math.min(...array);
    return array.indexOf(min);
  }

  // 获取当前的页面宽度和计算得出的列数
  const getColumnAndPageWidth = (): {
    pageWidth: number;
    pageHeight: number;
    column: number;
  } => {
    const pageWidth = waterfallDivRef.current?.clientWidth || global.innerWidth;
    const pageHeight = waterfallDivRef.current?.clientHeight || global.innerHeight;
    return {
      pageWidth,
      pageHeight,
      column: Math.floor(pageWidth / (itemWidth + xAxisGap)),
    };
  }

  // 初始化 - 初次加载 & 下滑懒加载
  const init = async (start?: number) => {
    const sources = await handleGetImages({ start: start });
    // 得到目前图片的高度，并行下载
    const masonryImagesApiReturn = await loadImgHeights(sources, itemWidth);

    const imagesOrigin = masonryImages;
    imagesOrigin.push(...masonryImagesApiReturn);

    waterfall(imagesOrigin);
  };

  // heightArrRef.current和loadedIdx.current配合使用
  // 瀑布流函数 决定元素位置
  const waterfall = (images: MasonryImage[] = [], reset: boolean = false) => {
    console.log('imgs2', masonryImages.length, heightArrRef.current, heightArrStore);
    const { pageWidth, column } = getColumnAndPageWidth();

    ///////
    if (reset || !heightArrRef.current || !heightArrRef.current.length) { // 如果resize或者没有初始值，就赋一个
      heightArrRef.current = Array(column).fill(0);
    }
    const heightArr = heightArrRef.current;

    ///////
    // let heightArr: number[] = [...(heightArrStore || [])];
    // if (reset || !heightArrStore || !heightArrStore.length) { // 如果resize或者没有初始值，就赋一个
    //   // dispatch({ type: HeightArrAction.INIT, payload: column });
    //   heightArr = Array(column).fill(0);
    // }

    const masonryImagesTempList: MasonryImage[] = [...images];
    for (let i = loadedIdx.current; i < masonryImagesTempList.length; i++) {
      const masonryImageInstance = masonryImagesTempList?.[i];
      const minIndex = getMinIndex(heightArr);
      // 定位这张图片的top
      const imgTop = heightArr[minIndex] + yAxisGap;
      masonryImageInstance && masonryImageInstance.setAttributes('offsetY', imgTop);

      // 定位这张图片的left
      const leftOffset = (pageWidth - (column * (itemWidth + xAxisGap) - xAxisGap)) / 2; // 左边padding，确保内容居中
      const imgLeft = leftOffset + minIndex * (itemWidth + xAxisGap);
      masonryImageInstance && masonryImageInstance.setAttributes('offsetX', imgLeft);

      heightArr[minIndex] = imgTop + (masonryImageInstance.masonryHeight || 0);
    };
    console.log('imgs-arr', heightArr);
    loadedIdx.current += masonryImagesTempList.length - loadedIdx.current;
    dispatch({ type: HeightArrAction.SET, payload: heightArr });
    setMasonryImages(masonryImagesTempList);
  };

  // 用户Resize窗口时调动
  // TODO: 这里用防抖总觉得不够好，我期望的效果是检测用户正在拖动中，就不做行动，用户只要已停止就立刻调用，看看用RxJS的事件流能不能解决问题
  const resize = useDebounce((): void => {
    if (document.body.offsetWidth < 600) return;
    loadedIdx.current = 0;
    waterfall(masonryImages, true);
  }, 59);

  const [pageIdx, setPageIdx] = useState<0 | 1>(0);

  // 懒加载
  const lazyLoad = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const documentHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;

    // 借由app容器的属性算出当前是否需要加载新的图片
    // const app = document.getElementById('app');
    // if (app) {
    //   if (app?.scrollHeight - app?.scrollTop <= 1.5 * clientHeight) {
    //     console.log('loadedAgain--');
    //     init(10);
    //   }
    // }

    // const tempmasonryImages = [...masonryImages];
    // tempmasonryImages.splice(0, pageTable[0].end);
    // console.log('tempmasonryImages', tempmasonryImages);
    // setRealImages(tempmasonryImages);

    if (documentHeight - scrollTop <= 1.5 * clientHeight) {
      console.log('loadedAgain--');
      // pageTable.get(0).startIdx += 14;
      init(10);
    }
  };

  useEffect(() => {
    // 用户的屏幕宽度不等，初次渲染的图片必定需要覆盖整个屏幕，因此动态计算初始值
    const { pageHeight, column } = getColumnAndPageWidth();
    // init(column * Math.floor(pageHeight / 200));
    init(10);
  }, []);

  useEffect(() => {

    // 初始化瀑布流
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', lazyLoad);
    console.log('render');
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', lazyLoad);
    }
  }, []);

  const getContent = () => {
    // const masonryImagesRendered = [...masonryImages].slice(pageTable[pageIdx].start, pageTable[pageIdx].end);
    const masonryImagesRendered = [...masonryImages];
    console.log('滚-渲染', pageIdx, masonryImagesRendered);
    return (
      masonryImages.map((image, idx) => {
        return (
          <LazyImage image={image} key={idx} idx={image.id} />
        )
      })
    )
  }

  return (
    // <div id="app" className="App" onScroll={lazyLoad} >
    <div id="app" className="App">
      <div id="waterfall" ref={waterfallDivRef}>
        {/* {masonryImages.map((image, idx) => {
          return (
            <LazyImage image={image} key={idx} idx={idx} />
          )
        })} */}
        {getContent()}
      </div>
    </div>
  );
}

export default App;

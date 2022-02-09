// http://www.noobyard.com/article/p-ouaieffr-gr.html
// https://cloud.tencent.com/developer/article/1347789
// https://blog.csdn.net/thickhair_cxy/article/details/108879467
// https://juejin.cn/post/7012924144618569764
// https://juejin.cn/post/6963071339108237319
// https://juejin.cn/post/6844904051310592014
import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { useDebounce } from './hooks/useDebounce';
// todo: 懒加载
import './App.scss';

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
];

type MasonryImageAttrs = 'sourceWidth' | 'sourceHeight' | 'masonryWidth' | 'masonryHeight';
// 管理每一个内部图片实例
class MasonryImage {
  src: string;             // 图片src
  imageHtmlIns?: HTMLImageElement; // 图片存放在DOM树种的实例
  sourceWidth?: number;    // 原始图片宽度
  sourceHeight?: number;   // 原始图片高度
  masonryWidth?: number;   // 瀑布流中显示宽度
  masonryHeight?: number;  // 瀑布流中显示高度

  constructor(source: string, imageHtmlIns?: HTMLImageElement, info?: { sourceWidth?: number, sourceHeight?: number, masonryWidth?: number, masonryHeight?: number }) {
    this.src = source;
    this.imageHtmlIns = imageHtmlIns;
    this.sourceWidth = info?.sourceWidth;
    this.sourceHeight = info?.sourceHeight;
    this.masonryWidth = info?.masonryWidth;
    this.masonryHeight = info?.masonryHeight;
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
        const masonryImageIns = new MasonryImage(imgs[index], img, { sourceWidth: img.width, sourceHeight: img.height, masonryWidth: itemWidth, masonryHeight: itemHeight });
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

const App: React.FC<IProps> = ({ xAxisGap = 4, yAxisGap = 10 }) => {

  const [masonryImages, setMasonryImages] = useState<MasonryImage[]>([]); // 记录目前的图片实例列表
  const waterfallDivRef = useRef<HTMLDivElement>(null);

  // 从接口获取图片src列表
  const handleGetImages = (params?: Record<string, string>): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      resolve(imageSources);
    })
  };

  // 获取heightArr数组中最小列的索引
  const getMinIndex = (array: number[]): number => {
    const min = Math.min(...array);
    return array.indexOf(min);
  }

  // 初始化 - 初次加载 & 下滑懒加载
  const init = async () => {
    const sources = await handleGetImages();
    // 得到目前图片的高度，并行下载
    const masonryImages = await loadImgHeights(sources, itemWidth);
    setMasonryImages(masonryImages);
    console.log('imgXXX', masonryImages);

    const frag = document.createDocumentFragment(); // 每次创建完元素就插入会导致重排，createDocumentFragment存在于内存中，文档插入时仅重排一次
    for (let i = 0; i < masonryImages.length; i++) {
      if (masonryImages[i].imageHtmlIns) { // src为空时（解析失败）跳过
        frag.appendChild(masonryImages[i].imageHtmlIns!);
      }
    };

    console.log(frag.childNodes);

    document.querySelector("#waterfall")?.appendChild(frag);

    waterfall(masonryImages);

  };

  // 瀑布流函数
  const waterfall = useCallback((masonryImages?: MasonryImage[]) => {
    const items = document.querySelectorAll('.waterfall-img') as NodeListOf<HTMLImageElement>;

    const pageWidth = waterfallDivRef.current?.clientWidth || global.innerWidth;
    const column = Math.floor(pageWidth / (itemWidth + xAxisGap)); // 列数 = 页面宽度 / (图片宽度 + 间距)
    const heightArr = Array(column).fill(0); // 保存每一列的高度，初始值为0;
    for (let i = 0; i < items.length; i++) {
      const img = items[i];
      const minIndex = getMinIndex(heightArr);
      // 定位这张图片的top
      const imgTop = heightArr[minIndex] + yAxisGap;
      img.style.top = `${imgTop}px`;
      // 定位这张图片的left
      const leftOffset = (pageWidth - (column * (itemWidth + xAxisGap) - xAxisGap)) / 2; // 左边padding，确保内容居中
      const imgLeft = leftOffset + minIndex * (itemWidth + xAxisGap);
      img.style.left = `${imgLeft}px`;
      // 调整显示高度
      const masonryWidth = itemWidth;
      const masonryHeight = itemWidth * (img.height / img.width); // 按照比例算出显示在瀑布流上的长度
      img.width = masonryWidth;  // 指定img的显示宽度
      img.height = masonryHeight;  // 指定img的显示高度

      heightArr[minIndex] = imgTop + masonryHeight;
    }

  }, [xAxisGap, yAxisGap]);

  // 用户Resize窗口时调动
  const resize = useDebounce(() => {
    if (document.body.offsetWidth < 600) return;

    waterfall(masonryImages);
  }, 25);

  // 懒加载
  const lazyLoad = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const documentHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;

    // console.log('lazyload', scrollTop, documentHeight,  clientHeight)
    if (documentHeight - scrollTop < 1.5 * clientHeight) {
      console.log('initAgain');
      init();
    }
  }


  useEffect(() => {
    // 初始化瀑布流
    init();

    // todo: 防抖
    global.addEventListener('resize', resize);
    window.addEventListener("scroll", lazyLoad)
  }, [xAxisGap, yAxisGap, waterfall]);

  return (
    <div className="App" >
      <div id="waterfall" ref={waterfallDivRef}>

      </div>
    </div>
  );
}

export default App;

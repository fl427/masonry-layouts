// http://www.noobyard.com/article/p-ouaieffr-gr.html
// https://cloud.tencent.com/developer/article/1347789
// https://blog.csdn.net/thickhair_cxy/article/details/108879467
// https://juejin.cn/post/7012924144618569764
// https://juejin.cn/post/6963071339108237319
// https://juejin.cn/post/6844904051310592014
import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
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
  sourceWidth?: number;    // 原始图片宽度
  sourceHeight?: number;   // 原始图片高度
  masonryWidth?: number;   // 瀑布流中显示宽度
  masonryHeight?: number;  // 瀑布流中显示高度

  constructor(source: string) {
    this.src = source;
  }

  public addAttributes(attr: MasonryImageAttrs, value: number) {
    this[attr] = value;
  }
}

interface IProps {
  xAxisGap?: number; // 图片横向间距
  yAxisGap?: number; // 图片纵向间距
}

// 并行加载，获取每一个图片的高度
const loadImgHeights = (imgs: string[], itemWidth = 235): Promise<number[]> => {
  return new Promise((resolve, reject) => {
    const length = imgs.length
    const heights: number[] = []
    let count = 0
    const load = (index: number) => {
      let img = new Image()
      const checkIfFinished = () => {
        count++
        if (count === length) {
          resolve(heights)
        }
      }
      img.onload = () => {
        const ratio = img.height / img.width
        const halfHeight = ratio * itemWidth
        // 高度按屏幕一半的比例来计算
        heights[index] = halfHeight
        checkIfFinished()
      }
      img.onerror = () => {
        heights[index] = 0
        checkIfFinished()
      }
      img.src = imgs[index]
    }
    imgs.forEach((img, index) => load(index))
  })
}


const App: React.FC<IProps> = ({ xAxisGap = 4, yAxisGap = 10 }) => {

  const masonryImageIns = new MasonryImage('');
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

  // 创建内部元素
  // 此处我们直接返回创建的元素，由于接下来我们使用了await loadImgHeights方法，进行了预加载，因此能够取得元素的高度
  const createItem = (src: string): HTMLImageElement => {
    const img = new Image();
    img.className = 'waterfall-img';
    img.src = src;
    return img;
    // return new Promise(function (resolve, reject) {
    //   img.onload = function () {
    //     resolve(img);
    //   }
    // });
  };

  // 瀑布流函数
  const waterfall = useCallback(() => {
    const items = document.querySelectorAll('.waterfall-img') as NodeListOf<HTMLImageElement>;

    const itemWidth = 235; // 每一项子元素的宽度，即图片在瀑布流中显示宽度，保证每一项等宽不等高
    // const pageWidth = global.innerWidth; // 当前页面的宽度
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

  useEffect(() => {
    const itemWidth = 235; // 每一项子元素的宽度，即图片在瀑布流中显示宽度，保证每一项等宽不等高
    // const pageWidth = global.innerWidth; // 当前页面的宽度
    const pageWidth = waterfallDivRef.current?.clientWidth || global.innerWidth;
    console.log('pageWidth', pageWidth);
    const column = Math.floor(pageWidth / (itemWidth + xAxisGap)); // 列数 = 页面宽度 / (图片宽度 + 间距)
    const heightArr = Array(column).fill(0); // 保存每一列的高度，初始值为0;

    // 初始化瀑布流
    const init = async () => {

      const sources = await handleGetImages();
      console.log('sources', sources);
      // 得到目前图片的高度，因为是并行，所以不需要等待每个图片都加载完
      // todo: 这里返回我定义的Image类更好，imageHeights目前没用
      const imageHeights = await loadImgHeights(sources, itemWidth);
      console.log('imgXXX', imageHeights);

      const frag = document.createDocumentFragment(); // 每次创建完元素就插入会导致重排，createDocumentFragment存在于内存中，文档插入时仅重排一次
      for (let i = 0; i < sources.length; i++) {
        frag.appendChild(createItem(sources[i]));
        // await createItem(sources[i]).then((img) => {
        //   console.log('img', img.src, img.height);
        //   const minIndex = getMinIndex(heightArr);
        //   // 定位这张图片的top
        //   const imgTop = heightArr[minIndex] + yAxisGap;
        //   img.style.top = `${imgTop}px`;
        //   // 定位这张图片的left
        //   const leftOffset = (pageWidth - (column * (itemWidth + xAxisGap) - xAxisGap)) / 2; // 左边padding，确保内容居中
        //   const imgLeft = leftOffset + minIndex * (itemWidth + xAxisGap);
        //   img.style.left = `${imgLeft}px`;
        //   // 调整显示高度
        //   const masonryWidth = itemWidth;
        //   const masonryHeight = itemWidth * (img.height / img.width); // 按照比例算出显示在瀑布流上的长度
        //   img.width = masonryWidth;  // 指定img的显示宽度
        //   img.height = masonryHeight;  // 指定img的显示高度

        //   heightArr[minIndex] = imgTop + masonryHeight;
        //   frag.appendChild(img);
        // })
      };

      console.log(frag.childNodes);

      document.querySelector("#waterfall")?.appendChild(frag);

      waterfall();
    };
    init();

    const resize = () => {
      if (document.body.offsetWidth < 600) return;

      waterfall();
    }
    // todo: 防抖
    global.addEventListener('resize', resize);
  }, [xAxisGap, yAxisGap, waterfall]);

  return (
    <div className="App" >
      <div id="waterfall" ref={waterfallDivRef}>

      </div>
    </div>
  );
}

export default App;

import React, { useEffect, useState, useMemo } from 'react';
import { MasonryImage } from '../../App';

import { useInView } from '../../hooks/useInView';

import './index.scss';

interface IProps {
    image: MasonryImage
    idx?: number;
}

// 利用 IntersectionObserver 监听元素是否出现在视口
const io = new IntersectionObserver((entries) => { // 观察者
    entries.forEach(item => { // entries是被监听的元素集合
        if (item.intersectionRatio <= 0) return; // intersectionRatio 是可见度 如果当前元素不可见就结束该函数。
        const { target } = item;
    })
});

export enum LOAD_STATUS {
    SUCCESS = 0,
    FAIL = 1,
    LOADING = 2,
}

// 懒加载图片Element
const LazyImage: React.FC<IProps> = ({ image, idx }) => {

    const { ref, inView } = useInView();

    const [imageUrl, setImageUrl] = useState<string>('');
    const [loadStatus, setLoadStatus] = useState<LOAD_STATUS>(LOAD_STATUS.LOADING);

    // 图片进入视口才开始加载
    useEffect(() => {
        if (inView && !imageUrl) {
            setImageUrl(image.src);
        }
    }, [image.src, inView, imageUrl]);

    // 图片加载成功回调
    const handleLoadSuccess = (): void => {
        setLoadStatus(LOAD_STATUS.SUCCESS);
    }

    // 图片加载失败回调
    const handleLoadFail = (): void => {
        setLoadStatus(LOAD_STATUS.FAIL);
    }

    // 图片加载失败占位
    const errDiv = useMemo(() => {
        return (
            <div>
                图片加载失败
            </div>
        )
    }, []);

    return (
        <>
            {loadStatus === LOAD_STATUS.FAIL ? (
                { errDiv }
            ) : (
                <div ref={ref}
                    className='card'
                    style={{
                        top: image.offsetY,
                        left: image.offsetX,
                        width: image.masonryWidth,
                        height: image.masonryHeight
                    }}
                >
                    {imageUrl &&
                        <img

                            src={imageUrl}
                            alt=''
                            className='waterfall-img'
                            onLoad={handleLoadSuccess}
                            onError={handleLoadFail}
                        />}
                    <div style={{ fontSize: '40px', background: 'red', position: 'absolute', left: '0px', top: '20px', zIndex: 9999, width: '100px', height: '100px' }}>
                        idx: {idx}
                    </div>

                </div>

            )}
        </>

    );
};

export default LazyImage;


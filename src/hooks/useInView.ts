import { useState, useCallback } from 'react';
export { };

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        const inView = entry.intersectionRatio > 0;
    })
})
/**
 * 利用Intersection API观察当前图片是否进入视图，进入视图范围才会加载图片
 * 
 * @return ref: 用来'锚定'我们要观察的DOM元素
 * @return inView: 该元素是否进入视图
 */
export const useInView = (): {
    ref: (node?: HTMLDivElement | null) => void;
    inView: Boolean;
} => {
    const [inView, setInView] = useState(false);

    const ref = useCallback((node?: HTMLDivElement | null) => {
        if (!node) {
            return;
        }
        observer.observe(node);
        console.log('绑定元素方法');
        setInView(true);
    }, []);
    return { ref, inView };
}
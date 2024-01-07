import { useEffect, useState } from "react";

export default (element: any) => {
    const [isVisible, setIsVisible] = useState(false);
    const callback = ([entry]: any) => {
      setIsVisible(entry.isIntersecting);
    };
  
    useEffect(() => {
      const watch = new IntersectionObserver(callback);

      if (element) {
        watch.observe(element);
        return () => watch.unobserve(element);
      }

      return () => watch.disconnect();
    }, [element]);
  
    return isVisible && !!element;
};
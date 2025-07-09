import { useEffect, useRef } from 'react';

export const useIntersectionObserver = (callback, options = {}) => {
  const targetRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const defaultOptions = {
      threshold: 0.1,
      rootMargin: '50px',
      ...options
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry);
        }
      });
    }, defaultOptions);

    observerRef.current.observe(target);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [callback, options]);

  return targetRef;
};

export const createLazyLoader = (loadCallback) => {
  const targets = new Map();
  let observer = null;

  const observe = (element, data) => {
    if (!observer) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const data = targets.get(entry.target);
            if (data) {
              loadCallback(data);
              observer.unobserve(entry.target);
              targets.delete(entry.target);
            }
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '50px'
      });
    }

    targets.set(element, data);
    observer.observe(element);
  };

  const unobserve = (element) => {
    if (observer && targets.has(element)) {
      observer.unobserve(element);
      targets.delete(element);
    }
  };

  const disconnect = () => {
    if (observer) {
      observer.disconnect();
      targets.clear();
      observer = null;
    }
  };

  return { observe, unobserve, disconnect };
};

export const useLazyImage = (src, options = {}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imageRef = useRef(null);

  const loadImage = useCallback(() => {
    if (!src) return;

    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
      setIsError(false);
    };
    img.onerror = () => {
      setIsError(true);
      setIsLoaded(false);
    };
    img.src = src;
  }, [src]);

  useIntersectionObserver(loadImage, options);

  return { imageSrc, isLoaded, isError, ref: imageRef };
};

export const useVisibilityObserver = (callback, options = {}) => {
  const targetRef = useRef(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        callback(entry.isIntersecting, entry);
      });
    }, {
      threshold: 0.1,
      ...options
    });

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [callback, options]);

  return targetRef;
};

export const createScrollObserver = (callback) => {
  let isScrolling = false;
  let lastScrollTime = 0;

  const handleScroll = () => {
    const now = Date.now();
    lastScrollTime = now;

    if (!isScrolling) {
      isScrolling = true;
      callback({ type: 'start', timestamp: now });
    }

    // Debounce scroll end detection
    setTimeout(() => {
      if (now - lastScrollTime >= 100) {
        isScrolling = false;
        callback({ type: 'end', timestamp: now });
      }
    }, 100);
  };

  const startObserving = () => {
    window.addEventListener('scroll', handleScroll, { passive: true });
  };

  const stopObserving = () => {
    window.removeEventListener('scroll', handleScroll);
  };

  return { startObserving, stopObserving };
};

export const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState('up');
  const [isScrolling, setIsScrolling] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY.current) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY.current) {
        setScrollDirection('up');
      }
      
      lastScrollY.current = currentScrollY;
      setIsScrolling(true);

      // Debounce scroll end
      clearTimeout(window.scrollEndTimeout);
      window.scrollEndTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(window.scrollEndTimeout);
    };
  }, []);

  return { scrollDirection, isScrolling };
};

// Performance optimization for intersection observer
export const createBatchedObserver = (callback, options = {}) => {
  const callbacks = new Map();
  let observer = null;

  const observe = (element, elementCallback) => {
    if (!observer) {
      observer = new IntersectionObserver((entries) => {
        const batch = [];
        entries.forEach(entry => {
          const elementCallback = callbacks.get(entry.target);
          if (elementCallback) {
            batch.push({ entry, callback: elementCallback });
          }
        });
        
        // Process batch
        batch.forEach(({ entry, callback }) => {
          callback(entry);
        });
        
        // Call global callback with batch
        if (callback) {
          callback(batch.map(item => item.entry));
        }
      }, options);
    }

    callbacks.set(element, elementCallback);
    observer.observe(element);
  };

  const unobserve = (element) => {
    if (observer && callbacks.has(element)) {
      observer.unobserve(element);
      callbacks.delete(element);
    }
  };

  const disconnect = () => {
    if (observer) {
      observer.disconnect();
      callbacks.clear();
      observer = null;
    }
  };

  return { observe, unobserve, disconnect };
};
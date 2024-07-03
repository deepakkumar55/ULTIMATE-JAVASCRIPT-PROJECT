const $$ = (selector) => document.querySelectorAll(selector);
const $ = (selector) => document.querySelector(selector);

const LAZY_IMAGE_SELECTOR = ".gallery__image--lazy";
const GALLERY_CONTAINER_SELECTOR = ".gallery__container";
const INTERSECTION_OBSERVER_OPTIONS = {
  rootMargin: "0px 0px 500px 0px"
};
const SCROLL_THROTTLE_DELAY = 20;
const LAZY_LOAD_OFFSET = 500;

// Module IntersectionObserver
const IntersectionObserverModule = {
  init(lazyImages) {
    const imageObserver = new IntersectionObserver(this.handleIntersection, INTERSECTION_OBSERVER_OPTIONS);
    lazyImages.forEach(image => imageObserver.observe(image));
  },

  handleIntersection(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        ImageLoader.load(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }
};

// Module FallbackLazyLoad
const FallbackLazyLoadModule = {
  init(lazyImages) {
    this.lazyImages = Array.from(lazyImages);
    this.container = $(GALLERY_CONTAINER_SELECTOR);
    this.bindEvents();
    this.lazyload();
  },

  bindEvents() {
    this.throttledLazyload = this.throttle(this.lazyload.bind(this), SCROLL_THROTTLE_DELAY);
    this.container.addEventListener("scroll", this.throttledLazyload);
    window.addEventListener("resize", this.throttledLazyload);
  },

  throttle(func, delay) {
    let lastCall = 0;
    return function (...args) {
      const now = new Date().getTime();
      if (now - lastCall < delay) return;
      lastCall = now;
      return func(...args);
    }
  },

  lazyload() {
    const containerRect = this.container.getBoundingClientRect();
    const containerScrollTop = this.container.scrollTop;

    this.lazyImages = this.lazyImages.filter(img => {
      const imgRect = img.getBoundingClientRect();
      if (imgRect.top < (containerRect.height + containerScrollTop + LAZY_LOAD_OFFSET)) {
        ImageLoader.load(img);
        return false;
      }
      return true;
    });

    if (this.lazyImages.length === 0) {
      this.removeEventListeners();
    }
  },

  removeEventListeners() {
    this.container.removeEventListener("scroll", this.throttledLazyload);
    window.removeEventListener("resize", this.throttledLazyload);
  }
};


const ImageLoader = {
  async load(image) {
    try {
      if (!image.dataset.src) {
        throw new Error("Image source not found");
      }
      await this.loadImage(image, image.dataset.src);
      image.classList.remove("lazy");
    } catch (error) {
      console.error("Error loading image:", error);
    }
  },

  loadImage(img, src) {
    return new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = src;
    });
  }
};

function initLazyLoading() {
  const lazyImages = $$(LAZY_IMAGE_SELECTOR);

  if ("IntersectionObserver" in window) {
    IntersectionObserverModule.init(lazyImages);
  } else {
    FallbackLazyLoadModule.init(lazyImages);
  }
}

document.addEventListener("DOMContentLoaded", initLazyLoading);

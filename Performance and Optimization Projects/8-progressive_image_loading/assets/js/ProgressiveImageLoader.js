import { ELEMENTS, ATTRIBUTES, CLASSES } from './constants.js';

import { $$, $ } from './utils.js';

class ProgressiveImageLoader {
  constructor() {
    this.init();
  }

  init() {
    this.initProgressiveImages();
  }

  initProgressiveImages() {
    const progressiveImages = $$(ELEMENTS.PROGRESSIVE_IMAGE);
    progressiveImages.forEach(container => this.loadHighResolutionImage(container));
  }

  loadHighResolutionImage(container) {
    const image = new Image();
    const previewImage = $(ELEMENTS.LOADING_IMAGE, container);
    const newImage = $(ELEMENTS.OVERLAY, container);

    if (previewImage && previewImage.hasAttribute(ATTRIBUTES.DATA_IMAGE)) {
      image.onload = () => this.updateImageDisplay(container, newImage, image.src);
      image.onerror = () => console.error('Failed to load high-resolution image');
      const imageSrc = previewImage.getAttribute(ATTRIBUTES.DATA_IMAGE);
      image.src = imageSrc;
    } else {
      console.warn('Preview image or data-image attribute not found');
    }
  }

  updateImageDisplay(container, element, imageSrc) {
    element.style.backgroundImage = `url(${imageSrc})`;

    element.addEventListener('transitionend', () => {
      container.classList.add(CLASSES.LOADED);
      console.log('Image loading complete');
    }, { once: true }); // Ensure event listener is only called once

    element.style.opacity = '1';
  }
}

export default ProgressiveImageLoader;
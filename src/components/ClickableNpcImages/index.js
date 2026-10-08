import {useEffect} from 'react';
import {useLocation} from '@docusaurus/router';

export default function ClickableNpcImages() {
  const location = useLocation();

  useEffect(() => {
    const selector = 'img.npc-header-image, img.character-image';

    function makeClickable(img) {
      if (img.closest('a')) return;

      const link = document.createElement('a');
      link.href = img.currentSrc || img.src;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.className = 'clickable-npc-image';
      link.setAttribute('aria-label', `Open full-size image: ${img.alt || 'Character'}`);

      img.parentNode.insertBefore(link, img);
      link.appendChild(img);
    }

    function updateImages() {
      document.querySelectorAll(selector).forEach(makeClickable);
    }

    updateImages();

    const observer = new MutationObserver(updateImages);

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  return null;
}